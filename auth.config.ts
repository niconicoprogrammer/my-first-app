import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  // ログインページのパスのカスタマイズ
  // ログインが必要なページにアクセスしたけど未認証なときリダイレクト
  pages: {
    signIn: '/login',
  },

  callbacks: {
    // ユーザーが特定のページにアクセスしていいかどうかを判断する関数
    // authorizedが返せるのはbooleanだけ
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // dashboardにアクセスしてるか
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard && !isLoggedIn) {
        return false; // 未ログイン → 自動で login に飛ばしてくれる
      }
      return true;
    },

    // コールバック関数 redirect を定義
    // callbacksのプロパティとしてredirect関数を登録しておいて、必要になったら呼び出される(NextAuthが勝手に呼び出す)
    // 中身の { url, baseUrl } は、NextAuth が自動で渡してくれる引数（オブジェクト）を分割代入している。
    // url	string	ユーザーがリダイレクトされようとしている「元のURL」例: http://localhost:3000/trade
    // baseUrl	string	サイトのルートURL（環境によって http://localhost:3000 など）
    redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`; // ログイン成功後にリダイレクトする先
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;