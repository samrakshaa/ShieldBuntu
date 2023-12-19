// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::io::Write;
use std::process::Stdio;

use tauri_plugin_log::{LogTarget, fern::colors::ColoredLevelConfig};
use std::env;
mod update_packages;
mod firewall;
mod unused_packages;
mod usb;
mod fail2ban;
mod apparmor;
mod rkhunter;
mod tor;
mod autoupdate;
mod ssh;
mod check_username;
mod basic_check;
mod ssh_conn;
mod check_sudo;
mod no_exec;

static mut PASSWORD: Option<String> = None;

#[tauri::command]
async fn set_password(password: String) -> Result<bool, String> {
    // Prepare the sudo command
    let mut child = Command::new("sudo")
        .arg("-k")
        .arg("-S")
        .arg("ls")
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("Failed to spawn sudo command: {}", e))?;

    // Write the password to the stdin of the sudo command
    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes())
            .map_err(|e| format!("Failed to write to stdin: {}", e))?;
    }

    // Check the command execution status
    let status = child.wait()
        .map_err(|e| format!("Failed to execute sudo command: {}", e))?;

    if status.success() {
        // If the password is correct, store it
        unsafe {
            PASSWORD.replace(password);
        }
        Ok(true)
    } else {
        Err(false.to_string())
    }
}


pub fn get_password() -> Option<String> {
    unsafe {
        PASSWORD.clone()
    }
}


const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::Webview]; //logs to the web 


#[tokio::main]
pub async fn main() {
    tauri::Builder::default()
    .plugin(
        tauri_plugin_log::Builder::default().targets(LOG_TARGETS)
    
       .with_colors(ColoredLevelConfig::default())
        .build()
    )
        .invoke_handler(tauri::generate_handler![
            set_password,
            unused_packages::remove_unused_packages,
            update_packages::update_and_upgrade_packages,
            firewall::apply_firewall_rules,
            firewall::reverse_firewall_rules,
            firewall::check_firewall,
            firewall::list_ports,
            fail2ban::install_and_configure_fail2ban,
            apparmor::install_and_configure_apparmor,
            rkhunter::install_and_configure_rkhunter,
            autoupdate::run_autoupdate_script,
            check_username::check_username,
            tor::block_tor_access,
            tor::reverse_tor_block,
            tor::check_tor_blocked,
            ssh::apply_ssh_rules,
            ssh::reverse_ssh_rules,
            ssh::check_ssh,
            usb::list_usb_devices,
            usb::list_usb_devices_usbguard,
            usb::apply_usb_blocking,
            usb::whitelist_usb,
            usb::blacklist_usb,
            usb::reverse_usb_blocking,
            basic_check::check_fail2ban,
            basic_check::check_rkhunter,
            basic_check::check_unused_package,
            ssh_conn::first_time_ssh,
            ssh_conn::second_time_ssh,
            usb::check_usb,
            check_sudo::check_sudo_user,
            no_exec::no_exec,
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
