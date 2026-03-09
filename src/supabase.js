import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://efsjtvxcjbghefckdvrm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmc2p0dnhjamJnaGVmY2tkdnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjUxNjksImV4cCI6MjA4Nzg0MTE2OX0.iOImm-xOibS_Jo-DbebU3r8pffjf-YQ0iWsEYQmsNIc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
