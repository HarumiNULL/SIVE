/*import { Link } from "react-router-dom";*/

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getOneQuestionary, Questionary, Option, Question } from '../../services/api';
import styles from "./test.module.css"

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
    if (!test) return <div>Cargando cuestionario...</div>;

    if (error) return <div>{error}</div>
    return (
        <>
            <div className={styles.home_container}>
                <Navbar />

                {test ? (
                    <div >
                        <div className={styles.banner_container}>
                            <h1 className={styles.text_banner}>{test.name_questionary}</h1>
                        </div>
                        <div className={styles.info_test}>
                            <h1 className={styles.test_title}>Informacion del Test</h1>
                            <p className={styles.test_info}>
                                {test.description}
                            </p>
                        </div>
                        <div className={styles.test_container}>
                            {test.questions && (
                                <div className={styles.contenedor_preguntas}>
                                    {test.questions.map((question: Question) => (
                                        <>
                                            <h3 key={question.id_question}>{question.question}</h3>
                                            

                                            <ul>
                                                {question.options.map((op: Option) => (
                                                    <label key={op.id_option} className={styles.label_questionary} htmlFor={`${op.id_option}`}>
                                                        <input
                                                            className={styles.option_questionary}
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


                            <div className={styles.grid_item2}>
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