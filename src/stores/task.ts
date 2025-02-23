import taskService from "@/services/taskService";
import type { Task, updateTask } from "@/types/task";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useTaskStore = defineStore('task', () => {
    const tasks: Ref<Task[]> = ref([]);
    const task: Ref<Task | null> = ref(null);

    const getAllTasksByRepo = async(repoId: number) => {
        tasks.value = [];
        
        tasks.value = await taskService().getAll(repoId);
    }

    const updateTaskStatus = async (taskId: number, statusId: number) => {
        await taskService().updateTaskStatus(taskId, statusId);
    }

    const getTaskById = async (taskId: number) => {
        task.value = null;

        task.value = await taskService().getById(taskId);
    }

    const updateTask = async (task: updateTask) => {
        await taskService().updateTask(task);
    }

    return {
        tasks,
        task,
        getAllTasksByRepo,
        updateTaskStatus,
        getTaskById,
        updateTask
    }
})