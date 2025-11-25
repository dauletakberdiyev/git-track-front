import type { Repository } from "@/types/repository";
import axios from "axios";

export default () => ({
    getAll: async (): Promise<Repository[]> => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/repos`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        );

        return res.data.data;
    },

    updateRepos: async () => {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/repos`, {},
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        )
    },

    updateStatus: async (repoId: number) => {
        const res = await axios.patch(`${import.meta.env.VITE_API_URL}/repos/${repoId}/status`, {},
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        )
    }
})