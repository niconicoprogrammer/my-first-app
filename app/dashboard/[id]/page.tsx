import CoinDetail from '@/app/ui/dashboard/coin-detail';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await Promise.resolve(params);

  return (
    <main>
      <CoinDetail id={id} />
    </main>
  );
}