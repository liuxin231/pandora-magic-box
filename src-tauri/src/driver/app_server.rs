use std::sync::{Arc, Mutex};

use tauri::{Manager, Config, api::path::app_local_data_dir};

use crate::{command::redis_handler, driver::db_connection::SqliteConnection};

use super::redis_connection::RedisConnection;

pub struct AppServer {
    pub inner: tauri::App,
}

#[derive(Debug)]
pub struct AppState {
    pub sqlite_pool: sqlx::Pool<sqlx::Sqlite>,
    pub redis_client: Arc<Mutex<Option<RedisConnection>>>,
}

impl AppState {
    pub async fn default(app_config: &Arc<Config>) -> AppState {
        let db_dir_path = app_local_data_dir(&app_config).unwrap_or_default();
        let sqlite_connection = SqliteConnection::default(db_dir_path.as_os_str()).await;
        AppState {
            sqlite_pool: sqlite_connection.pool,
            redis_client: Arc::new(Mutex::new(None)),
        }
    }
    pub async fn get_redis_client(&self) -> RedisConnection {
        let redis_connection = &self.redis_client.lock().unwrap().clone().unwrap();
        // let redis_client = &self.redis_client.lock().unwrap().clone().clone().unwrap();
        redis_connection.clone()
    }
}

impl AppServer {
    pub fn default() -> AppServer {
        let app = tauri::Builder::default();
        let app = redis_handler(app);
        let app = app
            .build(tauri::generate_context!())
            .expect("error while building tauri application");
        AppServer { inner: app }
    }
    pub async fn init_state(self) -> AppServer {
        self.inner.manage(AppState::default(&self.inner.config()).await);
        self
    }
    pub fn start(self) {
        self.inner.run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
    }
}
