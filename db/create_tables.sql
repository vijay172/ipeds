
CREATE SCHEMA IF NOT EXISTS :SCHEMA_NAME;
SET SEARCH_PATH TO :SCHEMA_NAME;

CREATE TABLE IF NOT EXISTS venue_metadata (
  id UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
  type TEXT DEFAULT '',
  parameters jsonb,
  storage_location TEXT,
  created_by TEXT DEFAULT '',
  created_on TIMESTAMP WITH TIME ZONE default timezone('UTC'::text, now()),
  updated_by TEXT DEFAULT '',
  updated_on TIMESTAMP WITH TIME ZONE  default timezone('UTC'::text, now())
);

CREATE INDEX IF NOT EXISTS i_vm_pname ON venue_metadata ((parameters->>'ParameterName'));
