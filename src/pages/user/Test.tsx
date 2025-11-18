import { useParams, useNavigate } from "react-router-dom";
import React,  { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import Navbar from "../../components/Navbar";
import {
  getOneQuestionary,
  type Questionary,
  type Option,
  type Question,
  BASE_URL,
  API,
} from "../../services/api";
import styles from "./test.module.css";
import Swal from "sweetalert2";

// Importa las imágenes desde src/assets
// Variables apuntando a la ruta en public
const fila1 = "/fila1.png";
const fila2 = "/fila2.png";
const fila3 = "/fila3.png";
const fila4 = "/fila4.png";
const fila5 = "/fila5.png";
const fila6 = "/fila6.png";
const fila7 = "/fila7.png";


export default function Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { idUser } = useAuth();
  const [test, setTest] = useState<Questionary | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // question_id -> option_id
  const [error, setError] = useState<string | null>(null);

  console.log(idUser);

  // Mapeo de imágenes para cada pregunta
  const questionImages: Record<number, string> = {
    1: fila1,
    2: fila2,
    3: fila3,
    4: fila4,
    5: fila5,
    6: fila6,
    7: fila7,
  };

  useEffect(() => {
    if (id) {
      getOneQuestionary(Number(id))
        .then((res) => setTest(res))
        .catch(() => setError("Error al obtener los datos"));
    } else {
      setError("Hubo un error al obtener el test");
    }
  }, [id]);

  const handleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!test) return;

    try {
      for (const [questionId, optionId] of Object.entries(answers)) {
        const payload = {
          questionary_id: Number(test.id_questionary),
          question_id: Number(questionId),
          user_id: Number(idUser),
          answer_id: Number(optionId),
        };

        await API.post(`${BASE_URL}/api/test/`, payload);
      }

      await Swal.fire({
        icon: "success",
        title: "Respuestas enviadas",
        text: "Tu test ha sido registrado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/listProb");
    } catch (err: any) {
      console.error("Error del backend:", err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron enviar tus respuestas. Intenta nuevamente.",
      });
    }
  };

  if (!test) return <div>Cargando cuestionario...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.home_container}>
      <Navbar />
      <div className={styles.general_container}>
        <div className={styles.banner_container}>
          <h1 className={styles.text_banner}>{test.name_questionary}</h1>
        </div>
        <div className={styles.info_test}>
          <h1 className={styles.test_title}>Información del Test</h1>
          <p className={styles.test_info}>{test.description}</p>
        </div>

        {test.questions && (
          <div className={styles.contenedor_preguntas}>
            {test.questions.map((question: Question) => (
              <div key={question.id_question} className={styles.div_question}>
                <h3 className={styles.question}>{question.question}</h3>

                {/* Imagen según pregunta */}
                {questionImages[question.id_question] && (
                  <img
                    src={questionImages[question.id_question]}
                    alt={`question-${question.id_question}`}
                    className={styles.image_question}
                  />
                )}

                <div className={styles.question_option}>
                  <h5>Selecciona la respuesta que consideres correcta</h5>
                  {question.options.map((op: Option) => (
                    <label
                      key={op.id_option}
                      className={styles.label_questionary}
                    >
                      <input
                        className={styles.option_questionary}
                        type="radio"
                        name={`question-${question.id_question}`}
                        value={op.id_option}
                        onChange={() =>
                          handleSelect(question.id_question, op.id_option)
                        }
                        checked={answers[question.id_question] === op.id_option}
                      />
                      {op.descriptionOp}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleSubmit} className={styles.submit_button}>
          Enviar respuestas
        </button>
      </div>
    </div>
  );
}
