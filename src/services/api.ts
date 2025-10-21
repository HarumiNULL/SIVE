import axios from "axios";
/*import { Axios } from "axios";*/

// Configura la URL de tu backend (puede estar en otro servidor)
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/"
});
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

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
export const logoutUser = async (token: string) => {
  await API.post<AuthResponse>("logout/", null, { headers: { Authorization: `Token ${token}` } });
};

export const getOneOptical = async (id: number) => {
  return axios.get(`http://127.0.0.1:8000/api/optical/${id}/`);
export const getOneOptical = async (id: number) => {
  return axios.get(`http://127.0.0.1:8000/api/optical/${id}/`);
}

export const deleteOptical = async (id: number) => {
  try {
    const res = await axios.delete(`http://127.0.0.1:8000/api/optical/${id}/`);
    return res.data;
  } catch (error: any) {
    console.error("Error eliminando óptica:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
};

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
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/optical/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener ópticas:", error);
    throw new Error(error.response?.data?.detail || "Error al obtener ópticas");
  }
};

export const getCities = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/city/`);
    console.log("📡 Datos recibidos de cities:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener ciudades:", error);
    throw new Error(error.response?.data?.error || "Error al obtener ciudades");
  }
};

export const getDays = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/days/`);
    console.log("📡 Datos recibidos de days:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error en getDays:", error);
    return [];
  }
};

export const getHours = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/hours/`);
    console.log("📡 Datos recibidos de hours:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error en getHours:", error);
    return [];
  }
};

export const createOptical = async (data: any) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(`http://127.0.0.1:8000/api/optical/`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${ token }` : "",
    },
});


console.log("✅ Óptica creada:", response.data);
return response.data;
  } catch (error) {
  console.error("❌ Error creando óptica:", error);
  throw error;
}
};

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