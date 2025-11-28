-- =====================================================
-- BASE DE DATOS: App Urbana Reporta
-- Sistema de Reportes Urbanos - ODS 11
-- =====================================================

-- Eliminar tablas si existen (para testing)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- TABLA: users
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    cedula VARCHAR(20) UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: categories
-- =====================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: reports
-- =====================================================
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    image_urls TEXT[], -- Array de URLs de imágenes
    admin_notes TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA: comments
-- =====================================================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES para mejorar performance
-- =====================================================
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_category_id ON reports(category_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_comments_report_id ON comments(report_id);
CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Insertar usuarios de prueba
-- Nota: Las contraseñas están hasheadas con bcrypt
-- usuario123 = $2b$10$rHqQJLvZ0lOqhX5yQnYvZ.xPYQnqXQxYqQnqXQxYqQnqXQxYqQnqXQ
-- admin123 = $2b$10$rHqQJLvZ0lOqhX5yQnYvZ.xPYQnqXQxYqQnqXQxYqQnqXQxYqQnqXQ

INSERT INTO users (name, email, password, phone, role) VALUES
('Usuario Demo', 'usuario@urbana.com', '$2b$10$YourHashedPasswordHere', '+57 300 123 4567', 'user'),
('Admin Demo', 'admin@urbana.com', '$2b$10$YourHashedPasswordHere', '+57 300 765 4321', 'admin'),
('Juan Pérez', 'juan@example.com', '$2b$10$YourHashedPasswordHere', '+57 301 234 5678', 'user'),
('María García', 'maria@example.com', '$2b$10$YourHashedPasswordHere', '+57 302 345 6789', 'user');

-- Insertar categorías
INSERT INTO categories (name, description, icon, color) VALUES
('Basuras', 'Problemas relacionados con recolección y manejo de residuos', 'trash-2', '#ef4444'),
('Iluminación', 'Fallas en alumbrado público y postes', 'lightbulb', '#f59e0b'),
('Vías', 'Huecos, grietas y daños en calles y aceras', 'construction', '#3b82f6'),
('Seguridad', 'Problemas de seguridad ciudadana', 'shield-alert', '#dc2626'),
('Parques', 'Mantenimiento de parques y zonas verdes', 'trees', '#10b981'),
('Agua', 'Fugas, inundaciones y problemas de acueducto', 'droplet', '#06b6d4'),
('Alcantarillado', 'Problemas de drenaje y alcantarillado', 'drain', '#8b5cf6'),
('Otro', 'Otros problemas urbanos', 'alert-circle', '#6b7280');

-- Insertar reportes de prueba
INSERT INTO reports (user_id, category_id, title, description, address, latitude, longitude, status, priority) VALUES
(3, 1, 'Acumulación de basura en esquina', 'Hay basura acumulada desde hace 3 días en la esquina', 'Calle 50 #10-20, Bogotá', 4.6486259, -74.0742257, 'pending', 'high'),
(3, 2, 'Poste de luz fundido', 'El poste de luz de la cuadra no enciende desde la semana pasada', 'Carrera 15 #80-30, Bogotá', 4.6696964, -74.0536481, 'in_progress', 'medium'),
(4, 3, 'Hueco grande en la calle', 'Hueco profundo que puede causar accidentes', 'Avenida Caracas #45-10, Bogotá', 4.6286259, -74.0642257, 'resolved', 'urgent'),
(4, 5, 'Parque descuidado', 'El parque necesita mantenimiento y poda de árboles', 'Carrera 7 #32-16, Bogotá', 4.6286259, -74.0742257, 'pending', 'low'),
(3, 6, 'Fuga de agua', 'Fuga de agua en la tubería principal', 'Calle 26 #68-80, Bogotá', 4.6486259, -74.0942257, 'in_progress', 'high');

-- Insertar comentarios de prueba
INSERT INTO comments (report_id, user_id, content, is_admin) VALUES
(1, 2, 'Hemos recibido tu reporte. Un equipo revisará la zona pronto.', true),
(2, 2, 'El equipo técnico ya fue despachado a la zona.', true),
(2, 3, '¿Hay alguna estimación de cuándo lo repararán?', false),
(3, 2, 'El problema ha sido resuelto. Gracias por reportar.', true),
(3, 4, 'Confirmado, ya repararon el hueco. ¡Gracias!', false);

-- =====================================================
-- FUNCIÓN: Actualizar timestamp automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista: Reportes con información completa
CREATE VIEW reports_complete AS
SELECT 
    r.id,
    r.title,
    r.description,
    r.address,
    r.latitude,
    r.longitude,
    r.status,
    r.priority,
    r.image_urls,
    r.created_at,
    r.updated_at,
    u.name as user_name,
    u.email as user_email,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    (SELECT COUNT(*) FROM comments WHERE report_id = r.id) as comments_count
FROM reports r
JOIN users u ON r.user_id = u.id
JOIN categories c ON r.category_id = c.id;

-- Vista: Estadísticas por categoría
CREATE VIEW stats_by_category AS
SELECT 
    c.name as category,
    COUNT(r.id) as total_reports,
    SUM(CASE WHEN r.status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN r.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
    SUM(CASE WHEN r.status = 'resolved' THEN 1 ELSE 0 END) as resolved,
    SUM(CASE WHEN r.status = 'rejected' THEN 1 ELSE 0 END) as rejected
FROM categories c
LEFT JOIN reports r ON c.id = r.category_id
GROUP BY c.id, c.name;

-- =====================================================
-- INFORMACIÓN FINAL
-- =====================================================

SELECT 'Base de datos creada exitosamente!' as message;
SELECT 'Total de usuarios: ' || COUNT(*) as info FROM users;
SELECT 'Total de categorías: ' || COUNT(*) as info FROM categories;
SELECT 'Total de reportes: ' || COUNT(*) as info FROM reports;
SELECT 'Total de comentarios: ' || COUNT(*) as info FROM comments;

-- =====================================================
-- CREDENCIALES DE ACCESO (para testing)
-- =====================================================
-- Usuario: usuario@urbana.com / usuario123
-- Admin: admin@urbana.com / admin123
-- =====================================================
