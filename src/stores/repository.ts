import repositoryService from "@/services/repositoryService";
import type { Repository } from "@/types/repository";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useRepositoryStore = defineStore('repository', () => {
    const repositories: Ref<Repository[]> = ref([]);
    const isLoading = ref(false);

    const getAllRepos = async () => {
        isLoading.value = true;
        try {
            repositories.value = await repositoryService().getAll();
        } finally {
            isLoading.value = false;
        }
    }

    const update = async () => {
        isLoading.value = true;
        try {
            await repositoryService().updateRepos();
            repositories.value = await repositoryService().getAll();
        } finally {
            isLoading.value = false;
        }
    }

    const updateStatus = async (repoId: number) => {
        // Optimistically update the UI first
        const repo = repositories.value.find(r => r.id === repoId);
        if (repo) {
            repo.status = !repo.status;
        }

        try {
            // Then make the API call
            await repositoryService().updateStatus(repoId);
        } catch (error) {
            // If the API call fails, revert the change
            if (repo) {
                repo.status = !repo.status;
            }
            console.error('Failed to update status:', error);
            throw error;
        }
    }

    return {
        repositories,
        isLoading,
        getAllRepos,
        update,
        updateStatus
    }
})