import { cookies } from 'next/headers'

const domain = "https://berealapi.fly.dev"

export default async function Home() {

  const cookieStore = cookies()
  const token = cookieStore.get('token')

  async function refreshToken(response: any) {
    console.log(response)
    if (response.status == 201) {
      cookieStore.set('token', response.data.token)
    }
  }

  if (token) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json")
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({"token": token?.value}),
      redirects: 'follow'
    };
    fetch(`${domain}/login/refresh`, requestOptions)
      .then(response => response.text())
      .then(result => refreshToken(JSON.parse(result)))
      .catch(error => console.log('error', error));
  }
  return (
    <main>
    </main>
  )
}
