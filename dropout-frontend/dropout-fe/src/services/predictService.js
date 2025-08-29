// src/services/predictService.js
import axios from "axios";

const API_URL = "http://localhost:8000/prediction/";

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
