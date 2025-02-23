import statusService from "@/services/statusService";
import type { Status } from "@/types/status";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useStatusStore = defineStore('status', () => {
    const statuses: Ref<Status[]> = ref([]);

    const getAllStatuses = async() => {
        statuses.value = [];
        
        statuses.value = await statusService().getAll();
    }

    return {
        statuses,
        getAllStatuses
    }
})