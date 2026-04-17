// Archivo de declaración de módulos para imports TypeScript personalizados

declare module '../lib/supabaseClient' {
  import { SupabaseClient } from '@supabase/supabase-js';
  export const supabase: SupabaseClient;
}
