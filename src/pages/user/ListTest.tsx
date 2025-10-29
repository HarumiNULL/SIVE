import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getQuestionaries, QuestionaryItem } from "../../services/api";
import './listTest.css'

export default function ListTest() {


    const [test, setTest] = useState<QuestionaryItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        getQuestionaries()
            .then((res) => setTest(res))
            .catch((err) => {
                console.error("Error al obtener los test:", err);
                setError("Error al obtener los datos");
            });
    }, []);
   


    const getRouteForTest = (testName: string, id:number) => {
        switch (testName.toLowerCase()) {
            case "test de daltonismo(ishihara)":
                return `/test/${id}`;
            case "tabla de snellen ":
                return `/test/${id}`;
            default:
                return "/testGenerico"; // ruta por defecto
        }
    };
    const getImgForTest = (testName: string) => {
        switch (testName.toLowerCase()) {
            case "ishihara":
                return "src\\assets\\IshiharaSample.png";
            case "tabla de snellen ":
                return "src\\assets\\snellen_2daOpcion.svg";
            default:
                return "src\\assets\\IshiharaSample.png"; // ruta por defecto
        }
    };

    if (error) return <div>{error}</div>
    return (
        <>
            <Navbar />
            <div className="test-list-container">
                <h1 className="title-header"> Tests disponibles</h1>

                {test.length > 0 ? (
                    test.map((tes) => (
                        <div key={tes.id_questionary} className="test-card">
                            <div className="test-info">
                                <h1 className="test-name" >{tes.name_questionary}</h1>
                                <p className="test-descriptions">{tes.description}</p>
                                <div className="test-buttons">
                                    <button className="visit-btn-test">
                                        <Link to={getRouteForTest(tes.name_questionary,tes.id_questionary)} className="linksss">
                                    Realiza el test
                                </Link></button>
                                </div>
                            </div>
                            <div className="test-image">
                                <img src={getImgForTest(tes.name_questionary)} alt="" />
                            </div>
                        </div>
                    ))

                ) : (
                    <p>No hay cuestionarios disponibles</p>
                )}

            </div>


        </>


    )


}





