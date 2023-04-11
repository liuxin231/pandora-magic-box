use std::{path::Path, ffi::OsStr};

use sqlx::SqlitePool;

pub struct SqliteConnection {
    pub pool: sqlx::Pool<sqlx::Sqlite>,
}
const DB_FILE_NAME: &str = "app.data";
impl SqliteConnection {
    pub async fn default<S: AsRef<OsStr> + ?Sized>(db_path: &S) -> SqliteConnection {
        let db_path = Path::new(&db_path);
        let db_path = db_path.join(DB_FILE_NAME);
        let db_file_path = std::path::Path::new(&db_path);
        if !db_file_path.exists() {
            std::fs::create_dir_all(db_file_path.parent().unwrap()).unwrap_or_default();
            std::fs::File::create(db_file_path).unwrap();
        }
        let pool = SqlitePool::connect(db_file_path.to_str().unwrap_or_default()).await.unwrap();
        SqliteConnection { pool }.init_db().await
    }

    #[allow(dead_code)]
    pub async fn init_db(self) -> SqliteConnection {
        sqlx::query(
            "
            create table if not exists redis_info (
                id varchar(100) primary key not null,
                name text,
                ip varchar(255),
                port integer,
                account varchar(255),
                password blob,
                status tinyint,
                visit_num integer,
                visit_time integer,
                create_time integer,
                modify_time tinteger
            ) without rowid;
        ",
        )
        .execute(&self.pool)
        .await
        .unwrap();
        self
    }
}
