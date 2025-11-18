
import React,  { useEffect, useState, } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Pie } from "react-chartjs-2";
import { getTestsByUserAndQuestionary, type Test } from "../../services/api"; // importar funciones de api.ts
import styles from "./listProbability.module.css";
import "chart.js/auto";
import InfoModal from "../../components/InfoModal";
import { useAuth } from "../../components/AuthContext";
import { HelpCircle } from "lucide-react";
/*import Test from "./Test";*/

interface ProbabilityResult {
  id: number;
  testName: string;
  timesTaken: number;
  probability: number;
  route: string;
  info: string;
}

export default function ListProbability() {
  const [results, setResults] = useState<ProbabilityResult[]>([]);
  const [openInfo, setOpenInfo] = useState<ProbabilityResult | null>(null);
  const {idUser} = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const questionaryIds = [1, 2]; // Ishihara=1, Snellen=2
        const allResults: ProbabilityResult[] = [];

        for (const qId of questionaryIds) {
          const tests = await getTestsByUserAndQuestionary(qId, idUser);
          if (tests.length === 0) continue;

          //console.log("Tests recibidos del backend:", tests);

          // Agrupar por fecha
          const groupedByDate: { [date: string]: Test[] } = {};
          tests.forEach((t) => {
            if (!groupedByDate[t.date_test]) groupedByDate[t.date_test] = [];
            groupedByDate[t.date_test].push(t);
          });

          // Tomar la fecha más reciente
          const lastDate = Object.keys(groupedByDate).sort().reverse()[0];
          const testsOfLastDate = groupedByDate[lastDate];

          // Sumar todos los answers de esa fecha
          // ✅ Si cada test tiene un "puntaje total" (no respuestas individuales)
          const averageValue = testsOfLastDate.reduce(
            (sum, t) => sum + (typeof t.answer === "number" ? t.answer : 0),
            0
          ) / testsOfLastDate.length;

          // 🔹 Define el máximo esperado de ese test
          const maxScore = 35; // ejemplo: si Snellen tiene 7 preguntas de 5 puntos cada una
          const probability = Math.min(Math.round((averageValue / maxScore) * 100), 100);


          allResults.push({
            id: qId,
            testName: qId === 1 ? "Test de Ishihara" : "Test de Snellen",
            timesTaken: testsOfLastDate.length,
            probability,
            route: qId === 1 ? "/testIshi" : "/test",
            info:
              qId === 1
                ? "https://apidspace.cordillera.edu.ec/server/api/core/bitstreams/64ee2017-b3b6-4e8f-af34-dc003039ad10/content"
                : "https://clinicastecnovision.es/wp-content/uploads/2019/05/test-de-landolt.pdf",
          });
        }

        setResults(allResults);
      } catch (err) {
        console.error("Error cargando resultados:", err);
      }
    };

    fetchResults();
  }, []);
  return (
    <>
      <Navbar />
      <div className={styles.probability_container}>
        {results.map((res) => (
          <div key={res.id} className={styles.probability_card}>
            <div className={styles.probability_content}>
              <div className={styles.title_row}>
                <h3>
                  {res.testName}
                  <HelpCircle size={20} className={styles.info_icon_inline} onClick={() => setOpenInfo(res)} />
                </h3>
              </div>

              <p className={styles.test_times}>
                Has tomado el test: <strong>{res.timesTaken / 7}</strong> veces
              </p>

              <div className={styles.probability_body}>
                <div className={styles.chart_section}>
                  <div className={styles.chart_box}>
                    <Pie
                      data={{
                        labels: ["Agudeza visual", "perdida de vision"],
                        datasets: [
                          {
                            data: [100 - res.probability, res.probability],
                            backgroundColor: ["#8b5cf6", "#f3e8ff"],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{ plugins: { legend: { display: false } }, cutout: "75%" }}
                    />
                    <div className={styles.chart_text}>{100 - res.probability}% </div>
                  </div>
                </div>

                <div className={styles.probability_info}>
                  <p className={styles.highlight}>
                    Tu agudez visual esta en un <strong>{100 - res.probability}%</strong>, por tanto tienes un  <strong>{res.probability}%</strong> probabilidad de tener un problema visual basado en tu último intento.
                  </p>
                  <hr />
                  <p className={styles.recommendation}>
                    Te recomendamos acudir a un consultorio oftalmológico para recibir atención de un especialista y un diagnóstico confiable.
                  </p>
                  <Link to="/listTest" className={styles.test_btn}>
                    Realizar Nuevamente
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* 🔹 Modal reutilizable */}
        <InfoModal
          isOpen={!!openInfo}
          title={openInfo?.testName || ""}
          content={openInfo?.info || ""}
          onClose={() => setOpenInfo(null)}
        />
      </div>
    </>
  );
}
