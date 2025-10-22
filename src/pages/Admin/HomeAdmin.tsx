import Navbar from "../../components/Navbar"
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { getTopViewedOpticals, getOpticalsByCity, type TopViewedOptical, type OpticalByCity } from "../../services/api"; // Funciones que debes crear
import styles from "./homeAdmin.module.css";

// Opciones para la gráfica de Barras
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Ópticas con más vistas" },
  },
};

// Opciones para la gráfica de Torta
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Distribución de Ópticas por Ciudad" },
  },
};

export default function HomeAdmin() {
  // Nuevos estados para tus datos
  const [viewsData, setViewsData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        // 1. Pides los datos a tu API (ver Paso 3)
        const topViewedApi: TopViewedOptical[] = await getTopViewedOpticals();
        const byCityApi: OpticalByCity[] = await getOpticalsByCity();

        // 2. Transformas los datos de la API al formato que Chart.js necesita
        const formattedViewsData = {
          labels: topViewedApi.map(item => item.nameOp),
          datasets: [{
            label: "Total de Vistas",
            data: topViewedApi.map(item => item.view),
            backgroundColor: [ // Un color por cada ciudad
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ], // Color Púrpura
          }],
        };

        const formattedCityData = {
          labels: byCityApi.map(item => item.city_name),
          datasets: [{
            label: "Nro. de Ópticas",
            data: byCityApi.map(item => item.count),
            backgroundColor: [ // Un color por cada ciudad
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

        // 3. Guardas los datos en el estado
        setViewsData(formattedViewsData);
        setCityData(formattedCityData);

      } catch (error) {
        console.error("Error cargando datos de gráficas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []); // El array vacío [] significa que esto se ejecuta solo 1 vez

  if (loading) {
    return <div>Cargando gráficas...</div>;
  }

  return (
    <>
    <Navbar />
    <div className={styles.adminContainer}>
      <h1>Dashboard de Administrador</h1>
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
    </div>
    </>
  );
}
