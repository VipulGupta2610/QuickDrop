import axios from "axios";


const api = axios.create({
    baseURL:"https://quickdrop-backend-gkdx.onrender.com/",
    // baseURL:"http://localhost:9937/",
    withCredentials:true
})

export default api;