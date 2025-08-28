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
