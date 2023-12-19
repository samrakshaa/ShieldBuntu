use chrono::Utc;
// use serde::{Serialize, Deserialize};
use serde_json::json;
use tokio::io::AsyncWriteExt;
use tokio::process::Command as AsyncCommand;
use std::fs::OpenOptions;
use std::io::{Write, Read};
use std::process::Stdio;
use crate::{get_ssh_credentials, get_password};


#[tauri::command]
pub async fn establish_ssh_connection() -> Result<String, String> {
    let ssh_credentials = get_ssh_credentials();
    if ssh_credentials.len() != 3 {
        return Err("SSH credentials are incomplete".to_string());
    }

    let username = &ssh_credentials[0];
    let ip = &ssh_credentials[1];
    let password = &ssh_credentials[2];
    let local_password = get_password().ok_or_else(|| "Password not available".to_string())?;

    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/apply/ssh_conn_first.sh");
    let log_file_path = current_dir.join("logs/ssh_establish_log.txt");

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

    // Run the bash script for establishing SSH connection
    let mut child = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(&script_path)
        .arg(username)
        .arg(ip)
        .arg(password)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Pass the local password to sudo
    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", local_password).as_bytes())
            .await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Capture the output
    let output = child.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

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
// pub async fn establish_ssh_connection() -> Result<String, String> {
//     let ssh_credentials = get_ssh_credentials();
//     if ssh_credentials.len() != 3 {
//         return Err("SSH credentials are incomplete".to_string());
//     }

//     let username = &ssh_credentials[0];
//     let ip = &ssh_credentials[1];
//     let password = &ssh_credentials[2];
//     let local_password = get_password().ok_or_else(|| "Password not available".to_string())?;

//     let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
//     let script_path = current_dir.join("scripts/apply/ssh_conn_first.sh");
//     let log_file_path = current_dir.join("logs/ssh_establish_log.txt");

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

//     // Run the bash script for establishing SSH connection
//     let mut child = AsyncCommand::new("sudo")
//         .arg("-S")
//         .arg("bash")
//         .arg(&script_path)
//         .arg(username)
//         .arg(ip)
//         .arg(password)
//         .stdin(Stdio::piped())
//         .stdout(Stdio::piped())
//         .stderr(Stdio::piped())
//         .spawn()
//         .map_err(|e| format!("Error spawning process: {}", e))?;

//     // Pass the local password to sudo
//     if let Some(mut stdin) = child.stdin.take() {
//         stdin.write_all(format!("{}\n", local_password).as_bytes())
//             .await
//             .map_err(|e| format!("Error writing to stdin: {}", e))?;
//     }

//     // Capture the output
//     let output = child.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

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
//         json!({
//             "success": true,
//             "logs": log_contents.trim().to_string()
//         })
//         .to_string()
//     } else {
//         json!({
//             "success": false,
//             "logs": log_contents.trim().to_string()
//         })
//         .to_string()
//     };

//     Ok(result)
// }

#[tauri::command]
pub async fn execute_scripts_ssh() -> Result<String, String> {
    let ssh_credentials = get_ssh_credentials();
    if ssh_credentials.len() != 3 {
        return Err("SSH credentials are incomplete".to_string());
    }

    let username = &ssh_credentials[0];
    let ip = &ssh_credentials[1];
    let password = &ssh_credentials[2];
    let local_password = get_password().ok_or_else(|| "Password not available".to_string())?;

    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/apply/sshrun.sh");
    let log_file_path = current_dir.join("logs/ssh_script_log.txt");
    let script_file: String = "ununsed_packages.rs".to_string();

    let script_path2 = current_dir.join("scripts/apply/");

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

    // Run the bash script for establishing SSH connection
    let mut child = AsyncCommand::new("bash")
        .arg(&script_path)
        .arg(username)
        .arg(ip)
        .arg(password)
        .arg(script_path2)
        .arg(script_file)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Pass the local password to sudo
    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", local_password).as_bytes())
            .await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Capture the output
    let output = child.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

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


// #[tauri::command]
// pub async fn execute_scripts_ssh() -> Result<String, String> {
//     let ssh_credentials = get_ssh_credentials();
//     if ssh_credentials.len() != 3 {
//         return Err("SSH credentials are incomplete".to_string());
//     }

//     let username = &ssh_credentials[0];
//     let ip = &ssh_credentials[1];
//     let password = &ssh_credentials[2];

//     let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
//     let script_path = current_dir.join("scripts/");
//     let script_file = "apply/update_packages.sh";
//     let log_file_path = current_dir.join("logs/execute_scripts_ssh.txt");

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

//     // Run the bash script for testing SSH connection
//     let child = AsyncCommand::new("bash")
//         .arg(&script_path)
//         .arg(username)
//         .arg(ip)
//         .arg(password)
//         .stdout(Stdio::piped())
//         .stderr(Stdio::piped())
//         .spawn()
//         .map_err(|e| format!("Error spawning process: {}", e))?;

//     // Capture the output
//     let output = child.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

//     // Write the output to the log file
//     file.write_all(&output.stdout)
//         .and_then(|_| file.write_all(&output.stderr))
//         .map_err(|e| format!("Error writing to log file: {}", e))?;

//     let mut file = OpenOptions::new()
//         .read(true)
//         .open(&log_file_path)
//         .map_err(|e| format!("Error opening log file: {}", e))?;

//     let mut log_contents = String::new();
//     file.read_to_string(&mut log_contents)
//         .map_err(|e| format!("Error reading log file: {}", e))?;

//     let success = output.status.success();
//     let result = json!({
//         "success": success,
//         "logs": log_contents.trim().to_string()
//     }).to_string();

//     Ok(result)
// }





// #[warn(non_snake_case)]
// #[tauri::command]
// pub async fn first_time_ssh(sshDetails: Vec<String>) -> Result<String, String> {
//     let password = get_password().ok_or_else(|| "Password not available".to_string())?;
//     let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
//     let script_path = current_dir.join("scripts/apply/ssh_conn_first.sh");
//     let log_file_path = current_dir.join("logs/ssh_conn_first.txt");

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

//     // Prepare the command with USB IDs as arguments
//     let mut command = AsyncCommand::new("sudo")
//         .arg("-S")
//         .arg("bash")
//         .arg(script_path)
//         .args(sshDetails) // Pass the USB IDs to the script
//         .stdin(Stdio::piped())
//         .stdout(Stdio::piped())
//         .stderr(Stdio::piped())
//         .spawn()
//         .map_err(|e| format!("Error spawning process: {}", e))?;

//     // Write the password to stdin
//     if let Some(mut stdin) = command.stdin.take() {
//         stdin.write_all(format!("{}\n", password).as_bytes()).await
//             .map_err(|e| format!("Error writing to stdin: {}", e))?;
//     }

//     // Capture the output
//     let output = command.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

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


// #[warn(non_snake_case)]
// #[tauri::command]
// pub async fn second_time_ssh(sshDetails: Vec<String>) -> Result<String, String> {
//     let password = get_password().ok_or_else(|| "Password not available".to_string())?;
//     let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
//     let script_path = current_dir.join("scripts/apply/ssh_conn_second.sh");
//     let log_file_path = current_dir.join("logs/ssh_conn_second.txt");

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

//     // Prepare the command with USB IDs as arguments
//     let mut command = AsyncCommand::new("sudo")
//         .arg("-S")
//         .arg("bash")
//         .arg(script_path)
//         .args(sshDetails) // Pass the USB IDs to the script
//         .stdin(Stdio::piped())
//         .stdout(Stdio::piped())
//         .stderr(Stdio::piped())
//         .spawn()
//         .map_err(|e| format!("Error spawning process: {}", e))?;

//     // Write the password to stdin
//     if let Some(mut stdin) = command.stdin.take() {
//         stdin.write_all(format!("{}\n", password).as_bytes()).await
//             .map_err(|e| format!("Error writing to stdin: {}", e))?;
//     }

//     // Capture the output
//     let output = command.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

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


