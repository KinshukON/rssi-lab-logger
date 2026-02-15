-- Devices table (optional, for future device tracking)
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  platform text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Experiments table
CREATE TABLE IF NOT EXISTS experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id uuid REFERENCES devices(id) ON DELETE SET NULL,
  meta jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Readings table
CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at_iso text NOT NULL,
  distance_m double precision NOT NULL,
  rssi_dbm integer NOT NULL,
  noise_dbm integer,
  tx_rate_mbps double precision,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_experiment_id ON readings(experiment_id);
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);

-- RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Policies: users can CRUD only their own rows
CREATE POLICY "devices_select_own" ON devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "devices_insert_own" ON devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "devices_update_own" ON devices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "devices_delete_own" ON devices FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "experiments_select_own" ON experiments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "experiments_insert_own" ON experiments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "experiments_update_own" ON experiments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "experiments_delete_own" ON experiments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "readings_select_own" ON readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "readings_insert_own" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "readings_update_own" ON readings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "readings_delete_own" ON readings FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at on experiments
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS experiments_updated_at ON experiments;
CREATE TRIGGER experiments_updated_at
  BEFORE UPDATE ON experiments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
