export function getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve) => {
        let baseURL: string | ArrayBuffer | null = null;
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            if (reader.result) {
                baseURL = reader.result;
            }
            resolve(baseURL);
        };
    });
}

export function copyTextToClipboard(text: string) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => {
                return true
            })
            .catch((error) => {
                console.error('Unable to copy using Clipboard API:', error);
                fallbackCopyTextToClipboard(text);
            });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}
  
function fallbackCopyTextToClipboard(text: string) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    return true
}

export function dataIsValid(): boolean {
    if (typeof window !== "undefined"){
        let LStoken = localStorage.getItem('token')
        const token = JSON.parse(LStoken !== null ? LStoken : "{}")
        const version: string|null = localStorage.getItem('v')
        if (version !== process.env.NEXT_PUBLIC_VERSION || !token.token || !token.refresh_token || !token.token_expiration) {
            localStorage.clear()
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}