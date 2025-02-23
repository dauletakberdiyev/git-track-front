import type { Task, createTask, updateTask } from "@/types/task";
import axios from "axios";

export default () => ({
    getAll: async (repoId: number): Promise<Task[]> => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/task/repo`, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                params: {
                    repository_id: repoId
                }
            }
        );

        return res.data.data;
    },

    getById: async (taskId: number): Promise<Task> => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/task/${taskId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            return res.data.data;
        }  
        catch (error) {
            console.log(error);
            throw new Error('Error fetching task');
        }
    },

    saveTask: async (task: createTask) => {
        try { 
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/task`, 
                {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    user_id: task.userId,
                    repository_id: task.repositoryId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )
            
            if (res.status === 201) {
                return true;
            }
            return false;
        } 
        catch (error) {
            console.log(error);
            return false;
        }
    },

    updateTaskStatus: async (taskId: number, statusId: number) => {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/task/${taskId}/status`,
            {
                status: statusId
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        )

        return true;
    },

    updateTask: async (task: updateTask) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/task/${task.id}`,
                {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    user_id: task.userId,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (res.status === 200) {
                return true;
            }
            return false;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    },
})