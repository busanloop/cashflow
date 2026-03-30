import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mgjfjtoyzhdfljjyqelz.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1namZqdG95emhkZmxqanlxZWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzMzMzgsImV4cCI6MjA5MDQ0OTMzOH0.WeHiK18XhWEECVeLn2oBySr7KsCq39a4kRyMWXhXZv8";

export const supabase = createClient(url.trim(), key.trim());
