import CoinDetail from '@/app/ui/dashboard/coin-detail';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main>
      <CoinDetail id={params.id} />
    </main>
  );
}
