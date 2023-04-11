use redis::{Client, aio::Connection};

#[derive(Debug, Clone)]
pub struct RedisConnection {
    url: String,
    client: Option<Client>,
}

impl RedisConnection {
    pub fn get_client(&self) -> Result<Client, String> {
        let client = redis::Client::open(self.url.as_ref());
        return match client {
            Ok(data) => Ok(data),
            Err(_) => Err("创建客户端失败，请检查配置信息后重试".to_string()),
        }
    }
    pub async fn get_async_connection(&self) -> Result<Connection, String> {
        let client = match &self.client {
            Some(data) => data,
            None => return Err("创建连接失败，请检查配置信息后重试".to_string()),
        };
        let connection = client.get_async_connection().await;
        return match connection {
            Ok(data) => Ok(data),
            Err(_) => Err("创建连接失败，请检查配置信息后重试".to_string()),
        }
    }
    pub async fn get_redis_info(&self) -> Result<String, String> {
        let mut connection = self.get_async_connection().await?;
        let result = redis::cmd("info").query_async::<_, String>(&mut connection).await;
        return match result {
            Ok(data) => Ok(data),
            Err(_) => Err("查询信息失败".to_string()),
        };
    }
    pub async fn get_keys(&self, key: Option<String>) -> Vec<String> {
        let mut connection = self.get_async_connection().await.unwrap();
        let mut arg = String::from("*");
        if key.is_some() {
            let key = key.unwrap();
            arg = format!("*{}*", key);
        }
        let result = redis::cmd("KEYS").arg(arg).query_async::<_, Vec<String>>(&mut connection).await;
        return match result {
            Ok(data) => data,
            Err(_) => vec![],
        };
    }
    pub fn init(url: &String) -> Result<RedisConnection, String> {
        let mut redis_connection = RedisConnection {
            url: url.to_string(),
            client: None,
        };
        let client = match redis_connection.get_client() {
            Ok(data) => data,
            Err(error) => return Err(error),
        };
        redis_connection.client = Some(client);
        Ok(redis_connection)
    }
}