import { Suspense } from 'react';
import LoginForm from '@/app/ui/login-form';

export default function Page() {
  return (
    <main>
      <Suspense fallback={<div>ログイン画面を読み込み中...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
