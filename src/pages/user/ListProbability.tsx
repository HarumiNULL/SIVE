import { Link} from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./listProbability.module.css"


interface ProbabilityResult {
  id: number;
  testName: string;
  timesTaken: number;
  probability: number; 
  route: string;
}

export default function ListProbability() {
  const [results, setResults] = useState<ProbabilityResult[]>([]);

  useEffect(() => {
  //Aquí va la API miestras con datos provicionales
    const mockData = [
      {
        id: 1,
        testName: "Test de Snellen",
        timesTaken: 3,
        probability: 70,
        route:"/test"
      },
      {
        id: 2,
        testName: "Test de Ishihara",
        timesTaken: 2,
        probability: 45,
        route: "/testIshi",
      },
    ];
    setResults(mockData);
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.probability_container}>
        <h2>Test que has tomado</h2>

        {results.map((res) => (
          <div key={res.id} className={styles.probability_card}>
            <div className={styles.probability_content}>
              <h3>{res.testName}</h3>
              <p className={styles.test_times}>
                Haz tomado el test: <strong>{res.timesTaken}</strong> veces
              </p>

              <div className={styles.probability_body}>
                <div className={styles.chart_section}>
                  <div className={styles.chart_box}>
                    <Pie
                      data={{
                        labels: ["Probabilidad", "Resto"],
                        datasets: [
                          {
                            data: [res.probability, 100 - res.probability],
                            backgroundColor: ["#8b5cf6", "#f3e8ff"],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        plugins: { legend: { display: false } },
                        cutout: "75%",
                      }}
                    />
                    <div className={styles.chart_text}>{res.probability} %</div>
                  </div>
                </div>

                <div className={styles.probability_info}>
                  <p className={styles.highlight}>
                    Tienes un{" "}
                    <strong>{res.probability} %</strong> de probabilidad de tener
                    un problema visual basado en tu último intento.
                  </p>

                  <hr />

                  <p className={styles.recommendation}>
                    Te recomendamos que te dirijas a un consultorio
                    oftalmológico para recibir atención de un especialista y un
                    diagnóstico 100% seguro.
                  </p>

                  <Link to={res.route} className={styles.test_btn}>
                    Realizar Nuevamente
                  </Link>

                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </>
  );
}
