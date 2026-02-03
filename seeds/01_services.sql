DO $$
DECLARE
  -- Categories
  cat_accounting uuid;
  cat_finance uuid;
  cat_print uuid;
  cat_realestate uuid;
  cat_fitness uuid;
  cat_health uuid;
  cat_automotive uuid;
  cat_construction uuid;
  cat_cleaning uuid;
  cat_software uuid;
  cat_it uuid;
BEGIN
  -- Lookup Categories
  SELECT id INTO cat_accounting FROM categories WHERE slug = 'accounting';
  SELECT id INTO cat_finance FROM categories WHERE slug = 'finance';
  SELECT id INTO cat_print FROM categories WHERE slug = 'print';
  SELECT id INTO cat_realestate FROM categories WHERE slug = 'real-estate';
  SELECT id INTO cat_fitness FROM categories WHERE slug = 'fitness';
  SELECT id INTO cat_health FROM categories WHERE slug = 'health-wellness';
  SELECT id INTO cat_automotive FROM categories WHERE slug = 'automotive';
  SELECT id INTO cat_construction FROM categories WHERE slug = 'construction';
  SELECT id INTO cat_cleaning FROM categories WHERE slug = 'cleaning';
  SELECT id INTO cat_software FROM categories WHERE slug = 'software';
  SELECT id INTO cat_it FROM categories WHERE slug = 'it';

  -- Insert Businesses
  INSERT INTO businesses (name, slug, category_id, address, phone, website, description, city, state)
  VALUES 
  ('Abacus Answers', 'abacus-answers', cat_accounting, '324 S Main St, Suite 1, Viroqua, WI 54665', '608-638-4246', 'https://www.abacusanswers.com', 'Specializes in accounting, payroll, and tax preparation for small businesses.', 'Viroqua', 'WI'),
  ('Cade Financial Services', 'cade-financial-services', cat_finance, '117 W Court St, Viroqua, WI 54665', '608-638-3030', 'http://www.cadefinancialservices.com', 'Comprehensive wealth management and retirement planning services.', 'Viroqua', 'WI'),
  ('Proline Printing & Signs', 'proline-printing-signs', cat_print, '223 S Main St, Viroqua, WI 54665', '608-637-3868', 'https://prolineprinting.net', 'Full-service commercial printing, signage, and custom apparel.', 'Viroqua', 'WI'),
  ('Century 21 Affiliated', 'century-21-affiliated', cat_realestate, '742 S Main St, Viroqua, WI 54665', '608-637-8882', 'https://www.c21affiliated.com', 'Residential and commercial real estate brokerage serving the Driftless region.', 'Viroqua', 'WI'),
  
  ('Anytime Fitness', 'anytime-fitness', cat_fitness, '1218 N Main St, Viroqua, WI 54665', '608-638-3481', 'https://www.anytimefitness.com', '24-hour gym and fitness center with personal training services.', 'Viroqua', 'WI'),
  ('Quality of Life Chiropractic', 'quality-of-life-chiropractic', cat_health, '801 E Decker St, Viroqua, WI 54665', '608-637-6767', 'https://qualityoflifechiro.com', 'Chiropractic care focused on family wellness and spinal health.', 'Viroqua', 'WI'),
  ('Coulee Roots Movement', 'coulee-roots-movement', cat_health, '117 S Main St, Viroqua, WI 54665', '608-371-9164', 'https://www.couleeroots.com', 'Martial arts, infrared sauna, and holistic movement play space.', 'Viroqua', 'WI'),
  
  ('Sleepy Hollow Auto Glass', 'sleepy-hollow-auto-glass', cat_automotive, '1225 N Main St, Viroqua, WI 54665', '608-637-8300', 'https://www.sleepyhollowauto.com', 'Specialized auto glass replacement and collision repair services.', 'Viroqua', 'WI'),
  ('C&C Landscaping', 'cc-landscaping', cat_construction, 'E7541 County Rd SS, Viroqua, WI 54665', '608-637-6555', 'https://cclandscapinginc.com', 'Commercial and residential landscaping, excavating, and lawn care.', 'Viroqua', 'WI'),
  ('County Seat Laundry', 'county-seat-laundry', cat_cleaning, '1218 N Main St, Suite C, Viroqua, WI 54665', '608-638-8060', 'https://www.countyseatlaundry.com', 'Modern self-service laundromat with wash-and-fold services.', 'Viroqua', 'WI'),
  
  ('CopperLily Digital', 'copperlily-digital', cat_software, 'S5031 Hansen Ln, Viroqua, WI 54665', '608-317-0553', 'https://copper-lily.com', 'Managed IT services, cybersecurity, and digital strategy for businesses.', 'Viroqua', 'WI'),
  ('Lorr Computer Solutions', 'lorr-computer-solutions', cat_it, '834 N Main St, Suite B, Viroqua, WI 54665', '608-406-2141', 'https://www.lorrcs.com', 'Computer repair, remote support, and networking solutions.', 'Viroqua', 'WI'),
  ('Leum Tech', 'leum-tech', cat_it, '121 E Terhune St, Suite 7, Viroqua, WI 54665', '608-638-2030', 'https://www.leumtech.com', 'Business technology infrastructure and managed IT consulting.', 'Viroqua', 'WI')
  ON CONFLICT (slug) DO UPDATE SET 
    description = EXCLUDED.description,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    website = EXCLUDED.website;
END $$;
