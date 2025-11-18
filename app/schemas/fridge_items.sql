DROP TABLE IF EXISTS fridge_items;
CREATE TABLE IF NOT EXISTS fridge_items (barcode TEXT PRIMARY KEY, name TEXT, manufacturer TEXT, category TEXT, amount INT);
INSERT INTO fridge_items (barcode, name, manufacturer, category, amount) VALUES ("3073781122596", "Cream Cheese", "La Vache qui rit", "Dairy", 2);