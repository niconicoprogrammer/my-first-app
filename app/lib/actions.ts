'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/app/lib/supabase/server'

export async function login(f_prevState: string | undefined, formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // redirect('/error')
    return error.message // ✅ useActionState に返す
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?login=success')
}

export async function signup(_prevState: string | undefined, formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // redirect('/error')
    return error.message // ✅ useActionState に返す
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?signup=success')
}

export async function logout() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout') // キャッシュ再検証（任意）
  redirect('/login') // ログイン画面にリダイレクト
}