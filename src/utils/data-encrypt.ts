import CryptoJS from "crypto-js";    
import { SECRET_KEY } from "../constants/secret-key"; 

export const dataEncrypt=(value:string)=>{
    return CryptoJS.AES.encrypt(JSON.stringify(value),SECRET_KEY).toString();
}