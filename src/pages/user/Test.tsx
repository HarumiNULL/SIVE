import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState,  } from "react";
import { useAuth } from "../../components/AuthContext";
import Navbar from "../../components/Navbar";
import { getOneQuestionary, type Questionary, type Option, type Question, BASE_URL, API} from '../../services/api';
import styles from "./test.module.css";

export default function Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {idUser} = useAuth();
  const [test, setTest] = useState<Questionary | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // question_id -> option_id
  const [error, setError] = useState<string | null>(null);
  console.log(idUser)

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
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
  if (!test) return;


  try {
    for (const [questionId, optionId] of Object.entries(answers)) {
      const payload = {
        questionary_id: Number(test.id_questionary), // convertir a número
        question_id: Number(questionId),             // convertir a número
        user_id: Number(idUser),
        answer_id: Number(optionId),                 // convertir a número
      };

      // Aquí usamos Axios correctamente
      const res = await API.post(`${BASE_URL}/api/test/`, payload);
      console.log("Respuesta backend:", res.data);
    }
    alert("Respuestas enviadas correctamente 🎉");
    navigate("/listProb"); // navega a la ruta indicada
  } catch (err: any) {
    console.error("Error del backend:", err.response?.data);
    alert("Ocurrió un error al enviar las respuestas");
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
                {question.image_question && (
                  <img
                    src={`${BASE_URL}${question.image_question}`}
                    alt={`question-${question.id_question}`}
                    className={styles.image_question}
                  />
                )}
                <div className={styles.question_option}>
                  <h5>Selecciona la respuesta que consideres correcta</h5>
                  {question.options.map((op: Option) => (
                    <label key={op.id_option} className={styles.label_questionary}>
                      <input
                      className={styles.option_questionary}
                        type="radio"
                        name={`question-${question.id_question}`}
                        value={op.id_option}
                        onChange={() => handleSelect(question.id_question, op.id_option)}
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
