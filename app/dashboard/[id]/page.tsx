import CoinDetail from '@/app/ui/dashboard/coin-detail';

type Props = {
  params: {
    id: string;
  }
}

export default async function Page({ params }: Props) {
  const id = (await params).id;

  return (
    <main>
      <CoinDetail id={id} />
    </main>
  );
}