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

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ data: { publicUrl: string } | null; error: Error | null }> {
  try {
    console.log('Upload params:', { bucket, path, fileName: file.name });
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file)

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { data: null, error: uploadError }
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    console.log('Upload success, publicUrl:', publicUrl);
    return { data: { publicUrl }, error: null }
  } catch (err) {
    console.error('Upload catch error:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Unknown error occurred') 
    }
  }
}