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

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  subscription_tier VARCHAR(50),
  usage_limits JSONB,
  currency VARCHAR(10) NOT NULL,
  payment_frequency VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  plan_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS usage_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  api_usage INT NOT NULL,
  storage_usage INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS billing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  billing_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
 
CREATE TABLE IF NOT EXISTS payment_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID  NOT NULL UNIQUE,
  auth_code TEXT NOT NULL,
  payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);



INSERT INTO plans (
  name, description, price, subscription_tier, usage_limits, currency, payment_frequency
)
VALUES
  (
    'Basic Plan',
    'Standard features with limited usage',
    10,
    'Basic',
    '{"storage": {"limit": 500, "overageRate": 0.1}, "api_calls": {"limit": 1000, "overageRate": 0.05}}',
    'NGN',
    'Monthly'
  ),
  (
    'Pro Plan',
    'Advanced features with higher usage limits',
     20,
    'Pro',
    '{"storage": {"limit": 1000, "overageRate": 0.05}, "api_calls": {"limit": 5000, "overageRate": 0.03}}',
     'NGN',
    'Monthly'
  ),
  (
    'Premium Plan',
    'Unlimited access to all features and usage',
    50,
    'Premium',
    '{}',
     'NGN',
    'Monthly'
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
