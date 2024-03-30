import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { FriendPost } from '@/components/Types';

const MapWithNoSSR = dynamic(() => import('./MapWithSSR'), {
  ssr: false,
});

const Map = ({ posts, lng }: { posts: FriendPost[], lng: string }) => {
  return <MapWithNoSSR posts={posts} lng={lng}/>;
};

export default Map;