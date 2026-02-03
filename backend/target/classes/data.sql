-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES ('Admin User', 'admin@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample parking slots
INSERT INTO parking_slots (slot_number, location, description, is_available, created_at, updated_at) VALUES
('A1', 'Ground Floor - Near Entrance', 'Premium spot near main entrance', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('A2', 'Ground Floor - Near Entrance', 'Standard parking spot', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B1', 'Basement Level 1', 'Covered parking with security', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B2', 'Basement Level 1', 'Covered parking with security', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('C1', 'Ground Floor - Back Area', 'Large vehicle parking', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('C2', 'Ground Floor - Back Area', 'Large vehicle parking', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('D1', 'Basement Level 2', 'Electric vehicle charging available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('D2', 'Basement Level 2', 'Electric vehicle charging available', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('E1', 'Ground Floor - Side Area', 'Handicap accessible parking', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('E2', 'Ground Floor - Side Area', 'Standard parking spot', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 