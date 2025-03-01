
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lkxxniivglfumvjlqtch.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreHhuaWl2Z2xmdW12amxxdGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4Mjc3NjgsImV4cCI6MjA1NjQwMzc2OH0.IG_mM9BceIMtlETQYdWIjHJ8wA_lcaVCRrEre_AfYVI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
