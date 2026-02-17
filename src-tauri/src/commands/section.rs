use crate::services::SectionService;
use crate::models::{SectionData, Section};

#[tauri::command]
pub fn read_section(
    notes_folder: String,
    notebook_id: String,
    section_id: String
) -> Result<SectionData, String> {
    SectionService::read_section(&notes_folder, &notebook_id, &section_id)
}

#[tauri::command]
pub fn add_section(
    notes_folder: String,
    notebook_id: String
) -> Result<String, String> {
    let section = SectionService::add_section(&notes_folder, &notebook_id)?;
    serde_json::to_string(&section).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_section(
    notes_folder: String,
    notebook_id: String,
    section_id: String
) -> Result<(), String> {
    SectionService::delete_section(&notes_folder, &notebook_id, &section_id)
}

#[tauri::command]
pub fn rename_section(
    notes_folder: String,
    notebook_id: String,
    section_id: String,
    new_name: String
) -> Result<(), String> {
    SectionService::rename_section(&notes_folder, &notebook_id, &section_id, &new_name)
}