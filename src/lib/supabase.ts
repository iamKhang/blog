import { createClient } from '@supabase/supabase-js'

// Lấy giá trị từ biến môi trường với kiểm tra null/undefined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Kiểm tra xem các giá trị có tồn tại không
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. File uploads will not work.')
}

// Tạo Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadFile(file: File, bucket: string) {
  console.log(file)
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${bucket}/${fileName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}