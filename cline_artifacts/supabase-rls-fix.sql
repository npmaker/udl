-- Fix for RLS policy issue with log_entries table
-- Run this in your Supabase SQL editor

-- First, let's modify the table to set user_id automatically
ALTER TABLE log_entries ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Update the RLS policy to be more explicit
DROP POLICY IF EXISTS "Users can only access their own logs" ON log_entries;

-- Create separate policies for different operations
CREATE POLICY "Users can insert their own logs" ON log_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own logs" ON log_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs" ON log_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs" ON log_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Alternative approach: Create a trigger to automatically set user_id
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_user_id_trigger
  BEFORE INSERT ON log_entries
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();
