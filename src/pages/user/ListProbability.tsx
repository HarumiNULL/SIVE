import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./listProbability.module.css";
import { HelpCircle, X } from "lucide-react";

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

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        testName: "Test de Snellen",
        timesTaken: 3,
        probability: 70,
        route: "/test",
        info: "Para mayor información respecto a este Test Visual ingresar a: https://clinicastecnovision.es/wp-content/uploads/2019/05/test-de-landolt.pdf",
      },
      {
        id: 2,
        testName: "Test de Ishihara",
        timesTaken: 2,
        probability: 45,
        route: "/testIshi",
        info: "Para mayor información respecto a este Test Visual ingresar a: ",
      },
    ];
    setResults(mockData);
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.probability_container}>
        {results.map((res) => (
          <div key={res.id} className={styles.probability_card}>
            <div className={styles.probability_content}>
              {/* 🔹 Título con icono al lado */}
              {/* 🔹 Título con icono al lado */}
              <div className={styles.title_row}>
                <h3>
                  {res.testName}
                  <HelpCircle
                    size={20}
                    className={styles.info_icon_inline}
                    onClick={() => setOpenInfo(res)}
                  />
                </h3>
              </div>


              <p className={styles.test_times}>
                Has tomado el test: <strong>{res.timesTaken}</strong> veces
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
                    <div className={styles.chart_text}>{res.probability}%</div>
                  </div>
                </div>

                <div className={styles.probability_info}>
                  <p className={styles.highlight}>
                    Tienes un <strong>{res.probability}%</strong> de
                    probabilidad de tener un problema visual basado en tu último
                    intento.
                  </p>

                  <hr />

                  <p className={styles.recommendation}>
                    Te recomendamos que acudas a un consultorio oftalmológico
                    para recibir atención de un especialista y un diagnóstico
                    confiable.
                  </p>

                  <Link to={res.route} className={styles.test_btn}>
                    Realizar Nuevamente
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

       {/* 🔹 Modal elegante */}
        {openInfo && (
          <div
            className={styles.modal_overlay}
            onClick={() => setOpenInfo(null)}
          >
            <div
              className={styles.modal_content}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.close_btn}
                onClick={() => setOpenInfo(null)}
              >
                <X size={18} />
              </button>

              <h2>{openInfo.testName}</h2>

              <p>
                {openInfo.info.split("https").length > 1 ? (
                  <>
                    {openInfo.info.split("https")[0]}
                    <a
                      href={`https${openInfo.info.split("https")[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https{openInfo.info.split("https")[1]}
                    </a>
                  </>
                ) : (
                  openInfo.info
                )}
              </p>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
