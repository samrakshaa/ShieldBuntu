// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::warn;
use tauri_plugin_log::{LogTarget, fern::colors::ColoredLevelConfig};
use std::process::{Command, Stdio};
use serde::{Serialize, Deserialize};
use std::env;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    warn!("{}! - this is from rust", &name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[derive(Debug, Serialize, Deserialize)]
struct UsbDevice {
    sequence: u32,
    id: String,
    name: String,
}


#[tauri::command]
fn list_usb_devices() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;

    let script_path = current_dir.join("scripts/list_connected_usb.sh");


    let output = Command::new("bash")
        .arg(script_path)
        .stdin(Stdio::inherit()) // Inherit standard input for password prompt
        .output();

        // Check if the command executed successfully
    match output {
        Ok(output) => {
            // Check if the command was successful
            if output.status.success() {
                // Return the output of the command
                let result = String::from_utf8_lossy(&output.stdout);
                Ok(result.into_owned())
            } else {
                // Return the error if the command failed
                let error = String::from_utf8_lossy(&output.stderr);
                Err(error.into_owned())
            }
        }
        Err(err) => {
            // Return the error if the command couldn't be executed
            Err(format!("Error executing command: {}", err))
        }
    }
}

const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::Webview]; //logs to the web console - for debugging
// const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::LogDir]; //logs to the log file - for production

fn main() {
    tauri::Builder::default()
    .plugin(
        tauri_plugin_log::Builder::default().targets(LOG_TARGETS)
    
       .with_colors(ColoredLevelConfig::default())
        .build()
    )
        .invoke_handler(tauri::generate_handler![greet, list_usb_devices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
