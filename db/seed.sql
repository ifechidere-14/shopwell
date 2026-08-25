-- ============================================
-- LordTempsMart seed data (run AFTER schema.sql)
--   cockroach sql --url "<CONNECTION_STRING>" -f db/seed.sql
-- ============================================

INSERT INTO categories (id, name, slug, icon, description) VALUES
  (1, 'Skin Care', 'skin-care', '🧴', 'Premium skin care essentials'),
  (2, 'Provisions', 'provisions', '🍚', 'Trusted pantry staples')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (category_id, name, description, price, rating, image, stock, featured) VALUES
  (1, 'Glow Vitamin C Serum', 'Brightening serum with 20% vitamin C that fades dark spots and evens skin tone for a natural glow.', 8500, 4.8, '🧴', 40, TRUE),
  (1, 'Shea Butter Body Lotion', 'Deeply moisturizing lotion made with raw shea butter and vitamin E for 24-hour hydration.', 4200, 4.6, '🫙', 60, FALSE),
  (1, 'Gentle Foaming Face Wash', 'Sulfate-free cleanser with glycerin and chamomile that removes dirt without stripping the skin.', 3500, 4.7, '🧼', 55, TRUE),
  (1, 'SPF 50 Sunscreen Fluid', 'Lightweight broad-spectrum sunscreen that absorbs quickly with no white cast. Daily essential.', 6500, 4.9, '☀️', 45, TRUE),
  (1, 'Rosewater Facial Toner', 'Alcohol-free toner with damask rose water to soothe, refresh, and tighten pores.', 2800, 4.5, '🌹', 70, FALSE),
  (1, 'Retinol Night Cream', 'Encapsulated retinol cream that smooths fine lines and renews skin overnight.', 9800, 4.7, '🌙', 30, FALSE),
  (2, 'Premium Basmati Rice 5kg', 'Long-grain aged basmati rice — fluffy, aromatic, and perfect for jollof and fried rice.', 12500, 4.8, '🍚', 35, TRUE),
  (2, 'Golden Penny Spaghetti Pack', 'Pack of 5 x 500g spaghetti. Cooks firm and pairs perfectly with every Nigerian sauce.', 3800, 4.6, '🍝', 80, FALSE),
  (2, 'Pure Groundnut Oil 3L', '100% refined groundnut oil for frying and cooking. Cholesterol free.', 9500, 4.5, '🛢️', 25, FALSE),
  (2, 'Tomato Paste Tins (Pack of 6)', 'Double-concentrated tomato paste, rich and tangy — the base of every great stew.', 3200, 4.4, '🍅', 90, FALSE),
  (2, 'Milo Chocolate Drink 1.8kg', 'Malted chocolate drink fortified with vitamins and minerals for the whole family.', 8900, 4.7, '🍫', 40, TRUE),
  (2, 'Bags of Pure Water (Set)', 'Treated sachet water, NAFDAC approved — delivered chilled in sets of 10 bags.', 1500, 4.3, '💧', 200, FALSE)
ON CONFLICT DO NOTHING;