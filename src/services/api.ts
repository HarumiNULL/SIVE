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

export const getOneOptical = async(id:number) => {
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


