DROP TABLE IF EXISTS product_catalog;
CREATE TABLE IF NOT EXISTS product_catalog (barcode TEXT PRIMARY KEY, name TEXT, manufacturer TEXT, category TEXT);
INSERT INTO product_catalog (barcode, name, manufacturer, category) VALUES ("3073781122596", "Cream Cheese", "La Vache qui rit", "Dairy");