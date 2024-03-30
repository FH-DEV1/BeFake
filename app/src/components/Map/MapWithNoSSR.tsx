import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { FriendPost } from '@/components/Types';

const MapWithNoSSR = dynamic(() => import('./MapWithSSR'), {
  ssr: false,
});

const Map = ({ posts }: { posts: FriendPost[] }) => {
  return <MapWithNoSSR posts={posts} />;
};

export default Map;