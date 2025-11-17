import API from '../services/api';

// Obtener ópticas pendientes
export const getPendingOptics = async () => {
  try {
    const res = await API.get("admin/pending-owners/");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error cargando ópticas pendientes:", error);
    throw new Error(error.response?.data?.error || "Error al cargar ópticas pendientes");
  }
};

// Aprobar óptica
export const approveOptic = async (opticId: number) => {
  try {
    const res = await API.post(`admin/approve-owner/${opticId}/`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error aprobando óptica:", error);
    throw new Error(error.response?.data?.error || "Error al aprobar usuario dueño");
  }
};

// Rechazar óptica
export const rejectOptic = async (opticId: number) => {
  try {
    const res = await API.post(`admin/reject-owner/${opticId}/`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error rechazando óptica:", error);
    throw new Error(error.response?.data?.error || "Error al rechazar óptica");
  }
};
