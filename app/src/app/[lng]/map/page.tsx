'use client';
import React, { useState, useEffect } from 'react';
import Maps from '@/components/Map/MapWithNoSSR';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { IoArrowBack } from "react-icons/io5";
import { dataIsValid } from '@/components/Functions';

export default function Map({ params }: { params: { lng: string } }): JSX.Element {
  const router = useRouter();
  const domain = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_DEV_DOMAIN : process.env.NEXT_PUBLIC_DOMAIN;

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if(!dataIsValid()){
        router.replace(`/${params.lng}/login/phone-number`)
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      const lsToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const parsedLSToken = JSON.parse(lsToken || '{}');
      const { token, token_expiration, refresh_token } = parsedLSToken;
      const lsUser = typeof window !== 'undefined' ? localStorage.getItem('myself') : null;
      const parsedLSUser = JSON.parse(lsUser || '{}');
      const userId = parsedLSUser.id;

      if (!token || !token_expiration || !refresh_token) {
        console.log('no token in ls');
        return router.replace(`/${params.lng}/login/phone-number`);
      }

      try {
        const response = await axios.get(`${domain}/api/feed`, {
          headers: {
            token,
            token_expiration,
            refresh_token,
            userid: userId
          }
        });

        const feedData = response.data.feed;
        setPosts(feedData.friendsPosts);

        if (response.data.refresh_data && typeof window !== 'undefined') {
          console.log('===== refreshed data =====');
          console.log(response.data.refresh_data);
          localStorage.setItem('token', JSON.stringify(response.data.refresh_data));
        }
      } catch (error: any) {
        if (error.response && error.response.data.refresh_data && typeof window !== 'undefined') {
          console.log('===== refreshed data =====');
          console.log(error.response.data.refresh_data);
          localStorage.setItem('token', error.response.data.refresh_data);
        }
        
        router.replace(`/${params.lng}/error`);
      }
    };

    fetchData();
  }, []);    

  return (
    <>
      <button
        onClick={() => router.back()}
        className='fixed top-3 left-3 rounded-lg transition-all transform hover:scale-105 hover:bg-white/10 px-2 py-1 z-[70]'
      >
        <IoArrowBack className='h-6 w-6'/>
      </button>
      <Maps posts={posts} lng={params.lng}/>
    </>
  );
}