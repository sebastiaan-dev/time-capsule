-- Create the "timecapsule_prod" database if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'timecapsule_prod') THEN
        CREATE DATABASE timecapsule_prod;
    END IF;
END $$;

-- Connect to the "timecapsule_prod" database
\c timecapsule_prod;

-- Create the "timecapsules" table if it doesn't exist
CREATE TABLE IF NOT EXISTS timecapsules (
    id serial PRIMARY KEY,
    title text NOT NULL,
    message text NOT NULL,
    date timestamp,
    created_at timestamp
);

-- Insert two example rows of data
INSERT INTO timecapsules (title, message, date) VALUES
    ('Birthday Capsule', 'Happy Birthday!', '2024-01-14 12:00:00'),
    ('Lecture Capsule', 'Third lecture of Software Containerization!',
        '2024-01-15 15:30:00');

-- Exit session
\q
