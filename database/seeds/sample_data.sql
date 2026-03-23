-- Sample Data for Viet Heritage Hub Database
USE PBL5;

-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@vietheritage.com', '$2b$10$hashedpassword1', 'admin'),
('Nguyen Van A', 'nguyenvana@example.com', '$2b$10$hashedpassword2', 'member'),
('Tran Thi B', 'tranthib@example.com', '$2b$10$hashedpassword3', 'artisan'),
('Le Van C', 'levanc@example.com', '$2b$10$hashedpassword4', 'member'),
('Pham Thi D', 'phamthid@example.com', '$2b$10$hashedpassword5', 'artisan');

-- Insert historical periods
INSERT INTO historical_periods (dynasty, start_year, end_year, description, key_events, image_url, audio_url) VALUES
('Nguyen Dynasty', 1802, 1945, 'The last ruling dynasty of Vietnam, known for its cultural preservation and modernization efforts.', 'Unification of Vietnam, French colonization, cultural reforms', '/images/nguyen-dynasty.jpg', '/audio/nguyen-dynasty.mp3'),
('Tran Dynasty', 1225, 1400, 'Golden age of Vietnamese culture and military strength.', 'Victory over Mongol invasions, cultural flourishing', '/images/tran-dynasty.jpg', '/audio/tran-dynasty.mp3'),
('Le Dynasty', 1428, 1788, 'Period of cultural and educational development.', 'Confucian reforms, literary examinations', '/images/le-dynasty.jpg', '/audio/le-dynasty.mp3'),
('Ly Dynasty', 1009, 1225, 'Early feudal period with strong centralized government.', 'Capital moved to Thang Long, Buddhism promotion', '/images/ly-dynasty.jpg', '/audio/ly-dynasty.mp3');

-- Insert heritage sites
INSERT INTO heritage_sites (name, description, latitude, longitude, region, type, historical_period, image_url, audio_url) VALUES
('Ho Chi Minh Mausoleum', 'Final resting place of Ho Chi Minh, the founding father of modern Vietnam.', 21.0369, 105.8342, 'North', 'Historical Site', 'Modern', '/images/ho-chi-minh-mausoleum.jpg', '/audio/ho-chi-minh-mausoleum.mp3'),
('Hue Imperial City', 'Ancient imperial city and UNESCO World Heritage Site.', 16.4637, 107.5909, 'Central', 'Palace', 'Nguyen Dynasty', '/images/hue-imperial-city.jpg', '/audio/hue-imperial-city.mp3'),
('Ha Long Bay', 'Natural wonder with thousands of limestone islands and UNESCO World Heritage Site.', 20.9101, 107.1839, 'North', 'Natural Site', 'Ancient', '/images/ha-long-bay.jpg', '/audio/ha-long-bay.mp3'),
('My Son Sanctuary', 'Ancient Hindu temple complex and UNESCO World Heritage Site.', 15.7781, 108.1078, 'Central', 'Temple', 'Cham', '/images/my-son-sanctuary.jpg', '/audio/my-son-sanctuary.mp3'),
('Temple of Literature', 'First university in Vietnam, dedicated to Confucius.', 21.0285, 105.8359, 'North', 'Temple', 'Le Dynasty', '/images/temple-of-literature.jpg', '/audio/temple-of-literature.mp3');

-- Insert products
INSERT INTO products (name, description, price, category, artisan_id, image_url, stock_quantity) VALUES
('Handwoven Silk Scarf', 'Traditional Vietnamese silk scarf with intricate patterns.', 45.00, 'Textiles', 3, '/images/silk-scarf.jpg', 25),
('Lacquerware Box', 'Beautiful red lacquer box with mother-of-pearl inlays.', 120.00, 'Lacquerware', 5, '/images/lacquer-box.jpg', 10),
('Ceramic Vase', 'Blue and white ceramic vase in traditional Vietnamese style.', 85.00, 'Ceramics', 3, '/images/ceramic-vase.jpg', 15),
('Bamboo Basket', 'Handwoven bamboo basket for storage or decoration.', 25.00, 'Bamboo Crafts', 5, '/images/bamboo-basket.jpg', 30),
('Conical Hat', 'Traditional Vietnamese conical hat with silk ribbons.', 15.00, 'Headwear', 3, '/images/conical-hat.jpg', 50);

-- Insert groups
INSERT INTO groups (name, description, category, creator_id, image_url, is_private) VALUES
('Vietnamese Cultural Heritage', 'Discussion group for Vietnamese cultural preservation.', 'Culture', 1, '/images/culture-group.jpg', false),
('Traditional Arts & Crafts', 'Community for artisans and craft enthusiasts.', 'Arts', 3, '/images/arts-group.jpg', false),
('Historical Research', 'Academic discussions on Vietnamese history.', 'History', 2, '/images/history-group.jpg', false),
('Cultural Events', 'Planning and discussion of cultural events.', 'Events', 4, '/images/events-group.jpg', false);

-- Insert posts
INSERT INTO posts (user_id, group_id, title, content, image_url, is_verified) VALUES
(3, 2, 'Preserving Traditional Lacquerware Techniques', 'As a master artisan, I want to share the importance of preserving traditional lacquerware techniques...', '/images/lacquer-post.jpg', true),
(2, 1, 'The Beauty of Vietnamese Festivals', 'Vietnamese festivals are not just celebrations but also important cultural expressions...', '/images/festival-post.jpg', false),
(4, 3, 'New Discoveries in Cham History', 'Recent archaeological findings shed new light on Cham civilization...', '/images/cham-post.jpg', true),
(5, 4, 'Upcoming Cultural Festival', 'Join us for the annual Vietnamese Cultural Festival featuring traditional music and dance...', '/images/festival-announcement.jpg', true);

-- Insert events
INSERT INTO events (title, description, event_date, location, organizer_id, max_participants, image_url, is_online) VALUES
('Traditional Music Performance', 'Evening of traditional Vietnamese music featuring ancient instruments.', '2024-03-15', 'Hanoi Opera House', 3, 200, '/images/music-event.jpg', false),
('Lacquerware Workshop', 'Learn traditional lacquerware techniques from master artisans.', '2024-03-22', 'Artisan Center, Hoi An', 5, 20, '/images/workshop-event.jpg', false),
('Virtual Cultural Tour', 'Explore Vietnamese heritage sites through virtual reality.', '2024-04-01', 'Online', 1, 100, '/images/virtual-tour.jpg', true),
('Spring Festival Celebration', 'Traditional Tet Nguyen Dan celebration with cultural performances.', '2024-02-10', 'Ho Chi Minh City Cultural Center', 4, 500, '/images/spring-festival.jpg', false);

-- Insert sample orders
INSERT INTO orders (user_id, artisan_id, product_id, quantity, total_price, shipping_address, status) VALUES
(2, 3, 1, 2, 90.00, '123 Nguyen Trai, Hanoi, Vietnam', 'delivered'),
(4, 5, 2, 1, 120.00, '456 Le Loi, Ho Chi Minh City, Vietnam', 'shipped'),
(2, 3, 5, 3, 45.00, '789 Tran Hung Dao, Da Nang, Vietnam', 'processing');

-- Insert sample comments
INSERT INTO comments (user_id, post_id, content) VALUES
(2, 1, 'Beautiful work! The craftsmanship is amazing.'),
(4, 1, 'How long does it take to create one piece?'),
(3, 2, 'I completely agree. Festivals are the heart of our culture.'),
(5, 3, 'Fascinating findings! Do you have more details?'),
(2, 4, 'I will definitely attend this event!');

-- Insert AI usage history
INSERT INTO ai_usage_history (user_id, action_type, input_data, output_url) VALUES
(2, 'calligraphy', 'Happy New Year', '/ai_outputs/calligraphy_001.jpg'),
(4, 'image_restoration', 'old_family_photo.jpg', '/ai_outputs/restored_001.jpg'),
(2, 'text_to_speech', 'Welcome to Vietnam', '/ai_outputs/tts_001.mp3');
