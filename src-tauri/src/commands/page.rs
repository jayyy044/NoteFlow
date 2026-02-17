use crate::services::PageService;
use crate::models::Page;

#[tauri::command]
pub fn add_page(
    notes_folder: String,
    notebook_id: String,
    section_id: String
) -> Result<String, String> {
    let page = PageService::add_page(&notes_folder, &notebook_id, &section_id)?;
    serde_json::to_string(&page).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_page(
    notes_folder: String,
    notebook_id: String,
    section_id: String,
    page_id: String
) -> Result<(), String> {
    PageService::delete_page(&notes_folder, &notebook_id, &section_id, &page_id)
}

#[tauri::command]
pub fn rename_page(
    notes_folder: String,
    notebook_id: String,
    section_id: String,
    page_id: String,
    new_title: String
) -> Result<(), String> {
    PageService::rename_page(&notes_folder, &notebook_id, &section_id, &page_id, &new_title)
}