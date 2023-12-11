// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::warn;
use tauri_plugin_log::{LogTarget, fern::colors::ColoredLevelConfig};
use std::process::{Command, Stdio};
use serde::{Serialize, Deserialize};
use std::env;
use tokio::process::Command as AsyncCommand;
use tokio::io::{AsyncReadExt};
mod update_packages;
mod firewall;
mod unused_packages;
mod usb;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    warn!("{}! - this is from rust", &name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// #[derive(Debug, Serialize, Deserialize)]
// struct UsbDevice {
//     sequence: u32,
//     id: String,
//     name: String,
// }


// #[tauri::command]
// fn list_usb_devices() -> Result<String, String> {
//     let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;

//     let script_path = current_dir.join("scripts/list_usb.sh");


//     let output = Command::new("bash")
//         .arg(script_path)
//         .stdin(Stdio::inherit()) // Inherit standard input for password prompt
//         .output();

//         match output {
//             Ok(output) => {
//                 // Check if the command was successful
//                 if output.status.success() {
//                     // Process the output and extract device information
//                     let result = String::from_utf8_lossy(&output.stdout);
//                     let devices: Vec<UsbDevice> = result
//                         .lines()
//                         .filter_map(|line| {
//                             let parts: Vec<&str> = line.trim().split_whitespace().collect();
//                             if parts.len() >= 7 && parts[0].parse::<u32>().is_ok() {
//                                 let sequence = parts[0].parse().unwrap();
//                                 let id = parts[1];
//                                 let name = parts[6..].join(" ");
//                                 Some(UsbDevice { sequence, id: id.to_string(), name })
//                             } else {
//                                 None
//                             }
//                         })
//                         .collect();
    
//                     // Convert the device information to JSON
//                     let json_output = serde_json::to_string_pretty(&devices);
//                     match json_output {
//                         Ok(json) => Ok(json),
//                         Err(err) => Err(format!("Error converting to JSON: {}", err)),
//                     }
//                 } else {
//                     // Return the error if the command failed
//                     let error: std::borrow::Cow<'_, str> = String::from_utf8_lossy(&output.stderr);
//                     Err(error.into_owned())
//                 }
//             }
//             Err(err) => {
//                 // Return the error if the command couldn't be executed
//                 Err(format!("Error executing command: {}", err))
//             }
//         }
// }


const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::Webview]; //logs to the web console - for debugging
// const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::LogDir]; //logs to the log file - for production

#[tokio::main]
async fn main() {
    tauri::Builder::default()
    .plugin(
        tauri_plugin_log::Builder::default().targets(LOG_TARGETS)
    
       .with_colors(ColoredLevelConfig::default())
        .build()
    )
        .invoke_handler(tauri::generate_handler![
            greet,
            usb::list_usb_devices,
            unused_packages::remove_unused_packages,
            update_packages::update_and_upgrade_packages,
            firewall::apply_firewall_rules
             ]
            )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
