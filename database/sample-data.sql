-- Sample data for testing the Article Pipeline Backend

-- Sample Country Info
INSERT INTO country_info (key, info) VALUES 
('uk', '{
  "country": "United Kingdom",
  "currency": "GBP",
  "regulators": ["FCA", "HMRC"],
  "banks": ["Barclays", "HSBC", "Lloyds", "NatWest", "Santander"],
  "paymentRails": ["Faster Payments", "BACS", "CHAPS"],
  "localBankExamples": ["Revolut", "Monzo", "Starling Bank"],
  "localTerms": ["sort code", "account number", "direct debit"]
}'),
('us', '{
  "country": "United States",
  "currency": "USD", 
  "regulators": ["FDIC", "OCC", "Fed"],
  "banks": ["JPMorgan Chase", "Bank of America", "Wells Fargo", "Citibank"],
  "paymentRails": ["ACH", "Wire Transfer", "Fedwire"],
  "localBankExamples": ["Chime", "Ally Bank", "Capital One"],
  "localTerms": ["routing number", "account number", "checking account"]
}')
ON CONFLICT (key) DO UPDATE SET info = EXCLUDED.info;

-- Sample Skeletons
INSERT INTO skeletons (key, title, description, skeleton) VALUES 
('blog', 'Blog Article', 'Standard blog post structure with introduction, main content, and conclusion', '[
  {"block_id": "intro", "title": "Introduction", "mappedKeywords": []},
  {"block_id": "main-content", "title": "Main Content", "mappedKeywords": []},
  {"block_id": "benefits", "title": "Key Benefits", "mappedKeywords": []},
  {"block_id": "how-to", "title": "How to Get Started", "mappedKeywords": []},
  {"block_id": "conclusion", "title": "Conclusion", "mappedKeywords": []}
]'),

('exchange-review', 'Exchange Review', 'Comprehensive review structure for cryptocurrency exchanges', '[
  {"block_id": "intro", "title": "Introduction", "mappedKeywords": []},
  {"block_id": "overview", "title": "Exchange Overview", "mappedKeywords": []},
  {"block_id": "features", "title": "Key Features", "mappedKeywords": []},
  {"block_id": "fees", "title": "Fees and Pricing", "mappedKeywords": []},
  {"block_id": "security", "title": "Security Measures", "mappedKeywords": []},
  {"block_id": "pros-cons", "title": "Pros and Cons", "mappedKeywords": []},
  {"block_id": "getting-started", "title": "How to Get Started", "mappedKeywords": []},
  {"block_id": "conclusion", "title": "Final Verdict", "mappedKeywords": []}
]'),

('banking-guide', 'Banking Guide', 'Complete guide structure for banking and financial services', '[
  {"block_id": "intro", "title": "Introduction", "mappedKeywords": []},
  {"block_id": "what-you-need", "title": "What You Need to Know", "mappedKeywords": []},
  {"block_id": "step-by-step", "title": "Step-by-Step Process", "mappedKeywords": []},
  {"block_id": "requirements", "title": "Requirements", "mappedKeywords": []},
  {"block_id": "tips", "title": "Pro Tips", "mappedKeywords": []},
  {"block_id": "common-mistakes", "title": "Common Mistakes to Avoid", "mappedKeywords": []},
  {"block_id": "faq", "title": "Frequently Asked Questions", "mappedKeywords": []},
  {"block_id": "conclusion", "title": "Conclusion", "mappedKeywords": []}
]')

ON CONFLICT (key) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  skeleton = EXCLUDED.skeleton;
