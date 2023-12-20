use chrono::Utc;
use serde::{Serialize, Deserialize};
use serde_json::json;
use tokio::process::Command as AsyncCommand;
use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use std::env;
use std::fs::{OpenOptions, self};
use std::io::{Write, Read};
use std::path::Path;
use std::process::Stdio;
use crate::get_password;
use tauri::AppHandle;


#[derive(Debug, Serialize, Deserialize)]
struct UsbDevice1 {
    id: String,
    name: String,
}

#[tauri::command]
pub async fn list_usb_devices(handle : AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/apply/list_usb.sh");
    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/apply/list_usb.sh")
    .expect("failed to resolve resource");

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
            .filter_map(|(_, line)| {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 6 {
                    // let sequence = (index + 1) as u32;
                    let id = parts[6];
                    let name = parts[7..].join(" ");
                    Some(UsbDevice1 { id: id.to_string(), name })
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
    // sequence: u32,
    id: String,
    name: String,
    state: String
}

#[tauri::command]
pub async fn list_usb_devices_usbguard(handle : AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/apply/connected_usb_devices_status.sh");
    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/apply/connected_usb_devices_status.sh")
    .expect("failed to resolve resource");

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
            .filter_map(|(_, line)| {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 8 {
                    // let sequence = (index + 1) as u32;
                    let id = parts[4];
                    let name_index = parts.iter().position(|&r| r.starts_with("name")).unwrap_or(parts.len());
                    let name = parts[name_index..].join(" ").split("\"").nth(1).unwrap_or("").to_string();
                    let state = parts[2].to_string();
                    Some(UsbDevice2 {id: id.to_string(), name, state })
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


// #[tauri::command]
// pub async fn apply_usb_blocking() -> Result<String, String> {
//     let password = get_password().ok_or_else(|| "Password not available".to_string())?;
//     let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
//     let script_path = current_dir.join("scripts/apply/usb_blocking.sh");
//     let log_file_path = current_dir.join("logs/usb_blocking_log.txt");

//     // Open or create the log file for appending
//     let mut file = OpenOptions::new()
//         .create(true)
//         .append(true)
//         .open(&log_file_path)
//         .map_err(|e| format!("Error opening log file: {}", e))?;

//     // Write the current date and time to the log file
//     let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
//     file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
//         .map_err(|e| format!("Error writing to log file: {}", e))?;

//     // Run the bash script for applying firewall rules
//     let mut child = Command::new("sudo")
//         .arg("-S")
//         .arg("bash")
//         .arg(script_path)
//         .stdin(Stdio::piped())
//         .stdout(Stdio::piped())
//         .stderr(Stdio::piped())
//         .spawn()
//         .map_err(|e| format!("Error spawning process: {}", e))?;

//     if let Some(mut stdin) = child.stdin.take() {
//         stdin.write_all(format!("{}\n", password).as_bytes()).map_err(|e| format!("Error writing to stdin: {}", e))?;
//     }

//     // Capture the output
//     let output = child.wait_with_output().map_err(|e| format!("Error waiting for process: {}", e))?;
    
//     // Write the output to the log file
//     file.write_all(&output.stdout)
//         .and_then(|_| file.write_all(&output.stderr))
//         .map_err(|e| format!("Error writing to log file: {}", e))?;

//     // Read the entire log file to include in the response
//     let mut file = OpenOptions::new()
//         .read(true)
//         .open(&log_file_path)
//         .map_err(|e| format!("Error opening log file: {}", e))?;

//     let mut log_contents = String::new();
//     file.read_to_string(&mut log_contents)
//         .map_err(|e| format!("Error reading log file: {}", e))?;

//     // Construct the JSON-like return value
//     let result = if output.status.success() {
//         json!({ "success": true, "logs": log_contents }).to_string()
//     } else {
//         json!({ "success": false, "logs": log_contents }).to_string()
//     };
//     Ok(result)
// }


// #[tauri::command]
// pub async fn reverse_usb_blocking() -> Result<String, String> {
//     let password = get_password().ok_or_else(|| "Password not available".to_string())?;
//     let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
//     let script_path = current_dir.join("scripts/reverse/r-usb_blocking.sh");
//     let log_file_path = current_dir.join("logs/reverse_usb_blocking_log.txt");

//     // Open or create the log file for appending
//     let mut file = OpenOptions::new()
//         .create(true)
//         .append(true)
//         .open(&log_file_path)
//         .map_err(|e| format!("Error opening log file: {}", e))?;

//     // Write the current date and time to the log file
//     let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
//     file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
//         .map_err(|e| format!("Error writing to log file: {}", e))?;

//     // Run the bash script for applying firewall rules
//     let mut child = Command::new("sudo")
//         .arg("-S")
//         .arg("bash")
//         .arg(script_path)
//         .stdin(Stdio::piped())
//         .stdout(Stdio::piped())
//         .stderr(Stdio::piped())
//         .spawn()
//         .map_err(|e| format!("Error spawning process: {}", e))?;

//     if let Some(mut stdin) = child.stdin.take() {
//         stdin.write_all(format!("{}\n", password).as_bytes()).map_err(|e| format!("Error writing to stdin: {}", e))?;
//     }

//     // Capture the output
//     let output = child.wait_with_output().map_err(|e| format!("Error waiting for process: {}", e))?;
    
//     // Write the output to the log file
//     file.write_all(&output.stdout)
//         .and_then(|_| file.write_all(&output.stderr))
//         .map_err(|e| format!("Error writing to log file: {}", e))?;

//     // Read the entire log file to include in the response
//     let mut file = OpenOptions::new()
//         .read(true)
//         .open(&log_file_path)
//         .map_err(|e| format!("Error opening log file: {}", e))?;

//     let mut log_contents = String::new();
//     file.read_to_string(&mut log_contents)
//         .map_err(|e| format!("Error reading log file: {}", e))?;

//     // Construct the JSON-like return value
//     let result = if output.status.success() {
//         json!({ "success": true, "logs": log_contents }).to_string()
//     } else {
//         json!({ "success": false, "logs": log_contents }).to_string()
//     };
//     Ok(result)
// }


#[allow(non_snake_case)]
#[tauri::command]
pub async fn apply_usb_blocking(handle : AppHandle,usbIds: Vec<String>) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/apply/usb_blocking.sh");
    // let log_file_path = current_dir.join("logs/usb_blocking_log.txt");
    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/apply/usb_blocking.sh")
    .expect("failed to resolve resource");

    let log_directory = match env::var("HOME") {
    Ok(home) => format!("{}/.samrakshak_logs", home),
    Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
    .map_err(|e| format!("Error creating directory: {}", e))?;

    let log_file_path = Path::new(&log_directory).join("usb_blocking_log.txt");



    // Open or create the log file for appending
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    // Write the current date and time to the log file
    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Prepare the command with USB IDs as arguments
    let mut command = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path)
        .args(usbIds) // Pass the USB IDs to the script
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Write the password to stdin
    if let Some(mut stdin) = command.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Capture the output
    let output = command.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Write the output to the log file
    file.write_all(&output.stdout)
        .and_then(|_| file.write_all(&output.stderr))
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Read the entire log file to include in the response
    let mut file = OpenOptions::new()
        .read(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let mut log_contents = String::new();
    file.read_to_string(&mut log_contents)
        .map_err(|e| format!("Error reading log file: {}", e))?;

    // Construct the JSON-like return value
    let result = if output.status.success() {
        json!({ "success": true, "logs": log_contents }).to_string()
    } else {
        json!({ "success": false, "logs": log_contents }).to_string()
    };

    Ok(result)
}


#[allow(non_snake_case)]
#[tauri::command]
pub async fn reverse_usb_blocking(usb_ids: Vec<String>) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/reverse/r-usb_blocking.sh");
    // let log_file_path = current_dir.join("logs/reverse_usb_blocking_log.txt");

    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/reverse/r-usb_blocking.sh")
    .expect("failed to resolve resource");

    let log_directory = match env::var("HOME") {
    Ok(home) => format!("{}/.samrakshak_logs", home),
    Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
    .map_err(|e| format!("Error creating directory: {}", e))?;

    let log_file_path = Path::new(&log_directory).join("reverse_usb_blocking_log.txt");


    // Open or create the log file for appending
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    // Write the current date and time to the log file
    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Prepare the command with USB IDs as arguments
    let mut command = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path)
        .args(usbIds) // Pass the USB IDs to the script
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Write the password to stdin
    if let Some(mut stdin) = command.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Capture the output
    let output = command.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Write the output to the log file
    file.write_all(&output.stdout)
        .and_then(|_| file.write_all(&output.stderr))
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Read the entire log file to include in the response
    let mut file = OpenOptions::new()
        .read(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let mut log_contents = String::new();
    file.read_to_string(&mut log_contents)
        .map_err(|e| format!("Error reading log file: {}", e))?;

    // Construct the JSON-like return value
    let result = if output.status.success() {
        json!({ "success": true, "logs": log_contents }).to_string()
    } else {
        json!({ "success": false, "logs": log_contents }).to_string()
    };

    Ok(result)
}


#[allow(non_snake_case)]
#[tauri::command]
pub async fn whitelist_usb(usb_ids: Vec<String>) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/apply/whitelist_usbs.sh");
    // let log_file_path = current_dir.join("logs/whitelist_usb_log.txt");

    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/apply/whitelist_usbs.sh")
    .expect("failed to resolve resource");

let log_directory = match env::var("HOME") {
    Ok(home) => format!("{}/.samrakshak_logs", home),
    Err(_) => return Err("Could not retrieve user's home directory".to_string()),
};

fs::create_dir_all(&log_directory)
    .map_err(|e| format!("Error creating directory: {}", e))?;

let log_file_path = Path::new(&log_directory).join("whitelist_usb_log.txt");


    // Open or create the log file for appending
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    // Write the current date and time to the log file
    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Prepare the command with USB IDs as arguments
    let mut command = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path)
        .args(usbIds) // Pass the USB IDs to the script
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Write the password to stdin
    if let Some(mut stdin) = command.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Capture the output
    let output = command.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Write the output to the log file
    file.write_all(&output.stdout)
        .and_then(|_| file.write_all(&output.stderr))
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Read the entire log file to include in the response
    let mut file = OpenOptions::new()
        .read(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let mut log_contents = String::new();
    file.read_to_string(&mut log_contents)
        .map_err(|e| format!("Error reading log file: {}", e))?;

    // Construct the JSON-like return value
    let result = if output.status.success() {
        json!({ "success": true, "logs": log_contents }).to_string()
    } else {
        json!({ "success": false, "logs": log_contents }).to_string()
    };

    Ok(result)
}


#[allow(non_snake_case)]
#[tauri::command]
pub async fn blacklist_usb(usb_ids: Vec<String>) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/apply/blacklist_usbs.sh");
    // let log_file_path = current_dir.join("logs/blacklist_usb_log.txt");

    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/apply/blacklist_usbs.sh")
    .expect("failed to resolve resource");

let log_directory = match env::var("HOME") {
    Ok(home) => format!("{}/.samrakshak_logs", home),
    Err(_) => return Err("Could not retrieve user's home directory".to_string()),
};

fs::create_dir_all(&log_directory)
    .map_err(|e| format!("Error creating directory: {}", e))?;

let log_file_path = Path::new(&log_directory).join("blacklist_usb_log.txt");


    // Open or create the log file for appending
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    // Write the current date and time to the log file
    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Prepare the command with USB IDs as arguments
    let mut command = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path)
        .args(usbIds) // Pass the USB IDs to the script
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Write the password to stdin
    if let Some(mut stdin) = command.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Capture the output
    let output = command.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Write the output to the log file
    file.write_all(&output.stdout)
        .and_then(|_| file.write_all(&output.stderr))
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Read the entire log file to include in the response
    let mut file = OpenOptions::new()
        .read(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let mut log_contents = String::new();
    file.read_to_string(&mut log_contents)
        .map_err(|e| format!("Error reading log file: {}", e))?;

    // Construct the JSON-like return value
    let result = if output.status.success() {
        json!({ "success": true, "logs": log_contents }).to_string()
    } else {
        json!({ "success": false, "logs": log_contents }).to_string()
    };

    Ok(result)
}



#[tauri::command]
pub async fn check_usb(handle : AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/check/check_usb_guard.sh");

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/check/check_usb_guard.sh")
        .expect("failed to resolve resource");

    // Run the bash script for checking firewall status
    let mut child = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Await the child process completion
    let output = child.wait_with_output().await
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    if output.status.success() {
        let output_str = String::from_utf8(output.stdout)
            .map_err(|e| format!("Failed to read output: {}", e))?;

        Ok(output_str)  // Return the output directly
    } else {
        let error_output = String::from_utf8(output.stderr)
            .map_err(|e| format!("Failed to read error output: {}", e))?;
        Err(format!("Error executing command: {}", error_output))
    }
}


// #[tokio::main]
// async fn main() {
//     // Example USB IDs to pass to the function
//     let usbIds = vec!["17ef:6099".to_string(), "0bda:c123".to_string()];

//     println!("{:?}", usbIds);

//     // Call the whitelist_usb function
//     match whitelist_usb(usbIds).await {
//         Ok(result) => println!("Result: {}", result),
//         Err(e) => eprintln!("Error: {}", e),
//     }
// }
