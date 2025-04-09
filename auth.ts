import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials'; // 「ID・パスワードでのログイン」を扱うプロバイダー（=認証方式） GoogleやGitHubなどのOAuth認証を使う場合は、別のプロバイダーを使う
import { authConfig } from '@/auth.config';
import { z } from 'zod';   // バリデーションライブラリ
import type { User } from '@/app/lib/definitions';

// 連想配列のキーと値を設定してる
// スプレッド構文は連想配列同士のマージに近い

// NextAuth({ ... }) を実行
// 戻ってきたオブジェクトの中に { auth, signIn, signOut } というキーがある
// それを分割代入（destructuring）で取り出して
// そのまま export（他のファイルから使えるように）してる

// こういう書き方もできる
// const result = NextAuth({ ... });
// const auth = result.auth;
// const signIn = result.signIn;
// const signOut = result.signOut;
// export { auth, signIn, signOut };

// NextAuthに1つの引数（オブジェクト）を渡して実行し、返ってきたauth, signIn, signOutを
// それぞれexportして使えるようにしてる

// 分割代入
// const user = {
//   name: 'Taro',
//   age: 25,
// };
// const { name, age } = user;
// console.log(name); // 'Taro'

export const { auth, signIn, signOut } = NextAuth({
  // 下の構文はこんな感じと同じらしい
  // const obj = {
  //   name: 'Taro',
  //   age: 20,
  // };

  ...authConfig, // スプレッド構文
  // pages: {
  //   signIn: '/login',
  // },
  // callbacks: {
  //   authorized(...) { ... }
  // },
  
  // providersプロパティを上書き・追加
  // providersプロパティは、認証方式を指定するためのもの
  providers: [
    // 認証方式を指定する 
    // Credentials(): 自分で作る認証ロジック
    // GoogleProvider(): GoogleのOAuth認証
    // GitHubProvider(): GitHubのOAuth認証

    Credentials({
      // ユーザー情報かnullを返す
      // ユーザー情報（user オブジェクト）を返したら 認証成功
      // null を返したら 認証失敗
      // セッションが登録されるタイミング：authorize() で user を返した直後
      async authorize(credentials) {
        // バリデーション
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) }) //オブジェクトの型（ルール）定義
          .safeParse(credentials); // 上記ルールに照らし合わせてチェック
          // ✅ 成功 → { success: true, data: { email, password } }
          // ❌ 失敗 → { success: false, error: 具体的なエラー情報 }

        if (parsedCredentials.success) {
          // 分割代入
          const { email, password } = parsedCredentials.data;

          // ✅ ハードコーディングによる認証
          if (
            email === 'taro@example.com' &&
            password === 'pass1234'
          ) {
            const user: User = {
              id: '1',
              name: 'Taro',
              email: 'taro@example.com',
            };
            return user;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
