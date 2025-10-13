import { useEffect, useState } from "react";
import { getOneOptical } from "../services/api";
import "./viewOptical.css";

export default function OneOptical() {
    interface Optical {
        id_optical: number;
        nameOp: string;
        address: string;
        tel: string;
        city: number;
        email: string;
        logo: string;
        user: number;
        certCadecuacion: string;
        certDispensacion: string;
        latitud: number;
        longitud: number;
    }
       
    const [optic, setOptic] = useState<Optical | null>(null);

    useEffect(() => {

        getOneOptical(1)
            .then((res) => setOptic(res.data))
            .catch((err) => console.error(err));
    }, []);
    console.log(optic)
    console.log(optic?.nameOp)
   
    if (!optic) return <div>Loading...</div>
    return (
     <div>{optic?.nameOp}</div>
            
    )
}