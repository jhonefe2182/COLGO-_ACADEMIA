// @ts-ignore
import { supabase } from '../../lib/supabaseClient'
import { mockDB, type Student, type StudentStatus } from './mockData'
// Utilidad para generar UUID (compatible con navegadores modernos y Node.js)
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback simple
  return 'stu_' + Math.random().toString(36).slice(2, 10) + Date.now();
}

export interface StudentInsert {
  name: string
  document: string
  sede_id: string
  status: StudentStatus
  email?: string
  phone?: string
}

// Helper para mapear student de Supabase a modelo frontend
function mapStudent(s: any, sedeName: string): Student {
  return {
    id: s.id,
    name: s.name,
    document: s.document,
    status: s.status,
    sede: sedeName as Student['sede'],
    courseTitle: 'Sin asignar', // El título del curso debe venir de la matrícula
  }
}

export const StudentService = {
  async list(): Promise<Student[]> {
    try {
      // Traer estudiantes y hacer join con sedes
      const { data, error } = await supabase
        .from('students')
        .select('*, sede:sedes(city)')
        .order('name', { ascending: true })
      if (error) throw new Error(error.message)
      if (!data) return []
      return data.map((s: any) => mapStudent(s, s.sede?.city || 'Virtual'))
    } catch (err) {
      return mockDB.students
    }
  },

  async create(student: StudentInsert): Promise<Student> {
    // Generar id único
    const id = generateId();
    const { data, error } = await supabase
      .from('students')
      .insert([{ ...student, id }])
      .select('*, sede:sedes(city)')
      .single()
    if (error) throw new Error(error.message)
    return mapStudent(data, data.sede?.city || 'Virtual')
  },

  async update(id: string, student: Partial<StudentInsert>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(student)
      .eq('id', id)
      .select('*, sede:sedes(city)')
      .single()
    if (error) throw new Error(error.message)
    return mapStudent(data, data.sede?.city || 'Virtual')
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
  },
}
// Duplicate import removed
