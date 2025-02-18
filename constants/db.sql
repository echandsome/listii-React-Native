CREATE TABLE IF NOT EXISTS lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    type TEXT,
    user_id TEXT,
    is_archive BOOLEAN,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grocery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    name TEXT,
    price TEXT,
    quantity TEXT,
    shop TEXT,
    is_check BOOLEAN,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookmark_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    name TEXT,
    path TEXT,
    is_check boolean,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS note_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    name TEXT,
    note TEXT,
    is_check boolean,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS todo_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    name TEXT,
    priority TEXT,
    is_check boolean,
    created_at TIMESTAMP DEFAULT now()
);

