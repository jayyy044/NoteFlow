use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Page {
    pub id: String,
    pub title: String,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "lastModified")]
    pub last_modified: String,
}