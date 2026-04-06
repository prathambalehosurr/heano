import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://aqlgvxjraxyjpbhebgks.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbGd2eGpyYXh5anBiaGViZ2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODI0MzIsImV4cCI6MjA5MDk1ODQzMn0.NDHHPr5efIPasNFBpOiJOm4OPyG5XW3MJoWFECfvi0g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
