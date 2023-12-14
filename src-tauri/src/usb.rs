use serde::{Serialize, Deserialize};
use tokio::process::Command as AsyncCommand;
use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use std::process::Stdio;
use crate::get_password;


#[derive(Debug, Serialize, Deserialize)]
struct UsbDevice1 {
    sequence: u32,
    id: String,
    name: String,
}

#[tauri::command]
pub async fn list_usb_devices() -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/apply/list_usb.sh");

    // Read the script file asynchronously
    let mut file = File::open(&script_path).await.map_err(|e| format!("Error opening script file: {}", e))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).await.map_err(|e| format!("Error reading script file: {}", e))?;

    // Execute the script asynchronously
    let mut command = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg("-c")
        .arg(String::from_utf8_lossy(&buffer).to_string())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error executing command: {}", e))?;

    // Write the password to stdin
    if let Some(mut stdin) = command.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Wait for the command to complete
    let output = command.wait_with_output().await
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    // Process the output
    if output.status.success() {
        let result = String::from_utf8_lossy(&output.stdout);
        let devices: Vec<UsbDevice1> = result
            .lines()
            .enumerate()
            .filter_map(|(index, line)| {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 6 {
                    let sequence = (index + 1) as u32;
                    let id = parts[6];
                    let name = parts[7..].join(" ");
                    Some(UsbDevice1 { sequence, id: id.to_string(), name })
                } else {
                    None
                }
            })
            .collect();

        serde_json::to_string_pretty(&devices).map_err(|e| format!("Error converting to JSON: {}", e))
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(error.into_owned())
    }
}



#[derive(Debug, Serialize, Deserialize)]
struct UsbDevice2 {
    sequence: u32,
    id: String,
    name: String,
    state: String
}

#[tauri::command]
pub async fn list_usb_devices_usbguard() -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/apply/connected_usb_devices_status.sh");

    // Read the script file asynchronously
    let mut file = File::open(&script_path).await.map_err(|e| format!("Error opening script file: {}", e))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).await.map_err(|e| format!("Error reading script file: {}", e))?;

    // Execute the script asynchronously
    let mut command = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg("-c")
        .arg(String::from_utf8_lossy(&buffer).to_string())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error executing command: {}", e))?;

    // Write the password to stdin
    if let Some(mut stdin) = command.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Wait for the command to complete
    let output = command.wait_with_output().await
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    // Process the output
    if output.status.success() {
        let result = String::from_utf8_lossy(&output.stdout);
        let devices: Vec<UsbDevice2> = result
            .lines()
            .enumerate()
            .filter_map(|(index, line)| {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 8 {
                    let sequence = (index + 1) as u32;
                    let id = parts[4];
                    let name_index = parts.iter().position(|&r| r.starts_with("name")).unwrap_or(parts.len());
                    let name = parts[name_index..].join(" ").split("\"").nth(1).unwrap_or("").to_string();
                    let state = parts[2].to_string();
                    Some(UsbDevice2 { sequence, id: id.to_string(), name, state })
                } else {
                    None
                }
            })
            .collect();

        serde_json::to_string_pretty(&devices).map_err(|e| format!("Error converting to JSON: {}", e))
    } else {
        let error_output = String::from_utf8_lossy(&output.stderr);
        Err(error_output.into_owned())
    }
}
