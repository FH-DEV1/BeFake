"use client"
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'

const Home = () => {
  const domain = "https://berealapi.fly.dev"
  const router = useRouter()
  const token = Cookies.get('token');

  const refreshToken = (newToken: {data: any; status: number;}) => {
    if (newToken.status == 201){
      console.log(newToken)
      Cookies.set('token', newToken.data.token, { expires: 30 });
      router.push("/feed")
    }
    else {
      router.push("/login")
    }
  };

  useEffect(() => {
    if (token) {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ token }),
        redirects: 'follow',
      };

      fetch(`${domain}/login/refresh`, requestOptions)
        .then((response) => response.text())
        .then((result) => refreshToken(JSON.parse(result)))
        .catch((error) => console.log('error', error));
    }
    else {
      router.push("/login")
    }
  }, [token]);

  return (
    <div>
      <h1>{Cookies.get('token')}</h1>
    </div>
  );
};

export default Home;