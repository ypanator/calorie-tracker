import axiosInstance from "../axios-instance.ts";
import { WorkWithMinDelay } from "../utils.tsx";
import { useToastHelper } from "./useToastHelper.tsx";

export default function useRequestHelper() {
    const { successToast, errorToast } = useToastHelper();

    return async (method: "get" | "post", endpoint: string, payload: Record<string, any>, successMsg: string) => {

        try {
        let result;

        if (method === "post") {
            result = await WorkWithMinDelay(axiosInstance.post(endpoint, payload));
        } else {
            result = await WorkWithMinDelay(axiosInstance.get(endpoint, { params: payload }));
        }

        if (result.status >= 400) {
            const msg = result.data.msg ?? result.data;
            errorToast(msg);
            console.error(msg);
            if (result.status >= 500) {
                throw new Error("api call failed " + msg);
            }
        } else {
            successToast(successMsg);
        }
        return result;

        } catch (err) {
            errorToast("Could not connect to server. Please try again later.");
            console.error(err);
            throw err;
        }
    }
}