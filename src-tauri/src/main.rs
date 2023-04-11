#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use driver::app_server::AppServer;

mod command;
mod common;
mod dao;
mod driver;


#[tokio::main]
async fn main() {
    AppServer::default()
        .init_state()
        .await
        .start();
}
