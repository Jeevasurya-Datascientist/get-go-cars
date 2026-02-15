INSERT INTO cars
(brand, model, type, fuel_type, seats, price_per_day, images, status, rating, year, transmission, features)
VALUES

-- =======================
-- BMW
-- =======================

('BMW','M3','Sports','gasoline',4,12500,
'{"https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('BMW','X5','SUV','diesel',7,15000,
'{"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80"}',
'available',4.7,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('BMW','3 Series','Sedan','gasoline',5,9500,
'{"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"}',
'available',4.7,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('BMW','X7','SUV','diesel',7,18000,
'{"https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"}',
'available',4.9,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('BMW','M5','Sports','gasoline',4,16000,
'{"https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

-- =======================
-- Mercedes
-- =======================

('Mercedes','C-Class','Sedan','gasoline',5,10000,
'{"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('Mercedes','E-Class','Sedan','gasoline',5,12000,
'{"https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80"}',
'available',4.9,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('Mercedes','S-Class','Luxury','gasoline',5,16000,
'{"https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"}',
'available',4.9,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay","Massage Seats","Panoramic Roof"}'),

('Mercedes','GLE','SUV','diesel',7,14500,
'{"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('Mercedes','AMG GT','Sports','gasoline',2,18000,
'{"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"}',
'available',4.9,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay","Sport Mode"}'),

-- =======================
-- Audi
-- =======================

('Audi','A4','Sedan','gasoline',5,9000,
'{"https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=80"}',
'available',4.7,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('Audi','Q5','SUV','diesel',7,12500,
'{"https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"}',
'available',4.7,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('Audi','RS5','Sports','gasoline',4,15000,
'{"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay","Sport Mode"}'),

-- =======================
-- Toyota
-- =======================

('Toyota','Camry','Sedan','hybrid',5,7500,
'{"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80"}',
'available',4.6,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('Toyota','Corolla','Sedan','hybrid',5,6000,
'{"https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"}',
'available',4.5,2024,'automatic',
'{"GPS","Bluetooth","Backup Camera","Apple CarPlay"}'),

('Toyota','RAV4','SUV','hybrid',7,8500,
'{"https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80"}',
'available',4.7,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

-- =======================
-- Tesla
-- =======================

('Tesla','Model S','Electric','electric',5,13000,
'{"https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Autopilot"}'),

('Tesla','Model X','Electric','electric',7,15000,
'{"https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Autopilot","Falcon Doors"}'),

('Tesla','Model Y','Electric','electric',7,12500,
'{"https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"}',
'available',4.7,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Autopilot"}'),

-- =======================
-- Ford
-- =======================

('Ford','Mustang','Sports','gasoline',4,11000,
'{"https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay","Sport Mode"}'),

('Ford','F-150','Truck','gasoline',7,9500,
'{"https://images.unsplash.com/photo-1593950315186-76a92975b60c?auto=format&fit=crop&w=1200&q=80"}',
'available',4.7,2024,'automatic',
'{"GPS","Bluetooth","Backup Camera","Apple CarPlay","Towing Package"}'),

-- =======================
-- Porsche (FIXED)
-- =======================

('Porsche','Cayenne','SUV','gasoline',7,16000,
'{"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"}',
'available',4.8,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}'),

('Porsche','Panamera','Luxury','gasoline',5,18000,
'{"https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80"}',
'available',4.9,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay","Massage Seats"}'),

('Porsche','Macan','SUV','gasoline',7,14000,
'{"https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"}',
'available',4.7,2024,'automatic',
'{"GPS","Bluetooth","Heated Seats","Backup Camera","Apple CarPlay"}');