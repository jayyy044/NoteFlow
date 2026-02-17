use std::fs;
use std::path::Path;
use serde_json::json;
use crate::models::{SectionData, Section};
use crate::utils::{random_color, generate_id, current_timestamp};

pub struct SectionService;

impl SectionService {
    pub fn read_section(
        notes_folder: &str,
        notebook_id: &str,
        section_id: &str
    ) -> Result<SectionData, String> {
        let section_path = Path::new(notes_folder)
            .join(notebook_id)
            .join(section_id)
            .join("section.json");
        
        if !section_path.exists() {
            return Err(format!("Section not found: {}", section_id));
        }
        
        let content = fs::read_to_string(&section_path).map_err(|e| e.to_string())?;
        let section: SectionData = serde_json::from_str(&content)
            .map_err(|e| e.to_string())?;
        
        Ok(section)
    }

    pub fn add_section(
        notes_folder: &str,
        notebook_id: &str
    ) -> Result<Section, String> {
        let root = Path::new(notes_folder);
        
        let section_id = generate_id();
        let page_id = generate_id();
        
        let section_path = root.join(notebook_id).join(&section_id);
        let page_path = section_path.join(&page_id);
        
        fs::create_dir_all(&page_path).map_err(|e| e.to_string())?;
        
        let now = current_timestamp();
        let section_color = random_color();
        
        // Create page.json
        let page_json = json!({
            "id": page_id,
            "title": "Untitled Page",
            "createdAt": now,
            "lastModified": now
        });
        fs::write(
            page_path.join("page.json"),
            serde_json::to_string_pretty(&page_json).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        // Create section.json
        let section_json = json!({
            "id": section_id,
            "name": "Untitled Section",
            "color": section_color,
            "isExpanded": false,
            "pages": [{
                "id": page_id,
                "title": "Untitled Page",
                "createdAt": now,
                "lastModified": now
            }]
        });
        fs::write(
            section_path.join("section.json"),
            serde_json::to_string_pretty(&section_json).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        // Update notebook.json
        let notebook_json_path = root.join(notebook_id).join("notebook.json");
        let mut notebook_data: serde_json::Value = {
            let content = fs::read_to_string(&notebook_json_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        if let Some(sections) = notebook_data["sections"].as_array_mut() {
            sections.push(json!({
                "id": section_id,
                "name": "Untitled Section",
                "color": section_color,
                "isExpanded": false
            }));
        }
        
        fs::write(
            notebook_json_path,
            serde_json::to_string_pretty(&notebook_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        Ok(Section {
            id: section_id.clone(),
            name: "Untitled Section".to_string(),
            color: section_color,
            is_expanded: false,
        })
    }

    pub fn delete_section(
        notes_folder: &str,
        notebook_id: &str,
        section_id: &str
    ) -> Result<(), String> {
        let root = Path::new(notes_folder);
        
        // Update notebook.json
        let notebook_json_path = root.join(notebook_id).join("notebook.json");
        let mut notebook_data: serde_json::Value = {
            let content = fs::read_to_string(&notebook_json_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        if let Some(sections) = notebook_data["sections"].as_array_mut() {
            sections.retain(|section| section["id"] != section_id);
        }
        
        fs::write(
            notebook_json_path,
            serde_json::to_string_pretty(&notebook_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        // Delete the section directory
        let section_path = root.join(notebook_id).join(section_id);
        if section_path.exists() {
            fs::remove_dir_all(&section_path).map_err(|e| e.to_string())?;
        }
        
        Ok(())
    }

    pub fn rename_section(
        notes_folder: &str,
        notebook_id: &str,
        section_id: &str,
        new_name: &str
    ) -> Result<(), String> {
        let root = Path::new(notes_folder);
        
        // Update notebook.json
        let notebook_json_path = root.join(notebook_id).join("notebook.json");
        let mut notebook_data: serde_json::Value = {
            let content = fs::read_to_string(&notebook_json_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        if let Some(sections) = notebook_data["sections"].as_array_mut() {
            for section in sections {
                if section["id"] == section_id {
                    section["name"] = json!(new_name);
                    break;
                }
            }
        }
        
        fs::write(
            notebook_json_path,
            serde_json::to_string_pretty(&notebook_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        // Update section.json
        let section_json_path = root.join(notebook_id).join(section_id).join("section.json");
        let mut section_data: serde_json::Value = {
            let content = fs::read_to_string(&section_json_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        section_data["name"] = json!(new_name);
        
        fs::write(
            section_json_path,
            serde_json::to_string_pretty(&section_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        Ok(())
    }
}