-- Создание таблицы skeletons (если её ещё нет)
CREATE TABLE IF NOT EXISTS skeletons (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL
);

-- Добавление тестовых данных
INSERT INTO skeletons (key, content) VALUES 
('exchange-review', 'Exchange Review Skeleton: Introduction -> Features Analysis -> Security Assessment -> User Experience -> Conclusion')
ON CONFLICT (key) DO UPDATE SET 
    content = EXCLUDED.content;
