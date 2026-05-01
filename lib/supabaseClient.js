import { createClient } from '@supabase/supabase-js'

// Intentar obtener las variables de process.env (Backend/Node) 
// o de import.meta.env (Frontend/Vite)
const supabaseUrl = 
  process.env.SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL || 
  ''

const supabaseKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('Atención: Faltan las credenciales de Supabase en las variables de entorno.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)