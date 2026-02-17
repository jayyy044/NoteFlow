use rand::Rng;

pub fn random_color() -> String {
    let mut rng = rand::thread_rng();
    let r: u8 = rng.gen_range(100..=255);
    let g: u8 = rng.gen_range(100..=255);
    let b: u8 = rng.gen_range(100..=255);
    
    format!("#{:02x}{:02x}{:02x}", r, g, b)
}

pub fn generate_id() -> String {
    uuid::Uuid::new_v4().to_string()
}

pub fn current_timestamp() -> String {
    chrono::Utc::now().to_rfc3339()
}