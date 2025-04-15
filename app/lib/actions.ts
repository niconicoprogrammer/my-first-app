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

export async function depositAction(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const amount = Number(formData.get('amount'))

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    revalidatePath('/', 'layout') // キャッシュ再検証（任意）
    redirect('/login') // ログイン画面にリダイレクト
  }

  console.log ("amount：" + amount);

  const { error } = await supabase.from('deposits').insert({
    user_id: user.id,
    amount,
    currency: 'USD',
    status: 'completed',
  })
  
  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    }
  }

  return {
    success: true,
    errorMessage: null,
  }
}

export async function fetchUsdBalance() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    revalidatePath('/', 'layout') // キャッシュ再検証（任意）
    redirect('/login') // ログイン画面にリダイレクト
  }

  const { data, error } = await supabase
    .from('deposits')
    .select('amount')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  if (error || !data) return 0

  // amount合計
  const total = data.reduce((sum, row) => sum + Number(row.amount), 0)
  return total
}

export async function tradeAction(_: unknown, formData: FormData) {
  const supabase = await createClient();
  const mode = formData.get('mode'); // ← 追加

  const amount = Number(formData.get('amount'));
  const price = Number(formData.get('price'));
  const symbol = formData.get('symbol');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    revalidatePath('/', 'layout');
    redirect('/login');
  }

  if (mode === 'buy') {
    // ✅ 買い処理のみ実装
    const { data, error: depositsError } = await supabase
      .from('deposits')
      .select('amount')
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (depositsError || !data) {
      return {
        success: false,
        errorMessage: depositsError?.message ?? '資産取得に失敗しました',
      };
    }

    const USDBalance = data.reduce((sum, row) => sum + Number(row.amount), 0);

    if (amount > USDBalance) {
      return {
        success: false,
        errorMessage: '残高不足です',
      };
    }

    const { error: insertError } = await supabase.from('trades').insert({
      user_id: user.id,
      trade_type: 'buy',
      symbol,
      amount: Number((amount / price).toFixed(8)), // 通貨の数量
      price,
      total: amount,
    });

    if (insertError) {
      return {
        success: false,
        errorMessage: insertError.message,
      };
    }

    return {
      success: true,
      errorMessage: null,
    };
  }

  // TODO: 売り処理が未実装の場合
  return {
    success: false,
    errorMessage: '売却処理はまだ実装されていません',
  };
}
