import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://joywmjurzthsnhsltves.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveXdtanVyenRoc25oc2x0dmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTc4NDcsImV4cCI6MjA5MDk3Mzg0N30.CAzTjqKu1mX_ehhDoPJq07xe2ZgdL8vJPcPUIJRWwzk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
