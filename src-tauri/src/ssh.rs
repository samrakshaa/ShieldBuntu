use std::env;
use std::fs::{OpenOptions, self};
use std::io::{Read, Write};
use std::path::Path;
use std::process::{Command, Stdio};
use chrono::Utc;
use tokio::io::AsyncWriteExt;
use tokio::process::Command as AsyncCommand;
use serde_json::json;
use crate::get_password;

#[tauri::command]
pub async fn apply_ssh_rules(handle: tauri::AppHandle, arguments: Vec<String>) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.shieldbuntu_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory).map_err(|e| format!("Error creating directory: {}", e))?;

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/ssh.sh")
        .expect("failed to resolve resource");

    let log_file_path = Path::new(&log_directory).join("ssh_apply_log.txt");

    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Create a mutable Command object
    let mut command = Command::new("sudo");
    command.arg("-S")
           .arg("bash")
           .arg(script_path.to_str().unwrap());

    // Iteratively add arguments
    for arg in arguments.iter() {
        command.arg(arg);
    }

    let mut child = command.stdin(Stdio::piped())
                          .stdout(Stdio::piped())
                          .stderr(Stdio::piped())
                          .spawn()
                          .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes())
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    let output = child.wait_with_output().map_err(|e| format!("Error waiting for process: {}", e))?;

    file.write_all(&output.stdout).and_then(|_| file.write_all(&output.stderr))
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    let mut file = OpenOptions::new().read(true).open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let mut log_contents = String::new();
    file.read_to_string(&mut log_contents).map_err(|e| format!("Error reading log file: {}", e))?;

    let result = if output.status.success() {
        json!({
            "success": true,
            "logs": log_contents.trim()
        }).to_string()
    } else {
        json!({
            "success": false,
            "logs": log_contents.trim()
        }).to_string()
    };

    Ok(result)
}

#[tauri::command]
pub async fn reverse_ssh_rules(handle : tauri::AppHandle) -> Result<String, String> {
    // Similar setup as apply_ssh_rules
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
   
    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.shieldbuntu_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

        let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/reverse/r-ssh.sh")
        .expect("failed to resolve resource");

    // Open or create the log file for appending
    let log_file_path = Path::new(&log_directory).join("ssh_reverse_log.txt");

    // Run the bash script for reversing firewall changes
    let mut file = OpenOptions::new()
    .create(true)
    .append(true)
    .open(&log_file_path)
    .map_err(|e| format!("Error opening log file: {}", e))?;

    // Write the current date and time to the log file
    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Run the bash script for applying SSH rules
    let mut child = Command::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Capture the output
    let output = child.wait_with_output().map_err(|e| format!("Error waiting for process: {}", e))?;

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
        json!({
            "success": true,
            "logs": log_contents.trim().to_string()
        })
        .to_string()
    } else {
        json!({
            "success": false,
            "logs": log_contents.trim().to_string()
        })
        .to_string()
    };

    Ok(result)
}


#[tauri::command]
pub async fn check_ssh(handle : tauri::AppHandle) -> Result<String, String> {
        let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    
            let script_path = handle
            .path_resolver()
            .resolve_resource("scripts/check/check_ssh.sh")
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
    
        let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
        // Check if the command executed successfully
        let result = if stdout=="true" {
            json!({ "success": true }).to_string()
        } else {
            json!({ "success": false }).to_string()
        };
    
        Ok(result)
}
