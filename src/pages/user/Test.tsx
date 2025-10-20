import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './test.css'
import Navbar from "../../components/Navbar";
import { getOneQuestionary, Questionary, Option, Question } from '../../services/api';

export default function Test() {
    const { id } = useParams();
    const [test, setTest] = useState<Questionary | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (id) {
            getOneQuestionary(Number(id))
                .then((res) => setTest(res))
                .catch(() => setError("Error al obtener los datos"));
        } else {
            setError("Hubo un error al obtenr el test")
        }
    }, [id]);
    console.log(test)
    if (error) return <div>{error}</div>
    return (
        <>
            <div className="home-container">
                <Navbar />

                {test ? (
                    <div >
                        <div className="banner-container">
                            <h1 className="text-banner">{test.name_questionary}</h1>
                        </div>
                        <div className="info-test">
                            <h1 className="test-title">Informacion del Test</h1>
                            <p className="test-info">
                                {test.description}
                            </p>
                        </div>
                        <div className="test-container">
                            {test.questions && (
                                <div className="contenedor-preguntas">
                                    {test.questions.map((question: Question) => (
                                        <>
                                            <h3 key={question.id_question}>{question.question}</h3>
                                            

                                            <ul>
                                                {question.options.map((op: Option) => (
                                                    <label key={op.id_option} className="label-questionary" htmlFor={`${op.id_option}`}>
                                                        <input
                                                            className="option-questionary"
                                                            type="radio"
                                                            name={`question-${question.id_question}`} // importante cambiar esto
                                                            id={`${op.id_option}`}
                                                            value={op.descriptionOp}
                                                        />
                                                        {op.descriptionOp}
                                                    </label>
                                                ))}
                                            </ul>
                                        </>
                                    ))}
                                </div>
                            )}


                            <div className="grid-item2">
                                <img src="/snellen_2daOpcion.svg" alt="" c/>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Cargando test...</p>
                )}
                 
            </div>


        </>
    );
}