// src/services/predictService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_1;

export const postPrediction = async (payload) => {
  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error hit API prediction:", error);
    throw error;
  }
};


export const validatePrediction = async (payload) => {
  try {
    // Menambahkan '/validate' ke base URL
    const response = await axios.post(`${API_URL}validate`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error hit API validation:", error);
    throw error;
  }
};

export const getAllPredictions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all predictions:", error);
    throw error;
  }
};

export const getPredictionByNim = async (nim) => {
  try {
    // Panggil endpoint GET /prediction/{nim}
    const response = await axios.get(`${API_URL}${nim}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching prediction for NIM ${nim}:`, error);
    throw error;
  }
};


// ========== Tambahan untuk Bulk Prediction ==========
export const postBulkPrediction = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // 'file' harus sama dengan parameter UploadFile di backend

    const response = await axios.post(`${API_URL}bulk`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error hit API bulk prediction:", error);
    throw error;
  }
};