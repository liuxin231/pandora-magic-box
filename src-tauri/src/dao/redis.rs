use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, sqlx::FromRow, Debug)]
pub struct RedisInfo {
    pub id: Option<String>,
    pub name: Option<String>,
    pub ip: Option<String>,
    pub port: Option<i32>,
    pub account: Option<String>,
    pub password: Option<String>,
    pub status: Option<i32>,
    pub visit_num: Option<i32>,
    pub visit_time: Option<i64>,
    pub create_time: Option<i64>,
    pub modify_time: Option<i64>,
}

impl RedisInfo {
    pub fn gen_redis_url(&self) -> String {
        let account = match &self.account {
            Some(data) => {
                if data.is_empty() {
                    None
                } else {
                    Some(data.as_str())
                }
            },
            None => None,
        };
        let password = match &self.password {
            Some(data) => {
                if data.is_empty() {
                    None
                } else {
                    Some(data.as_str())
                }
            },
            None => None,
        };
        return if account.is_some() && password.is_some() {
            format!("redis://{}:{}@{}:{}", account.unwrap(), password.unwrap(), &self.ip.as_ref().unwrap(), &self.port.as_ref().unwrap())
        } else if account.is_none() && password.is_some() {
            format!("redis://default:{}@{}:{}", password.unwrap(), &self.ip.as_ref().unwrap(), &self.port.as_ref().unwrap())
        } else {
            format!("redis://{}:{}", &self.ip.as_ref().unwrap(), &self.port.as_ref().unwrap())
        }
    }
    pub async fn check_is_connection(&self) -> bool {
        let redis_url = self.gen_redis_url();
        let client = redis::Client::open(redis_url);
        return match client {
            Ok(client) => {
                let connection = client.get_connection_with_timeout(std::time::Duration::from_millis(500));
                match connection {
                    Ok(_) => true,
                    Err(_) => false,
                }
            },
            Err(_) => false,
        }
    }
    pub async fn save(&self, pool: &sqlx::Pool<sqlx::Sqlite>) -> Option<RedisInfo> {
        let result = sqlx::query_as::<_, RedisInfo>(
            "
                insert into redis_info (id, name, ip, port, account, password, status, visit_num, visit_time, create_time, modify_time)
                values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11) returning *;
            "
        )
        .bind(&self.id)
        .bind(&self.name)
        .bind(&self.ip)
        .bind(&self.port)
        .bind(&self.account)
        .bind(&self.password)
        .bind(&self.status)
        .bind(&self.visit_num)
        .bind(&self.visit_time)
        .bind(&self.create_time)
        .bind(&self.modify_time)
        .fetch_one(pool).await;
        return match result {
            Ok(data) => Some(data),
            Err(error) => {
                println!("save redis info error: {}", error.to_string());
                None
            }
        };
    }
    pub async fn update(&self, pool: &sqlx::Pool<sqlx::Sqlite>) -> Option<RedisInfo> {
        let result = sqlx::query_as::<_, RedisInfo>(
            "
                update redis_info set name = ?2, ip = ?3, port = ?4, account = ?5, password = ?6, status = ?7, visit_num = ?8, visit_time = ?9, modify_time = ?10 where id = ?1 returning *;
            "
        )
        .bind(&self.id)
        .bind(&self.name)
        .bind(&self.ip)
        .bind(&self.port)
        .bind(&self.account)
        .bind(&self.password)
        .bind(&self.status)
        .bind(&self.visit_num)
        .bind(&self.visit_time)
        .bind(&self.modify_time)
        .fetch_one(pool).await;
        return match result {
            Ok(data) => Some(data),
            Err(error) => {
                println!("update redis info error: {}", error.to_string());
                None
            }
        };
    }
    pub async fn find_all(pool: &sqlx::Pool<sqlx::Sqlite>) -> Vec<RedisInfo> {
        let result = sqlx::query_as::<_, RedisInfo>("select * from redis_info;")
            .fetch_all(pool)
            .await;
        return match result {
            Ok(data) => data,
            Err(error) => {
                println!("find all redis info error: {}", error.to_string());
                vec![]
            }
        };
    }

    pub async fn find_by_id(id: &String, pool: &sqlx::Pool<sqlx::Sqlite>) -> Option<RedisInfo> {
        let result = sqlx::query_as::<_, RedisInfo>("select * from redis_info where id = ?1;")
            .bind(id)
            .fetch_one(pool)
            .await;
        return match result {
            Ok(data) => Some(data),
            Err(error) => {
                println!("find redis info by id error: {}", error.to_string());
                None
            }
        };
    }
    pub async fn delete(id: &String, pool: &sqlx::Pool<sqlx::Sqlite>) {
        let result = sqlx::query("delete from redis_info where id = (?1);")
            .bind(id)
            .execute(pool)
            .await;
        match result {
            Ok(_) => {}
            Err(error) => println!("delete redis info error: {}", error),
        }
    }
    #[allow(dead_code)]
    pub fn new() -> RedisInfo {
        let now_timestamp = chrono::Local::now().timestamp();
        RedisInfo {
            id: Some(uuid::Uuid::new_v4().to_string()),
            name: None,
            ip: None,
            port: None,
            account: None,
            password: None,
            status: Some(1),
            visit_num: Some(0),
            visit_time: Some(now_timestamp),
            create_time: Some(now_timestamp),
            modify_time: Some(now_timestamp),
        }
    }
}
