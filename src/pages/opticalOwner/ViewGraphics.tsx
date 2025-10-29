import Navbar from "../../components/Navbar";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import API from "../../services/api";
import styles from "./viewGraphics.module.css";
import { useAuth } from "../../components/AuthContext"; // 👈 usa tu hook

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Vistas de tu óptica" },
  },
};

type TopViewedOptical = {
  idOp: number;
  nameOp: string;
  view: number;
};

export default function ViewGraphics() {
  const { opticalId, loading: authLoading } = useAuth();
  const [viewsData, setViewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadChartData = async () => {
    setLoading(true);

    // Evitar aumentar la vista varias veces
    const viewedKey = `viewed_${opticalId}`;
    if (!sessionStorage.getItem(viewedKey)) {
      sessionStorage.setItem(viewedKey, "true");
      // Si tu backend aumenta automáticamente al GET, esto asegura que solo se haga una vez
    }

    try {
      const res = await API.get(`/optical/${opticalId}`);
      const opticalViews: TopViewedOptical[] = [{
        idOp: res.data.id_optical,
        nameOp: res.data.nameOp,
        view: res.data.view,
      }];

      const formattedViewsData = {
        labels: opticalViews.map(v => v.nameOp),
        datasets: [
          {
            label: "Total de Vistas",
            data: opticalViews.map(v => v.view),
            backgroundColor: opticalViews.map(() => `hsl(280, 70%, 60%)`), // moradito
            borderColor: "rgba(0,0,0,0.1)",
            borderWidth: 1,
          },
        ],
      };

      setViewsData(formattedViewsData);
    } catch (error) {
      console.error("Error cargando datos de gráficas:", error);
      setViewsData(null);
    } finally {
      setLoading(false);
    }
  };

  loadChartData();
}, [opticalId]);


  if (authLoading || loading) return <div>Cargando gráficas...</div>;
  if (!opticalId) return <div>No se encontró el ID de la óptica.</div>;

  return (
    <>
      <Navbar />
      <div className={styles.adminContainer}>
        <h1>Visitas a mi Optica</h1>
        <div className={styles.chartsGrid}>
          {viewsData ? (
            <div className={styles.chartContainer}>
              <Bar options={barOptions} data={viewsData} />
            </div>
          ) : (
            <p>No hay vistas registradas para tu óptica.</p>
          )}
        </div>
      </div>
    </>
  );
}
