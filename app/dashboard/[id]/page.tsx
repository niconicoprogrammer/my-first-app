import CoinDetail from '@/app/ui/dashboard/coin-detail';

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const id = (await params).id;

  return (
    <main>
      <CoinDetail id={id} />
    </main>
  );
}