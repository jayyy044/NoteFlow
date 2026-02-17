use crate::services::SectionService;
use crate::models::SectionData;

#[tauri::command]
pub fn read_section(
    notes_folder: String,
    notebook_id: String,
    section_id: String
) -> Result<SectionData, String> {
    SectionService::read_section(&notes_folder, &notebook_id, &section_id)
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