import axios from 'axios';

export default function useCheck(router: any, from: string) {
    let ls = localStorage.getItem("token")
    if (ls == null) {
        router.replace("/login/phone-number");
        return;
    } else {
        let parsedLS = JSON.parse(ls)
        let refresh_token = parsedLS.refresh_token;
        let expiration = parsedLS.token_expiration;
        let now = Date.now();
        if (now > parseInt(expiration)) {
            axios.request(
                {
                    url: "/api/refresh",
                    method: "POST",
                    data: { refresh: refresh_token }
                }
            ).then(
                (response) => {
                    console.log(response.data);
                    if (response.data.status == "success") {
                        localStorage.setItem('token', JSON.stringify({
                            token: response.data.token,
                            refresh_token: response.data.refresh,
                            token_expiration: response.data.expiration
                        }));
                        router.replace(from);
                        
                    } else {
                        console.log("refresh error");
                        localStorage.removeItem("token");
                        router.replace("/");
                        return;
                    }
                }).catch(() => {
                        localStorage.removeItem("token");
                        router.replace("/");
                        return;
                    }
                )
        }
    }
    return true;
}