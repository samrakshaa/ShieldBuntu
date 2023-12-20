use std::env;
use std::fs::{self, OpenOptions};
use std::path::Path;
use std::process::{Command, Stdio};
use tauri::AppHandle;
use serde_json::json;
use chrono::Utc;
use std::io::{Read, Write};
use crate::get_password;

#[tauri::command]
pub async fn custom_script(handle: AppHandle, script_ids: Vec<String>) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/merge.sh")
        .expect("failed to resolve resource");

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.samrakshak_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

    let log_file_path = Path::new(&log_directory).join("merge_script_log.txt");

    // Paths for the output and reverse output files
    let output_file_path = Path::new(&log_directory).join("output.sh");
    let reverse_output_file_path = Path::new(&log_directory).join("reverse_output.sh");

    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    let mut command = Command::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path.to_str().unwrap())
        .args(&script_ids)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = command.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes())
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    let output = command.wait_with_output()
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    file.write_all(&output.stderr)
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    // Read the merged script file
    let mut merged_script_file = OpenOptions::new().read(true).open(&output_file_path)
        .map_err(|e| format!("Error opening merged script file: {}", e))?;
    let mut merged_script = String::new();
    merged_script_file.read_to_string(&mut merged_script)
        .map_err(|e| format!("Error reading merged script file: {}", e))?;

    // Read the reverse merged script file
    let mut reverse_merged_script_file = OpenOptions::new().read(true).open(&reverse_output_file_path)
        .map_err(|e| format!("Error opening reverse merged script file: {}", e))?;
    let mut reverse_merged_script = String::new();
    reverse_merged_script_file.read_to_string(&mut reverse_merged_script)
        .map_err(|e| format!("Error reading reverse merged script file: {}", e))?;

    let logs = String::from_utf8_lossy(&output.stderr).to_string();

    let result = json!({
        "success": output.status.success(),
        "script": merged_script,
        "reverse_script": reverse_merged_script,
        "logs": logs
    });
    Ok(result.to_string())
}
