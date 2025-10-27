import Navbar from "../../components/Navbar";
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { 
  getTopViewedOpticals, 
  getOpticalsByCity, 
  generarReporteOpticas, // 🔹 Importamos la nueva función
  type TopViewedOptical, 
  type OpticalByCity 
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
  const [downloading, setDownloading] = useState(false); // 🔹 nuevo estado

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const topViewedApi: TopViewedOptical[] = await getTopViewedOpticals();
        const byCityApi: OpticalByCity[] = await getOpticalsByCity();

        const formattedViewsData = {
          labels: topViewedApi.map(item => item.nameOp),
          datasets: [{
            label: "Total de Vistas",
            data: topViewedApi.map(item => item.view),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
          }],
        };

        const formattedCityData = {
          labels: byCityApi.map(item => item.city_name),
          datasets: [{
            label: "Nro. de Ópticas",
            data: byCityApi.map(item => item.count),
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
          }],
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

  // 🔹 Función para manejar la descarga del reporte
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
    return <div>Cargando gráficas...</div>;
  }

  return (
    <>
      <Navbar />
      <div className={styles.adminContainer}>
        <h1>Bienvenido Administrador</h1>

        <div className={styles.chartsGrid}>
          {/* Gráfica 1: Vistas (Barras) */}
          {viewsData && (
            <div className={styles.chartContainer}>
              <Bar options={barOptions} data={viewsData} />
            </div>
          )}

          {/* Gráfica 2: Ciudades (Torta) */}
          {cityData && (
            <div className={styles.chartContainer}>
              <Pie options={pieOptions} data={cityData} />
            </div>
          )}
        </div>

        {/* 🔹 Botón para generar reporte */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={handleGenerarReporte}
          disabled={downloading}
          className={styles.reportButton}
        >
          {downloading ? "⏳ Generando..." : "📄 Reporte Ópticas"}
        </button>
      </div>

      </div>
    </>
  );
}
