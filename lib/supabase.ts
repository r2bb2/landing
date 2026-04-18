import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export async function uploadImage(file: File, folder: string = "general"): Promise<string> {
  const ext = file.name.split(".").pop()
  const path = `${folder}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from("images").getPublicUrl(path)
  return data.publicUrl
}
