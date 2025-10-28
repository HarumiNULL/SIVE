import Navbar from "../../components/Navbar";
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import {
  getTopViewedOpticals,
  getOpticalsByCity,
  generarReporteOpticas,
  type TopViewedOptical,
  type OpticalByCity,
} from "../../services/api";
import styles from "./homeAdmin.module.css";

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Ópticas con más vistas" },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Distribución de Ópticas por Ciudad" },
  },
};

export default function HomeAdmin() {
  const [viewsData, setViewsData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const topViewedApi: TopViewedOptical[] = await getTopViewedOpticals();
        const byCityApi: OpticalByCity[] = await getOpticalsByCity();

        const formattedViewsData = {
          labels: topViewedApi.map((item) => item.nameOp),
          datasets: [
            {
              label: "Total de Vistas",
              data: topViewedApi.map((item) => item.view),
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
            },
          ],
        };

        const formattedCityData = {
          labels: byCityApi.map((item) => item.city_name),
          datasets: [
            {
              label: "Nro. de Ópticas",
              data: byCityApi.map((item) => item.count),
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };

        setViewsData(formattedViewsData);
        setCityData(formattedCityData);
      } catch (error) {
        console.error("Error cargando datos de gráficas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  const handleGenerarReporte = async () => {
    try {
      setDownloading(true);
      const pdfBlob = await generarReporteOpticas();
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_opticas.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Error al generar el reporte. Revisa la consola para más detalles.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando gráficas...</div>;
  }

  return (
    <>
      <Navbar />
      <div className={styles.adminContainer}>
        <h1 className={styles.title}>Bienvenido Administrador</h1>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3>Ópticas Registradas</h3>
            <p>{cityData?.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0}</p>
          </div>

          <div className={styles.summaryCard}>
            <h3>Óptica Más Popular</h3>
            <p>
              {viewsData?.labels[
                viewsData.datasets[0].data.indexOf(
                  Math.max(...viewsData.datasets[0].data)
                )
              ] || "N/A"}
            </p>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          {/* Gráfica 1: Ópticas con más vistas */}
          {viewsData && (
            <div className={`${styles.chartContainer} ${styles.fadeIn}`}>
              <Bar options={barOptions} data={viewsData} />
              <p className={styles.chartAnalysis}>
                <strong>Análisis:</strong> La óptica con más vistas es{" "}
                <span className={styles.highlight}>
                  {
                    viewsData.labels[
                      viewsData.datasets[0].data.indexOf(
                        Math.max(...viewsData.datasets[0].data)
                      )
                    ]
                  }
                </span>{" "}
                con un total de{" "}
                <span className={styles.highlight}>
                  {Math.max(...viewsData.datasets[0].data)} visitas
                </span>. Esto sugiere que tiene una alta demanda o buena
                visibilidad digital.
              </p>
            </div>
          )}

          {/* Gráfica 2: Distribución por ciudad */}
          {cityData && (
            <div className={`${styles.chartContainer} ${styles.fadeIn}`}>
              <Pie options={pieOptions} data={cityData} />
              <p className={styles.chartAnalysis}>
                <strong>Análisis:</strong> La ciudad con más ópticas registradas
                es{" "}
                <span className={styles.highlight}>
                  {
                    cityData.labels[
                      cityData.datasets[0].data.indexOf(
                        Math.max(...cityData.datasets[0].data)
                      )
                    ]
                  }
                </span>{" "}
                con{" "}
                <span className={styles.highlight}>
                  {Math.max(...cityData.datasets[0].data)} establecimientos
                </span>, mostrando una concentración notable del sector óptico en
                esa zona.
              </p>
            </div>
          )}
        </div>

        {/* Botón de reporte */}
        <div className={styles.buttonContainer}>
          <button
            onClick={handleGenerarReporte}
            disabled={downloading}
            className={styles.reportButton}
          >
            {downloading ? "⏳ Generando..." : "📄 Generar Reporte"}
          </button>
        </div>
      </div>
    </>
  );
}
