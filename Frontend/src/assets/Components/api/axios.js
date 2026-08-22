import axios from "axios";


const api = axios.create({
    // baseURL:"https://quickdrop-backend-zn0l.onrender.com/",
    baseURL:"http://localhost:9937/",
    withCredentials:true
})

export default api;