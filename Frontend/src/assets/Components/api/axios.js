import axios from "axios";


const api = axios.create({
    baseURL:"http://localhost:9937/",
    withCredentials:true
})

export default api;