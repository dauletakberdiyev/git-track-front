import type { User } from "@/types/user";
import axios from "axios";

export default () => ({
    getUserInfo: async (): Promise<User> => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, 
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