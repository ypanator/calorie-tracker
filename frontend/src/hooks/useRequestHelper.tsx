import axiosInstance from "../axios-instance.ts";
import { WorkWithMinDelay } from "../utils.tsx";
import { useToastHelper } from "./useToastHelper.tsx";

export default function useRequestHelper() {
    const { successToast, errorToast } = useToastHelper();

    return async (method: "get" | "post", endpoint: string, payload: Record<string, any>, successMsg: string) => {
        try {
            let response;

            if (method === "post") {
                response = await WorkWithMinDelay(axiosInstance.post(endpoint, payload));
            } else {
                response = await WorkWithMinDelay(axiosInstance.get(endpoint, { params: payload }));
            }            if (response.status >= 400) {
                const errorMessage = response.data?.message || response.data?.msg || response.data || "An error occurred";
                errorToast(errorMessage);
                console.error(errorMessage);
                
                if (response.status === 401) {
                    // Handle unauthorized access (invalid/expired token)
                    localStorage.removeItem('token');
                    delete axiosInstance.defaults.headers.common['Authorization'];
                    window.location.href = '/auth';
                }
                
                throw new Error(errorMessage);
            }

            successToast(successMsg);
            // Return unwrapped data from the response
            return response.data?.data || response.data;        } catch (err: any) {
            // If it's an axios error with a response, use that error message
            if (err.response?.data) {
                const errorMessage = err.response.data.message || err.response.data.msg || "An error occurred";
                errorToast(errorMessage);
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
            // Otherwise it's a network/connection error
            const errorMessage = "Could not connect to server. Please try again later.";
            errorToast(errorMessage);
            console.error(err);
            throw err;
        }
    }
}