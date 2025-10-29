import axios from "axios";
/*import { Axios } from "axios";*/
export const BASE_URL = "http://127.0.0.1:8000";

// Configura la URL de tu backend (puede estar en otro servidor)
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/"
});


export interface User {
  id: number;
  email: string;
  role_id: number;
  first_name: string;
  last_name: string;
  state: number;
}

export interface QuestionaryItem {
  id_questionary: number;
  name_questionary: string;
  description: string;

}
export interface Option {
  id_option: number;
  question_id: number;
  descriptionOp: string;
}

// Pregunta dentro del cuestionario
export interface Question {
  id_question: number;
  question: string;
  image_question: string;
  options: Option[]; // lista de opciones
}

// Cuestionario completo
export interface Questionary {
  id_questionary: number;
  name_questionary: string;
  description: string;
  questions: Question[]; // lista de preguntas
}

export interface TopViewedOptical{
  nameOp: string;
  view: number;
}

export interface OpticalByCity {
  city_name: string;
  count: number;
}

export interface QuestionaryItem {
  id_questionary: number;
  name_questionary: string;
  description: string;

}
export interface Option {
  id_option: number;
  question_id: number;
  descriptionOp: string;
}

// Pregunta dentro del cuestionario
export interface Question {
  id_question: number;
  question: string;
  image_question: string;
  options: Option[]; // lista de opciones
}

// Cuestionario completo
export interface Questionary {
  id_questionary: number;
  name_questionary: string;
  description: string;
  questions: Question[]; // lista de preguntas
}

export interface TopViewedOptical{
  nameOp: string;
  view: number;
}

export interface OpticalByCity {
  city_name: string;
  count: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  role: number;
}
export interface Schedule {
  id_schedule: number;
  id_day: number;
  id_hour_aper: number;
  id_hour_close: number;
  id_optical: number;
}



API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers!.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// Función para registrar usuario
export const registerUser = async (data: any): Promise<AuthResponse> => {
  try {
    const res = await API.post<AuthResponse>("register/", data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.non_field_errors || JSON.stringify(error.response?.data) || error.message);
  }
};

export const loginUser = async (data: any): Promise<AuthResponse> => {
  try {
    const res = await API.post<AuthResponse>("login/", data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || JSON.stringify(error.response?.data) || error.message);
  }
};

export const questionary = async (data: any): Promise<AuthResponse> => {
  try {
    const res = await API.post<AuthResponse>("questionary/", data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || JSON.stringify(error.response?.data) || error.message);
  }
};
export const logoutUser = async () => {
  await API.post<AuthResponse>("logout/", null);
};

export const getOneOptical = async (id: number) => {
  const res = await API.get(`optical/${id}/`);
  return res.data;
}

export const deleteOptical = async (id: number) => {
  try {
    const res = await API.delete(`optical/${id}/`);
    return res.data;
  } catch (error: any) {
    console.error("Error eliminando óptica:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};


export const getQuestionaries = async () => {
  try {
    const res = await API.get<QuestionaryItem[]>("questionary/");
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
      JSON.stringify(error.response?.data) ||
      error.message
    );
  }
}


export const getOneQuestionary = async (id:number): Promise<Questionary> => {
  const res = await API.get<Questionary>(`questionary/${id}/`);
  return res.data;
};


export const getAllOpticals = async () => {
  try {
    const res = await API.get("optical/");
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener ópticas:", error);
    throw new Error(error.response?.data?.detail || "Error al obtener ópticas");
  }
};

export const getCities = async () => {
  try {
    const res = await API.get(`city/`);
    console.log("📡 Datos recibidos de cities:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener ciudades:", error);
    throw new Error(error.response?.data?.error || "Error al obtener ciudades");
  }
};

export const getDays = async () => {
  try {
    const res = await API.get(`days/`);
    console.log("📡 Datos recibidos de days:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error en getDays:", error);
    return null;
  }
};

export const getHours = async () => {
  try {
    const res = await API.get(`hours/`);
    console.log("📡 Datos recibidos de hours:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error en getHours:", error);
    return [];
  }
};

/*
export const createOptical = async (data: any) => {
  try {
    const response = await API.post(`optical/`, data);


console.log("✅ Óptica creada:", response.data);
return response.data;
  } catch (error) {
  console.error("❌ Error creando óptica:", error);
  throw error;
}
};

export const getTopViewedOpticals = async (): Promise<TopViewedOptical[]> => {
  try {
    const res = await API.get<TopViewedOptical[]>(`optical/top-viewed/`);
    if (res.status === 200) {
      return (await res).data

    } else {
      throw new Error(`Error: Received status code ${res.status}`);
    }
  } catch (error) {
    console.error("Error al obtener ópticas más vistas:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};
export const getOpticalsByCity = async (): Promise<OpticalByCity[]> => {
  try {
    const res = await API.get<OpticalByCity[]>(`optical/by-city/`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener ópticas por ciudad:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const getUsers = async () => {
  try {
    const res = await API.get("users/");
    console.log("📡 Datos recibidos de usuarios:", res.data);
    return res.data; // Se asume que el backend devuelve un array de usuarios
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error);
    throw new Error(
      error.response?.data?.error || "Error al obtener usuarios del servidor"
    );
  }
};

// 2. ELIMINAR USUARIO (borrado lógico)
export const deleteUser = async (userId: number) => {
  try {
    const response = await API.patch(`users/${userId}/`, {
      state: 4, // 👈 Estado 'Eliminado'
    });
    console.log(`🗑️ Usuario ${userId} marcado como eliminado.`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error al eliminar usuario ${userId}:`, error);
    throw new Error(
      error.response?.data?.error || "No se pudo eliminar el usuario."
    );
  }
};

// 3. BLOQUEAR / DESBLOQUEAR USUARIO
export const toggleBlockUser = async (userId: number, newState: number) => {
  try {
    // 🔥 CORREGIDO: ahora usa backticks (``) para interpolar la variable
    const response = await API.patch(`users/${userId}/`, { state: newState });
    console.log(
      `🔄 Estado de usuario ${userId} cambiado a ${newState === 2 ? "Bloqueado" : "Activo"}`
    );
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error al cambiar estado de usuario ${userId}:`, error);
    throw new Error(
      error.response?.data?.error || "No se pudo cambiar el estado del usuario."
    );
  }
};

export const generarReporteOpticas = async (): Promise<Blob> => {
  try {
    const response = await API.get(`/optical/report`, {
      responseType: "blob", // importante para manejar el PDF como archivo binario
    });
    return response.data; // devuelve el blob del PDF
  } catch (error) {
    console.error("Error al generar el reporte:", error);

export const getTopViewedOpticals = async (): Promise<TopViewedOptical[]> => {
  try {
    const res = await API.get<TopViewedOptical[]>(`optical/top-viewed/`);
    if (res.status === 200) {
      return (await res).data

    } else {
      throw new Error(`Error: Received status code ${res.status}`);
    }
  } catch (error) {
    console.error("Error al obtener ópticas más vistas:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};
export const getOpticalsByCity = async (): Promise<OpticalByCity[]> => {
  try {
    const res = await API.get<OpticalByCity[]>(`optical/by-city/`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener ópticas por ciudad:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const getUsers = async () => {
  try {
    const res = await API.get("users/");
    console.log("📡 Datos recibidos de usuarios:", res.data);
    return res.data; // Se asume que el backend devuelve un array de usuarios
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error);
    throw new Error(
      error.response?.data?.error || "Error al obtener usuarios del servidor"
    );
  }
};

// 2. ELIMINAR USUARIO (borrado lógico)
export const deleteUser = async (userId: number) => {
  try {
    const response = await API.patch(`users/${userId}/`, {
      state: 4, // 👈 Estado 'Eliminado'
    });
    console.log(`🗑️ Usuario ${userId} marcado como eliminado.`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error al eliminar usuario ${userId}:`, error);
    throw new Error(
      error.response?.data?.error || "No se pudo eliminar el usuario."
    );
  }
};

// 3. BLOQUEAR / DESBLOQUEAR USUARIO
export const toggleBlockUser = async (userId: number, newState: number) => {
  try {
    // 🔥 CORREGIDO: ahora usa backticks (``) para interpolar la variable
    const response = await API.patch(`users/${userId}/`, { state: newState });
    console.log(
      `🔄 Estado de usuario ${userId} cambiado a ${newState === 2 ? "Bloqueado" : "Activo"}`
    );
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error al cambiar estado de usuario ${userId}:`, error);
    throw new Error(
      error.response?.data?.error || "No se pudo cambiar el estado del usuario."
    );
  }
};
*/
export const createOptical = async (data: any) => {
  try {
    const res = await API.post(`optical/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error creando óptica:", error.response?.data || error);
    throw error;
  }
};

export const getTopViewedOpticals = async (): Promise<TopViewedOptical[]> => {
  try {
    const res = await API.get<TopViewedOptical[]>(`optical/top-viewed/`);
    if (res.status === 200) {
      return (await res).data

    } else {
      throw new Error(`Error: Received status code ${res.status}`);
    }
  } catch (error) {
    console.error("Error al obtener ópticas más vistas:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};
export const getOpticalsByCity = async (): Promise<OpticalByCity[]> => {
  try {
    const res = await API.get<OpticalByCity[]>(`optical/by-city/`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener ópticas por ciudad:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const getUsers = async () => {
    try {
        const res = await API.get(`users/`);
        console.log("📡 Datos recibidos de usuarios:", res.data);
        return res.data; // Asume que res.data es el array de usuarios
    } catch (error) { // <--- CORREGIDO: Se elimina el ': any' si no usas TypeScript
        console.error("Error al obtener usuarios:", error);
        // Lanzar un error más limpio para el componente
        throw new Error(error.response?.data?.error || "Error al obtener usuarios del servidor");
    }
}

// 2. ELIMINAR USUARIO
export const deleteUser = async (userId: number) => { // <--- Función necesaria
    try {
        await API.delete(`users/${userId}/`);
        return true; // Éxito en la eliminación
    } catch (error) {
        console.error(`Error al eliminar usuario ${userId}:`, error);
        throw new Error("No se pudo eliminar el usuario.");
    }
}

// 3. BLOQUEAR/DESBLOQUEAR USUARIO
export const toggleBlockUser = async (userId: number, isBlocked: boolean) => { // <--- Función necesaria
    try {
        // Asumiendo que tu endpoint es /users/{id}/block y acepta PUT/PATCH con el estado
        const response = await API.put(`users/${userId}/block/`, { is_blocked: isBlocked });

        // Retorna el usuario actualizado (idealmente)
        return response.data;
    } catch (error) {
        console.error(`Error al cambiar estado de bloqueo ${userId}:`, error);
        throw new Error("No se pudo cambiar el estado de bloqueo.");
    }
}
// Obtener catálogo de una óptica
export async function getAllCatalogues() {
  const response = await API.get("/catalogue/");
  return response.data;
}

export async function getAllProducts() {
  const response = await API.get("product/");
  return response.data;
}

/*
export const createOptical = async (formData: FormData, token: string) => {
  try {
    const res = await axios.post(`http://127.0.0.1:8000/api/optical/`, formData, {
      headers: {
        Authorization: `Token ${token}`,
         "Content-Type": "multipart/form-data" },
    });
    console.log("exitoo")
    return res.data;
  } catch (error) {
    console.error("❌ Error creando óptica:", error);
    throw error;
  }
};*/

export const createSchedule = async (data: any) => {
  try {
    const response = await API.post("/schedules/", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creando schedule:", error.response?.data || error);
    throw new Error("Error al crear el horario");
  }
};

export const getScheduleByOptical = async (id_optical: number) => {
  try {
    const response = await API.get(`/schedules/?optical=${id_optical}`);
    console.log("📅 Horarios recibidos para óptica", id_optical, ":", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo horario:", error.response?.data || error);
    throw new Error("Error al obtener el horario");
  }
};



export const getAllSchedules = async () => {
  try {
    const response = await API.get("/schedules/");
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo schedules:", error.response?.data || error);
    throw new Error("No se pudieron obtener los horarios");
  }
};

export const addProductToCatalogue = async (opticalId: number, productId: number) => {
  return fetch(`/api/catalogue/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ optical: opticalId, nameP: productId }),
  });
};

// 📦 Crear un nuevo producto en el catálogo
export async function createCatalogue(data: FormData) {
  const response = await API.post("/catalogue/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// 📊 Obtener las vistas de una óptica específica
export const getViewsByOpticalId = async (opticalId: number) => {
  try {
    const res = await API.get(`/optical/${opticalId}/views`);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener las vistas por óptica:", error);
    throw new Error(error.response?.data?.message || "Error de conexión");
  }
};


export default API;
