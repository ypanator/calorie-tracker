import axiosInstance from "../axios-instance.ts";
import { WorkWithMinDelay } from "../utils.tsx";
import { useToastHelper } from "./useToastHelper.tsx";

export default function useRequestHelper(endpoint: string, payload: object, successMsg: string, errorMsg: string) {
const { successToast, errorToast } = useToastHelper();

return async function() {
    try {
        const result = await WorkWithMinDelay(axiosInstance.post(endpoint, payload));
      
        if (result.status >= 400) {
        	const msg = result.data.msg ?? result.data;
            errorToast(msg);
            console.error(msg);
        } else {
            successToast(successMsg);
        }
    } catch (err) {
        errorToast(errorMsg);
        console.error(err);
	}
}}