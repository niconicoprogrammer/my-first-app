'use server';
 
import { signIn , signOut} from '@/auth';
import { AuthError } from 'next-auth';

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
 
export async function authenticate(
  prevState: string | undefined, //useActionState() から渡ってくる「前回の状態（主にエラーメッセージ）」。使わないなら _ にしてもOK。
  formData: FormData, //クライアントのフォームで送られてきたデータ。formData.get('email') などで取り出せる
) {
  try {
    // auth.tsのsignIn()を呼び出す
    await signIn('credentials', formData); //credentials は next-auth の「メール＋パスワード」などを使った認証方式
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'メールアドレスまたはパスワードが間違っています。';
        default:
          return '問題が発生しました。';
      }
    }
    throw error;
  }
}