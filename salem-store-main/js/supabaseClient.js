// supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  "https://ihoexzjaofkjxuldrkzg.supabase.co", // ← reemplazá con tu URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlob2V4emphb2Zranh1bGRya3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDUzODAsImV4cCI6MjA3NTY4MTM4MH0.MGy0R8r6ed9WA2FUKYsmln8lU7HtuLDmYyZc3mWuEQM"               // ← reemplazá con tu public anon key
);
