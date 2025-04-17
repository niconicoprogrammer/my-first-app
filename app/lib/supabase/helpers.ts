'use server'

import { createClient } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getUserOrRedirect() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    revalidatePath('/', 'layout')
    redirect('/login')
  }

  return { supabase, user }
}

  export async function getUsdBalance(userId: string) {
    const supabase = await createClient()
  
    // deposits（入金）の合計
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'completed')
  
    if (depositsError) {
      return { balance: 0, errorMessage: depositsError.message }
    }
    if (!deposits) {
      return { balance: 0, errorMessage: '入金データの取得に失敗しました' }
    }
  
    const depositTotal = deposits.reduce((sum, row) => sum + Number(row.amount), 0)
  
    // trades（売買）の取得
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('trade_type, total')
      .eq('user_id', userId)
      .eq('status', 'completed')
  
    if (tradesError) {
      return { balance: depositTotal, errorMessage: tradesError.message }
    }
    if (!trades) {
      return { balance: depositTotal, errorMessage: '取引データの取得に失敗しました' }
    }
  
    // 売買による収支差分
    const tradeTotal = trades.reduce((sum, row) => {
      const total = Number(row.total)
      return row.trade_type === 'sell' ? sum + total : sum - total
    }, 0)
  
    // 残高 = 入金 - 購入 + 売却
    const balance = depositTotal + tradeTotal
  
    return { balance, errorMessage: null }
  }
  
//   export async function getHoldingAmount(userId: string, symbol: string): Promise<number> {
//     const supabase = await createClient()
  
//     const { data: trades, error } = await supabase
//       .from('trades')
//       .select('trade_type, amount')
//       .eq('user_id', userId)
//       .eq('symbol', symbol)
//       .eq('status', 'completed')
  
//     if (error || !trades) return 0
  
//     const amount = trades.reduce((sum, row) => {
//       const value = Number(row.amount)
//       return row.trade_type === 'buy' ? sum + value : sum - value
//     }, 0)
  
//     return amount
//   }
  
  export async function getAllHoldings(userId: string) {
    const supabase = await createClient();
  
    const { data: trades, error } = await supabase
      .from('trades')
      .select('symbol, trade_type, amount')
      .eq('user_id', userId)
      .eq('status', 'completed');
  
    if (error || !trades) return {};
  
    const holdings: { [symbol: string]: number } = {};
  
    for (const row of trades) {
      const symbol = row.symbol.toLowerCase();
      const amount = Number(row.amount);
  
      holdings[symbol] ??= 0;
      holdings[symbol] += row.trade_type === 'buy' ? amount : -amount;
    }
  
    return holdings;
  }
  
