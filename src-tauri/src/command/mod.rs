use tauri::{Wry, Builder, generate_handler};

pub mod redis;

pub fn redis_handler(builder: Builder<Wry>) -> Builder<Wry> {
    builder.invoke_handler(generate_handler![
        redis::redis_info_delete,
        redis::redis_info_save,
        redis::redis_info_find_all,
        redis::redis_info_find_by_id,
        redis::set_redis_connection_state,
        redis::get_redis_info,
        redis::redis_search_key,
        redis::redis_get_key_info,
        redis::redis_info_delete_keys,
    ])
}
