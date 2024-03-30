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