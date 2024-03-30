import React, { useEffect, useState, useRef } from 'react';
import L, { LatLngBoundsExpression } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMapEvent
} from 'react-leaflet';
import { FriendPost } from '../Types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function SetViewOnClick({ animateRef }: { animateRef: React.MutableRefObject<boolean> }) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    })
  })

  return null
}

const MapWithNoSSR = ({ posts, lng }: { posts: FriendPost[], lng: string }) => {
  const router = useRouter()
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [mapZoom, setMapZoom] = useState<number>(6);
  const [maxBounds, setMaxBounds] = useState<LatLngBoundsExpression | null>(null);
  const [ready, setReady] = useState<boolean>(false)

  const animateRef = useRef<boolean>(false);

  const createCustomIcon = (profilePicture: string | null) => {
    if (profilePicture) {
      const iconHtml: string = `<div style='width: 32px; height: 32px; border-radius: 50%; overflow: hidden;'>
                                  <img src='${profilePicture}' alt='Profile Picture' style='width: 100%; height: 100%;'>
                                </div>`;
      return new L.DivIcon({ html: iconHtml, className: 'custom-icon' });
    } else {
      const iconHtml: string = `<div style='width: 32px; height: 32px; border-radius: 50%; overflow: hidden;'>
                                  <img src='/icon.png' alt='Profile Picture' style='width: 100%; height: 100%;'>
                                </div>`;
      return new L.DivIcon({ html: iconHtml, className: 'custom-icon' });
    }
  };  

  useEffect(() => {
    setMapCenter([10, 11])
    if (posts && posts.length > 0) {
      const postsWithLocation = posts.filter((friendPost) =>
        friendPost.posts.some((post) =>
          post.location &&
          post.location.latitude &&
          post.location.longitude
        )
      );

      if (postsWithLocation.length > 0) {
        const bounds = L.latLngBounds(
          postsWithLocation.flatMap(friendPost =>
            friendPost.posts
              .filter(post =>
                post.location &&
                typeof post.location.latitude === 'number' &&
                typeof post.location.longitude === 'number'
              )
              .map(post => L.latLng(post.location!.latitude, post.location!.longitude))
          )
        );

        const center = [bounds.getCenter().lat, bounds.getCenter().lng];
        console.log(center, bounds)
        setMapCenter(center as [number, number]);
        setMaxBounds(bounds);
  
        const maxZoom = 18;
        const fitBoundsZoom = mapZoom > maxZoom ? maxZoom : mapZoom;
        setMapZoom(fitBoundsZoom);
        setReady(true)
      }  
    }
  }, [posts, mapZoom]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
      }}
    >
      {ready && (
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100vh', width: '100vw', position: 'absolute' }}
        zoomControl={false}
        minZoom={3}
        maxZoom={18}
      >
        <TileLayer url='http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png' />

        {posts && posts.map((post) => {
          if (
              !post.posts ||
              post.posts.length === 0 ||
              !post.user ||
              !post.user.profilePicture
          ) {
            console.log('Missing data for the post:', post);
            return null;
          }

          return post.posts.map((innerPost, innerIndex) => {
            if (
              !innerPost.location ||
              !innerPost.location.latitude ||
              !innerPost.location.longitude ||
              !innerPost.primary ||
              !innerPost.secondary 
            ) {
              return null;
            }

            const { latitude, longitude } = innerPost.location;
            const { profilePicture } = post.user; 

            const position = [latitude, longitude];

            return (
              <Marker
                key={innerPost.id}
                position={position as any}
                icon={createCustomIcon(profilePicture ? profilePicture.url : null)}
              >
                <Popup>
                  <div className='relative -my-1 -mx-2 text-center' onClick={() => {
                    router.push(`/${lng}/feed/${post.user.username}`)
                  }}>
                    <Image
                        width={innerPost.primary.width}
                        height={innerPost.primary.height}
                        className="w-full rounded-lg mb-2"
                        style={{ width: "100%", height: "auto" }}
                        src={innerPost.primary.url}
                        alt={`Image primary`}
                      />
                      <Image
                        width={innerPost.secondary.width}
                        height={innerPost.secondary.height}
                        className="w-full rounded-md border border-black"
                        style={{
                          width: "40%",
                          height: "auto",
                          position: "absolute",
                          top: "2px",
                          left: "2px",
                        }}
                        src={innerPost.secondary.url}
                        alt={`Image secondary`}
                      />
                      {post.user.fullname ? post.user.fullname : post.user.username}
                  </div>
                </Popup>
              </Marker>
            );
          });
        })}
        <ZoomControl position='topright' />
        <SetViewOnClick animateRef={animateRef} />
      </MapContainer>
      )}
    </div>
  );
};

export default MapWithNoSSR;