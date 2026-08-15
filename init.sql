CREATE TABLE IF NOT EXISTS inventory (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stock INTEGER NOT NULL,
  price VARCHAR(20) NOT NULL
);

INSERT INTO inventory (id, name, stock, price) VALUES
('PROD-001', 'Premium Wireless Headphones', 142, '$199'),
('PROD-002', 'Mechanical Ergonomic Keyboard', 45, '$129'),
('PROD-003', 'UltraWide 4K Gaming Monitor', 12, '$499'),
('PROD-004', 'Smart Fitness Watch v2', 89, '$249')
ON CONFLICT (id) DO NOTHING;C:\Users\lenovo\inventory-order-management