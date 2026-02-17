mod models;
mod services;
mod commands;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::create_initial_structure,
            commands::read_index,
            commands::read_notebook,
            commands::read_section,
            commands::add_notebook,
            commands::delete_notebook,
            commands::rename_notebook,
            commands::add_section,
            commands::delete_section,
            commands::rename_section,
            commands::add_page,
            commands::delete_page,
            commands::rename_page,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}