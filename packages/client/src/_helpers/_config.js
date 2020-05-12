import Axios from "axios"
import Cookies from 'js-cookie';
import { responseInterceptor as i } from "~/_helpers";

const API_PATH = process.env.REACT_APP_API_URL

const api = (isPrivate = false) => {
    const instance = Axios.create({
        baseURL: API_PATH,
        timeout: 10000,
    })

    // Add a request interceptor
    instance.interceptors.request.use(
        (config) => {
            // Do something before request is sent
            if (isPrivate) config.headers.Authorization = `Bearer ${Cookies.get("token")}`
            return config;
        },
        (error) => {
            // Do something with request error
            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    instance.interceptors.response.use(
        async (response) => {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return await i.handleResponse(response);
        },
        (error) => {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            return Promise.reject(i.handleErrorResponse(error));
        }
    );

    return instance
};

export default {
    api,
    API_PATH,
}