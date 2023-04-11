use std::collections::{HashMap, HashSet};

use redis::AsyncCommands;
use tauri::{command, State};

use crate::{
    dao::redis::RedisInfo,
    driver::{app_server::AppState, redis_connection::RedisConnection},
};

#[command]
pub async fn redis_info_save(
    mut redis_info: RedisInfo,
    app_state: State<'_, AppState>,
) -> Result<String, String> {
    let now_timestamp = chrono::Local::now().timestamp();
    let is_connection = redis_info.check_is_connection().await;
    if !is_connection {
        return Err("无法连接".to_string());
    }
    match redis_info.id {
        Some(_) => {
            let redis_id = redis_info.id.as_ref().unwrap();
            let redis_info_old = RedisInfo::find_by_id(redis_id, &app_state.sqlite_pool).await;
            match redis_info_old {
                Some(redis_info_old) => {
                    redis_info.create_time = redis_info_old.create_time;
                    redis_info.modify_time = Some(now_timestamp);
                    redis_info.visit_time = Some(now_timestamp);
                    redis_info.visit_num = Some(0);
                    redis_info.status = Some(1);
                    let _result = redis_info.update(&app_state.sqlite_pool).await;
                }
                None => return Err("无数据".to_string()),
            }
        }
        None => {
            let redis_id = uuid::Uuid::new_v4().to_string();
            redis_info.id = Some(redis_id);
            redis_info.create_time = Some(now_timestamp);
            redis_info.modify_time = Some(now_timestamp);
            redis_info.visit_time = Some(now_timestamp);
            redis_info.visit_num = Some(0);
            redis_info.status = Some(1);
            let result = redis_info.save(&app_state.sqlite_pool).await;
            if result.is_none() {
                println!("save redis info result is none.")
            }
        }
    }
    Ok(String::from("保存成功"))
}

#[command]
pub async fn redis_info_delete(
    ids: Vec<String>,
    app_state: State<'_, AppState>,
) -> Result<String, String> {
    if !ids.is_empty() {
        for id in ids {
            RedisInfo::delete(&id, &app_state.sqlite_pool).await;
        }
    }
    Ok(String::from("删除成功"))
}

#[command]
pub async fn redis_info_find_all(app_state: State<'_, AppState>) -> Result<Vec<RedisInfo>, String> {
    let result = RedisInfo::find_all(&app_state.sqlite_pool).await;
    Ok(result)
}

#[command]
pub async fn redis_info_find_by_id(
    id: String,
    app_state: State<'_, AppState>,
) -> Result<RedisInfo, String> {
    let result = RedisInfo::find_by_id(&id, &app_state.sqlite_pool).await;
    return match result {
        Some(data) => Ok(data),
        None => Err("无数据".to_string()),
    };
}

#[command]
pub async fn redis_info_delete_keys(
    keys: Vec<String>,
    app_state: State<'_, AppState>,
) -> Result<String, String> {
    let redis_client = app_state.get_redis_client().await;
    let mut connection = redis_client.get_async_connection().await.unwrap();
    connection.del::<_, ()>(keys).await.unwrap();
    Ok("删除成功".to_string())
}

#[command]
pub async fn set_redis_connection_state(
    redis_id: String,
    app_state: State<'_, AppState>,
) -> Result<String, String> {
    let redis_info = RedisInfo::find_by_id(&redis_id, &app_state.sqlite_pool).await;
    if redis_info.is_none() {
        return Err("连接信息错误".to_string());
    }
    let redis_info = redis_info.unwrap();
    let url = redis_info.gen_redis_url();
    let is_connection = redis_info.check_is_connection().await;
    if !is_connection {
        return Err("无法连接，请检查网络或连接信息".to_string());
    }
    let redis_connection = RedisConnection::init(&url);
    return match redis_connection {
        Ok(data) => {
            let mut redis_client = app_state.redis_client.lock().unwrap();
            *redis_client = Some(data);
            Ok("连接成功".to_string())
        }
        Err(error) => Err(error),
    };
}

#[command]
pub async fn get_redis_info(
    app_state: State<'_, AppState>,
) -> Result<HashMap<String, String>, String> {
    let redis_client = app_state.get_redis_client().await;
    let result = redis_client.get_redis_info().await;
    return match result {
        Ok(data) => {
            let mut info = HashMap::<String, String>::new();
            let lines = data.lines();
            for line in lines {
                if !line.is_empty() && !line.starts_with("#") {
                    let line_vec: Vec<&str> = line.split(":").collect();
                    info.insert(line_vec[0].to_string(), line_vec[1].to_string());
                }
            }
            Ok(info)
        }
        Err(error) => return Err(error.to_string()),
    };
}

#[command]
pub async fn redis_search_key(
    app_state: State<'_, AppState>,
) -> Result<Vec<HashMap<String, String>>, String> {
    let redis_client = app_state.get_redis_client().await;
    let keys = redis_client.get_keys(None).await;
    let result = keys
        .iter()
        .map(|item| {
            let mut map = HashMap::new();
            map.insert("key".to_string(), item.to_string());
            map
        })
        .collect();
    Ok(result)
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct KeyInfo {
    pub r#type: String,
    pub ttl: i32,
    pub size: usize,
    pub value: Option<RedisKeyType>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub enum RedisKeyType {
    STRING(String),
    HASH(HashMap<String, String>),
    LIST(Vec<String>),
    SET(Vec<String>),
    ZSET(Vec<(String, isize)>),
    STREAM(CustomStreamReply),
    UNKNOWN,
}
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct CustomStreamReply {
    pub columns: HashSet<String>,
    pub data: HashMap<String, HashMap<String, String>>
}
#[command]
pub async fn redis_get_key_info(
    key: String,
    app_state: State<'_, AppState>,
) -> Result<KeyInfo, String> {
    let redis_client = app_state.get_redis_client().await;
    let mut connection = redis_client.get_async_connection().await.unwrap();
    let key_type = redis::cmd("TYPE")
        .arg(&key)
        .query_async::<_, String>(&mut connection)
        .await;
    if key_type.is_err() {
        return Err("查询错误".to_string());
    }
    let key_type = key_type.unwrap();
    let ttl = connection.ttl::<_, i32>(&key).await;
    if ttl.is_err() {
        return Err("查询错误".to_string());
    }
    let ttl = ttl.unwrap();
    if ttl == -2 {
        return Err("数据过期，请刷新后重试".to_string());
    }
    let mut size = 0;
    let value = match &key_type as &str {
        "string" => {
            let value = connection.get::<_, Vec<u8>>(&key).await.unwrap();
            size = value.len();
            Some(RedisKeyType::STRING(
                String::from_utf8_lossy(&value).to_string(),
            ))
        }
        "hash" => {
            let value: HashMap<String, String> = connection.hgetall(&key).await.unwrap();
            size = std::mem::size_of_val(&value);
            Some(RedisKeyType::HASH(value))
        }
        "list" => {
            let llen: isize = connection.llen(&key).await.unwrap();
            let value: Vec<String> = connection.lrange(&key, 0, llen).await.unwrap();
            size = std::mem::size_of_val(&value);
            Some(RedisKeyType::LIST(value))
        }
        "set" => {
            let value: Vec<String> = connection.smembers(&key).await.unwrap();
            size = std::mem::size_of_val(&value);
            Some(RedisKeyType::SET(value))
        }
        "zset" => {
            let mut result = connection.zscan::<_, String>(&key).await.unwrap();
            let mut value_list = vec![];
            while let Some(element) = result.next_item().await {
                value_list.push(element)
            }
            let mut value: Vec<(String, isize)> = vec![];
            value_list.iter().enumerate().for_each(|(index, item)| {
                if index % 2 == 0 {
                    value.push((
                        item.to_string(),
                        value_list[index + 1].parse::<isize>().unwrap(),
                    ));
                }
            });
            size = std::mem::size_of_val(&value);
            Some(RedisKeyType::ZSET(value))
        }
        "stream" => {
            let value = connection
                .xrange_all::<_, redis::streams::StreamRangeReply>(&key)
                .await
                .unwrap();
            size = std::mem::size_of_val(&value);
            let mut columns = HashSet::new();
            let mut result_map = HashMap::<String, HashMap<String, String>>::new();
            for stream_id in value.ids {
                let mut map = HashMap::<String, String>::new();
                for (key, value) in stream_id.map.iter() {
                    columns.insert(key.to_string());
                    match value {
                        redis::Value::Data(data) => {
                            map.insert(key.to_string(), format!("{}", String::from_utf8_lossy(&data)));
                        },
                        _ => {},
                    }
                }
                result_map.insert(stream_id.id.to_string(), map);
            }
            Some(RedisKeyType::STREAM(CustomStreamReply {
                columns: columns,
                data: result_map,
            }))
        }
        _ => None,
    };
    let result = KeyInfo {
        r#type: key_type,
        ttl,
        size,
        value,
    };
    Ok(result)
}
