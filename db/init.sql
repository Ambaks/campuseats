-- CampusEats Database Initialization Script
-- This script sets up the initial database schema and extensions

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search optimization

-- Note: Tables are created by SQLAlchemy/Alembic
-- This script is mainly for database-level configurations

-- Create indexes for performance (if not created by SQLAlchemy)
-- These will be skipped if they already exist

DO $$ 
BEGIN
    -- Add any custom database configurations here
    -- Example: Set timezone
    EXECUTE 'ALTER DATABASE ' || current_database() || ' SET timezone TO ''UTC''';
END $$;

-- Grant necessary permissions (adjust as needed for production)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'CampusEats database initialized successfully';
END $$;
