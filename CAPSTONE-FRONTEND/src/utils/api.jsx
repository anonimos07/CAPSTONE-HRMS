import React, { axios } from "react";

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export default api;