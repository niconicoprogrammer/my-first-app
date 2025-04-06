import CoinDetail from '@/app/ui/dashboard/coin-detail';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await Promise.resolve(params);

  return (
    <main>
      <CoinDetail id={id} />
    </main>
  );
}