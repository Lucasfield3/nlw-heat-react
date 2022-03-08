import axios  from "axios";

export const api = axios.create({
    baseURL:"https://nlw-heat-back-end.herokuapp.com/",
})
