'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/app/lib/supabase/server'
import { getUsdBalance } from '@/app/lib/supabase/helpers'

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

  const { balance, errorMessage } = await getUsdBalance(user.id);

  console.log('残高:', balance);

  if (errorMessage) {
    console.error('エラー:', errorMessage);
  } else {
    console.log('残高:', balance);
  }

  return balance;
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

  // 買い処理
  if (mode === 'buy') {
    const { balance, errorMessage } = await getUsdBalance(user.id);
    console.log('残高:', balance);

    if (errorMessage) {
      return {
        success: false,
        errorMessage: errorMessage,
      };
    }

    if (balance < amount) {
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
      price
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
  // 成功テスト
  return {
    success: true,
    errorMessage: null,
  };

  // 失敗テスト
  // return {
  //   success: false,
  //   errorMessage: '売却処理はまだ実装されていません',
  // };
}
