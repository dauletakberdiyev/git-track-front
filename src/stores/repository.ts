import repositoryService from "@/services/repositoryService";
import type { Repository } from "@/types/repository";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useRepositoryStore = defineStore('repository', () => {
    const repositories: Ref<Repository[]> = ref([]);

    const getAllRepos = async() => {
        repositories.value = [];
        
        repositories.value = await repositoryService().getAll();
    }
    
    const update = async() => {
        repositories.value = [];
        
        await repositoryService().updateRepos();

        repositories.value = await repositoryService().getAll();
    }

    return {
        repositories,
        getAllRepos,
        update
    }
})