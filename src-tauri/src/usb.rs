use serde::{Serialize, Deserialize};
use tokio::process::Command as AsyncCommand;
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use std::process::Stdio;


#[derive(Debug, Serialize, Deserialize)]
struct UsbDevice1 {
    sequence: u32,
    id: String,
    name: String,
}

#[tauri::command]
pub async fn list_usb_devices() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;

    let script_path = current_dir.join("scripts/apply/list_usb.sh");

    // Use tokio::fs::File to open the script file asynchronously
    let mut file = File::open(&script_path).await.map_err(|e| format!("Error opening script file: {}", e))?;

    // Create a buffer to read the script content
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).await.map_err(|e| format!("Error reading script file: {}", e))?;

    // Use tokio::process::Command to execute the script asynchronously
    let output = AsyncCommand::new("bash")
        .arg("-c")
        .arg(String::from_utf8_lossy(&buffer).to_string())
        .stdin(Stdio::null()) // Inherit standard input for password prompt
        .output()
        .await
        .map_err(|e| format!("Error executing command: {}", e))?;

    // Check if the command was successful
    if output.status.success() {
        // Process the output and extract device information
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

        // Convert the device information to JSON
        let json_output = serde_json::to_string_pretty(&devices).map_err(|e| format!("Error converting to JSON: {}", e))?;
        Ok(json_output)
    } else {
        // Return the error if the command failed
        let error: std::borrow::Cow<'_, str> = String::from_utf8_lossy(&output.stderr);
        Err(error.into_owned())
    }
}



#[derive(Debug, Serialize, Deserialize)]
struct UsbDevice2 {
    full_info: String,
}


#[tauri::command]
pub async fn list_usb_devices_usbguard() -> Result<String, String> {
    // Use tokio::process::Command to execute the script asynchronously
    let output = AsyncCommand::new("bash")
        .arg("-c")
        .arg("sudo usbguard list-devices")
        .stdin(Stdio::null()) // Inherit standard input for password prompt
        .output()
        .await
        .map_err(|e| format!("Error executing command: {}", e))?;

    // Check if the command was successful
    if output.status.success() {
        // Process the output and extract device information
        let result = String::from_utf8_lossy(&output.stdout);
        let devices: Vec<UsbDevice2> = result
            .lines()
            .map(|line| UsbDevice2 {
                full_info: line.trim().to_string(),
            })
            .collect();

        // Convert the device information to JSON
        let json_output = serde_json::to_string_pretty(&devices).map_err(|e| format!("Error converting to JSON: {}", e))?;
        Ok(json_output)
    } else {
        // Return the error if the command failed
        let error_output = String::from_utf8_lossy(&output.stderr);
        Err(error_output.into_owned())
    }
}

