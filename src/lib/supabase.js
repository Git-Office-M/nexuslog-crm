import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gshkjepwsrespxedufyf.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaGtqZXB3c3Jlc3B4ZWR1ZnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjMyMjIsImV4cCI6MjA5NjI5OTIyMn0.Ib8di_svoz65a-7e-qBRj61ZxoUFnoMyGONq5pY-Azs';

export const supabase = createClient(supabaseUrl, supabaseKey);
