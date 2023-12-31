use std::{process::{Command, Stdio}, io::{Write, Read}, env, fs::{OpenOptions, self}, path::Path};
use chrono::Utc;
use serde_json::json;
use crate::get_password;

#[tauri::command]
pub async fn kernel(handle: tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/kernel.sh")
        .expect("failed to resolve resource");

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.shieldbuntu_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

    let log_file_path = Path::new(&log_directory).join("kernel.txt");

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

    let result = if output.status.success() {
        json!({ "success": true, "logs": log_contents }).to_string()
    } else {
        json!({ "success": false, "logs": log_contents }).to_string()
    };

    Ok(result)
}


#[tauri::command]
pub async fn reverse_kernel(handle: tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/reverse/r-kernel.sh")
        .expect("failed to resolve resource");

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.shieldbuntu_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

    let log_file_path = Path::new(&log_directory).join("reverse_kernel.txt");

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

    let result = if output.status.success() {
        json!({ "success": true, "logs": log_contents }).to_string()
    } else {
        json!({ "success": false, "logs": log_contents }).to_string()
    };

    Ok(result)
}