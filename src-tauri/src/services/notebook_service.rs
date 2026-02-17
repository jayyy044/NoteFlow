use std::fs;
use std::path::Path;
use serde_json::json;
use crate::models::{NotebookIndexItem, NotebookData};
use crate::utils::{random_color, generate_id, current_timestamp};
// use crate::services::section_service::SectionService;

pub struct NotebookService;

impl NotebookService {
    pub fn create_initial_structure(notes_folder: &str) -> Result<(), String> {
        let root = Path::new(notes_folder);
        
        let notebook_id = generate_id();
        let section_id = generate_id();
        let page_id = generate_id();

        let notebook_path = root.join(&notebook_id);
        let section_path = notebook_path.join(&section_id);
        let page_path = section_path.join(&page_id);

        fs::create_dir_all(&page_path).map_err(|e| e.to_string())?;

        let now = current_timestamp();
        let notebook_color = random_color();
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

        // Create notebook.json
        let notebook_json = json!({
            "id": notebook_id,
            "name": "Untitled Notebook",
            "color": notebook_color,
            "isExpanded": false,
            "sections": [{
                "id": section_id,
                "name": "Untitled Section",
                "color": section_color,
                "isExpanded": false
            }]
        });
        fs::write(
            notebook_path.join("notebook.json"),
            serde_json::to_string_pretty(&notebook_json).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;

        // Create index.json
        let index_json = json!([{
            "id": notebook_id,
            "name": "Untitled Notebook",
            "color": notebook_color,
            "isExpanded": false
        }]);
        fs::write(
            root.join("index.json"),
            serde_json::to_string_pretty(&index_json).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;

        Ok(())
    }

    pub fn read_index(notes_folder: &str) -> Result<Vec<NotebookIndexItem>, String> {
        let index_path = Path::new(notes_folder).join("index.json");
        
        if !index_path.exists() {
            return Ok(Vec::new());
        }
        
        let content = fs::read_to_string(&index_path).map_err(|e| e.to_string())?;
        let notebooks: Vec<NotebookIndexItem> = serde_json::from_str(&content)
            .map_err(|e| e.to_string())?;
        
        Ok(notebooks)
    }

    pub fn read_notebook(notes_folder: &str, notebook_id: &str) -> Result<NotebookData, String> {
        let notebook_path = Path::new(notes_folder)
            .join(notebook_id)
            .join("notebook.json");
        
        if !notebook_path.exists() {
            return Err(format!("Notebook not found: {}", notebook_id));
        }
        
        let content = fs::read_to_string(&notebook_path).map_err(|e| e.to_string())?;
        let notebook: NotebookData = serde_json::from_str(&content)
            .map_err(|e| e.to_string())?;
        
        Ok(notebook)
    }

    pub fn add_notebook(notes_folder: &str) -> Result<NotebookIndexItem, String> {
        let root = Path::new(notes_folder);
        
        let notebook_id = generate_id();
        let section_id = generate_id();
        let page_id = generate_id();

        let notebook_path = root.join(&notebook_id);
        let section_path = notebook_path.join(&section_id);
        let page_path = section_path.join(&page_id);

        fs::create_dir_all(&page_path).map_err(|e| e.to_string())?;

        let now = current_timestamp();
        let notebook_color = random_color();
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

        // Create notebook.json
        let notebook_json = json!({
            "id": notebook_id,
            "name": "Untitled Notebook",
            "color": notebook_color,
            "isExpanded": false,
            "sections": [{
                "id": section_id,
                "name": "Untitled Section",
                "color": section_color,
                "isExpanded": false
            }]
        });
        fs::write(
            notebook_path.join("notebook.json"),
            serde_json::to_string_pretty(&notebook_json).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;

        // Update index.json
        let index_path = root.join("index.json");
        let mut notebooks: Vec<serde_json::Value> = if index_path.exists() {
            let content = fs::read_to_string(&index_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        } else {
            Vec::new()
        };

        let new_notebook = NotebookIndexItem {
            id: notebook_id.clone(),
            name: "Untitled Notebook".to_string(),
            color: notebook_color.clone(),
            is_expanded: false,
        };

        notebooks.push(json!({
            "id": notebook_id,
            "name": "Untitled Notebook",
            "color": notebook_color,
            "isExpanded": false
        }));

        fs::write(
            &index_path,
            serde_json::to_string_pretty(&notebooks).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;

        Ok(new_notebook)
    }

    pub fn rename_notebook(
        notes_folder: &str,
        notebook_id: &str,
        new_name: &str
    ) -> Result<(), String> {
        let root = Path::new(notes_folder);
        
        // Update index.json
        let index_path = root.join("index.json");
        let mut notebooks: Vec<NotebookIndexItem> = {
            let content = fs::read_to_string(&index_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        if let Some(notebook) = notebooks.iter_mut().find(|nb| nb.id == notebook_id) {
            notebook.name = new_name.to_string();
        }
        
        fs::write(
            &index_path,
            serde_json::to_string_pretty(&notebooks).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        // Update notebook.json
        let notebook_path = root.join(notebook_id).join("notebook.json");
        let mut notebook_data: serde_json::Value = {
            let content = fs::read_to_string(&notebook_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        notebook_data["name"] = json!(new_name);
        
        fs::write(
            notebook_path,
            serde_json::to_string_pretty(&notebook_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        Ok(())
    }
}