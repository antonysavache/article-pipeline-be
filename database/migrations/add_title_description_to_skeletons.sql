-- Migration: Add title and description columns to skeletons table
-- Date: 2025-01-02

-- Add title column (nullable for backward compatibility)
ALTER TABLE skeletons 
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Add description column (nullable for backward compatibility)  
ALTER TABLE skeletons 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing records with default titles based on key
UPDATE skeletons 
SET title = 
  CASE 
    WHEN key = 'blog' THEN 'Blog Article'
    WHEN key = 'news' THEN 'News Article'
    WHEN key = 'review' THEN 'Product Review'
    WHEN key = 'exchange review' THEN 'Exchange Review'
    WHEN key = 'guide' THEN 'How-to Guide'
    ELSE INITCAP(REPLACE(key, '-', ' '))
  END
WHERE title IS NULL;
