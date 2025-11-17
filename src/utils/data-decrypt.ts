import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../constants/secret-key";


export const dataDecrypt = (value: string| null) => {
    if (!value) return null; // si viene null, no intentamos desencriptar

    try {
        const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Error decrypting value:", error);
        return null;
    }
}