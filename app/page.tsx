import dynamic from 'next/dynamic';

const MapView = dynamic((	) => import('@/components/map'), {
	ssr: false
  });

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<MapView />
		</section>
	);
}
