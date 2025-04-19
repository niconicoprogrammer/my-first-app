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

export async function tradeAction(_: unknown, formData: FormData, ) {
  const supabase = await createClient();
  const mode = formData.get('mode'); // ← 追加

  const amount = Number(formData.get('amount'));
  const current_price = Number(formData.get('current_price'));
  const usdTotal = Number(formData.get('usdTotal'));
  const holdingAmount = Number(formData.get('holdingAmount'));
  const usdValueOfHolding = holdingAmount * current_price; // 保有USD換算額
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

    if (usdTotal < amount) {
      return {
        success: false,
        errorMessage: '残高不足です',
      };
    }

    const { error: insertError } = await supabase.from('trades').insert({
      user_id: user.id,
      trade_type: 'buy',
      symbol,
      amount: Number((amount / current_price).toFixed(8)), // 通貨の数量
      price: current_price
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

  // 売却処理
  if (mode === 'sell') {
  
    if (usdValueOfHolding < amount) {
      return {
        success: false,
        errorMessage: `保有USD換算額が不足しています`,
      };
    }
  
    const sellAmount = Number((amount / current_price).toFixed(8));
  
    const { error: sellError } = await supabase.from('trades').insert({
      user_id: user.id,
      trade_type: 'sell',
      symbol,
      amount: sellAmount,
      price: current_price,
    });
  
    if (sellError) {
      return {
        success: false,
        errorMessage: sellError.message,
      };
    }
  
    return {
      success: true,
      errorMessage: null,
    };
  }

  // ✅ 不明なモード
  return {
    success: false,
    errorMessage: '無効な取引モードです',
  };
}

export async function fetchUnifiedHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    revalidatePath('/', 'layout');
    redirect('/login');
  }

  const { data: deposits } = await supabase
    .from('deposits')
    .select('id, created_at, amount, status')
    .eq('user_id', user.id);

  const { data: trades } = await supabase
    .from('trades')
    .select('id, created_at, symbol, amount, price, trade_type')
    .eq('user_id', user.id);

  // 整形して type を付ける
  const depositHistory = (deposits ?? []).map((d) => ({
    id: d.id,
    type: 'deposit' as const,
    date: d.created_at,
    amount: null,
    price: null,
    usdTotal: Number(d.amount),
    symbol: null,
    image: null,
  }));

  const tradeHistory = (trades ?? []).map((t) => ({
    id: t.id,
    type: t.trade_type as 'buy' | 'sell',
    date: t.created_at,
    amount: Number(t.amount),
    price: Number(t.price),
    usdTotal: Number(t.amount) * Number(t.price),
    symbol: t.symbol,
    image: null,
  }));

  // 合体＋ソート
  const unified = [...depositHistory, ...tradeHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return unified;
}

