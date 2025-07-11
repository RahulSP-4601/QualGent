-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: categories
CREATE TABLE IF NOT EXISTS CATEGORIES (
    ID UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    NAME TEXT UNIQUE NOT NULL,
    CREATED_AT TIMESTAMPTZ DEFAULT NOW()
);

-- Table: test_cases
CREATE TABLE IF NOT EXISTS TEST_CASES (
    ID UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    CATEGORY_ID UUID REFERENCES CATEGORIES(ID) ON DELETE CASCADE,
    NAME TEXT NOT NULL,
    DESCRIPTION TEXT,
    CREATED_AT TIMESTAMPTZ DEFAULT NOW()
);