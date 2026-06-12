import axios from 'axios'

const API = axios.create({
  baseURL: 'https://diet-tracker-d22u.onrender.com/api'
})

// har request mein automatically token lagao
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

export default API