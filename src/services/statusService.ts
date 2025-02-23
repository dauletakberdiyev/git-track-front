import type { Status } from "@/types/status";
import axios from "axios";

export default () => ({
    getAll: async (): Promise<Status[]> => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/status`, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        );

        return res.data.data;
    }
})