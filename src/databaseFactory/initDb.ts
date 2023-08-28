import { Pool } from 'pg';
import { config } from 'dotenv';
config();
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'salla-db',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

(async () => {
  const createTablesSql = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL,
  subscription_tier VARCHAR(50),
  usage_limits JSONB,  
  additional_charges TEXT,
  renewal_date DATE,
  expiration_date DATE,
  currency VARCHAR(10) NOT NULL,
  payment_frequency VARCHAR(20) NOT NULL,
  cancellation_policy TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  user_id UUID NOT NULL,
  UNIQUE (user_id, subscription_tier),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

    CREATE TABLE IF NOT EXISTS usage_history (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    subscription_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    usage_details JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
  );


    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();  
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER users_update_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  `;

  const client = await pool.connect();

  try {
    await client.query(createTablesSql);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
})();
