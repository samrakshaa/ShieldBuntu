// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::warn;
use tauri_plugin_log::{LogTarget, fern::colors::ColoredLevelConfig};
use std::process::{Command, Stdio};
use serde::{Serialize, Deserialize};
use std::env;
use tokio::process::Command as AsyncCommand;
use tokio::io::{AsyncReadExt};

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

    let script_path = current_dir.join("scripts/list_usb.sh");


    let output = Command::new("bash")
        .arg(script_path)
        .stdin(Stdio::inherit()) // Inherit standard input for password prompt
        .output();

        match output {
            Ok(output) => {
                // Check if the command was successful
                if output.status.success() {
                    // Process the output and extract device information
                    let result = String::from_utf8_lossy(&output.stdout);
                    let devices: Vec<UsbDevice> = result
                        .lines()
                        .filter_map(|line| {
                            let parts: Vec<&str> = line.trim().split_whitespace().collect();
                            if parts.len() >= 7 && parts[0].parse::<u32>().is_ok() {
                                let sequence = parts[0].parse().unwrap();
                                let id = parts[1];
                                let name = parts[6..].join(" ");
                                Some(UsbDevice { sequence, id: id.to_string(), name })
                            } else {
                                None
                            }
                        })
                        .collect();
    
                    // Convert the device information to JSON
                    let json_output = serde_json::to_string_pretty(&devices);
                    match json_output {
                        Ok(json) => Ok(json),
                        Err(err) => Err(format!("Error converting to JSON: {}", err)),
                    }
                } else {
                    // Return the error if the command failed
                    let error: std::borrow::Cow<'_, str> = String::from_utf8_lossy(&output.stderr);
                    Err(error.into_owned())
                }
            }
            Err(err) => {
                // Return the error if the command couldn't be executed
                Err(format!("Error executing command: {}", err))
            }
        }
}


#[tauri::command]
async fn remove_unused_packages() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/unused_package_remover.sh");

    // Run the bash script to remove unused packages
    let mut child = tokio::process::Command::new("bash")
        .arg(&script_path)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Await the child process completion
    let status = child.wait().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    if status.success() {
        Ok(true.to_string())
    } else {
        let mut error_output = String::new();
        if let Some(mut stderr) = child.stderr.take() {
            stderr.read_to_string(&mut error_output).await.map_err(|e| format!("Error reading stderr: {}", e))?;
        }
        Err(format!("Error removing unused packages: {}", error_output))
    }
}


#[tauri::command]
async fn update_and_upgrade_packages() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/update_packages.sh");

    // Run the bash script for updating and upgrading packages
    let mut child = AsyncCommand::new("bash")
        .arg("-c")
        .arg(&script_path)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    let status = child.wait().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    if status.success() {
        Ok(true.to_string())
    } else {
        let mut error_output = String::new();
        if let Some(mut stderr) = child.stderr.take() {
            stderr.read_to_string(&mut error_output).await.map_err(|e| format!("Error reading stderr: {}", e))?;
        }
        Err(format!("Error executing command: {}", error_output))
    }
}


#[tauri::command]
async fn apply_firewall_rules() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/firewall.sh");

    // Run the bash script for applying firewall rules
    let mut child = AsyncCommand::new("bash")
        .arg(script_path)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Await the child process completion
    let status = child.wait().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    if status.success() {
        Ok(true.to_string())
    } else {
        let mut error_output = String::new();
        if let Some(mut stderr) = child.stderr.take() {
            stderr.read_to_string(&mut error_output).await.map_err(|e| format!("Error reading stderr: {}", e))?;
        }
        Err(format!("Error executing command: {}", error_output))
    }
}



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
        .invoke_handler(tauri::generate_handler![greet, list_usb_devices, remove_unused_packages, update_and_upgrade_packages, apply_firewall_rules])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
