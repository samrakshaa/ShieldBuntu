use std::path::Path;
use std::{env, fs};
use std::process::{Stdio, Command};
use tokio::io::AsyncWriteExt;
use crate::get_password;
use chrono::Utc;
use std::fs::{OpenOptions, File};
use std::io::Write;
use tokio::process::Command as AsyncCommand;
use std::io::Read;
use serde_json::json;

#[tauri::command]
pub async fn apply_firewall_rules(handle: tauri::AppHandle, port: Option<String>, action: Option<String>) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/firewall.sh")
        .expect("failed to resolve resource");

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.samrakshak_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

    let log_file_path = Path::new(&log_directory).join("firewall.txt");

    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    let mut cmd = Command::new("sudo");
    cmd.arg("-S")
        .arg("bash")
        .arg(&script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    if let Some(p) = port {
        cmd.arg(&p);
    }
    
    if let Some(a) = action {
        cmd.arg(&a);
    }

    let mut child = cmd.spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes())
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    let output = child.wait_with_output()
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    file.write_all(&output.stdout)
        .and_then(|_| file.write_all(&output.stderr))
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    let mut file = OpenOptions::new()
        .read(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let mut log_contents = String::new();
    file.read_to_string(&mut log_contents)
        .map_err(|e| format!("Error reading log file: {}", e))?;

    let result = json!({ "logs": log_contents.trim() }).to_string();
    Ok(result)
}


#[tauri::command]
pub async fn list_ports(_handle: tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let script_relative_path = "scripts/apply/ufw_status.sh";

    let base_path = std::env::current_dir().unwrap(); // Get the current working directory
    let script_path = base_path.join(script_relative_path);

    let log_file_path = base_path.join("firewall_status.log");

    let mut child = Command::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(&script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes())
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    let output = child.wait_with_output()
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    // Write the output to the log file, overwriting any existing content
    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    file.write_all(&output.stdout)
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Read the content of the log file
    let mut file = File::open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let mut log_contents = String::new();
    file.read_to_string(&mut log_contents)
        .map_err(|e| format!("Error reading log file: {}", e))?;

    let result = json!({ "ufw_status": log_contents.trim() }).to_string();
    Ok(result)
}


#[tauri::command]
pub async fn reverse_firewall_rules(handle: tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/reverse/r-firewall.sh");
    // let log_file_path = current_dir.join("logs/reverse_firewall_log.txt");

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.samrakshak_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

        let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/reverse/r-firewall.sh")
        .expect("failed to resolve resource");

    // Open or create the log file for appending
    let log_file_path = Path::new(&log_directory).join("r-firewall_log.txt");

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

    // Run the bash script for reversing firewall rules
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
        json!({ "success": true, "logs": log_contents }).to_string()
    } else {
        json!({ "success": false, "logs": log_contents }).to_string()
    };

    Ok(result)
}




#[tauri::command]
pub async fn check_firewall(handle: tauri::AppHandle) -> Result<String, String> {
    // Retrieve password or credentials (replace with your logic)
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;

    // Resolve the path to the bash script using Tauri's path_resolver
    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/check/check_firewall.sh")
        .expect("failed to resolve resource");

    // Run the bash script for checking firewall status
    let mut child = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(&script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Write password to the stdin of the child process
    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Await the child process completion
    let output = child.wait_with_output().await
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    // Construct the JSON-like return value
    let result = if output.status.success() {
        json!({ "success": true }).to_string()
    } else {
        json!({ "success": false }).to_string()
    };

    Ok(result)
}