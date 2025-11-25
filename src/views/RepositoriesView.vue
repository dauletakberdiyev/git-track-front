<script setup lang="ts">
import { useRepositoryStore } from '@/stores/repository';
import { computed, onMounted } from 'vue';

const repoStore = useRepositoryStore();
const repos = computed(() => repoStore.repositories);

const updateRepos = () => {
  repoStore.update();
};  

const toggleStatus = async (repoId: number) => {
  try {
    await repoStore.updateStatus(repoId);
  } catch (error) {
    console.error('Failed to toggle status:', error);
  }
};

onMounted(() => {
  repoStore.getAllRepos();  
});
</script>

<template>
  <main class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Repositories</h1>
        <p class="text-gray-600">Manage and access your repositories</p>
      </div>

      <!-- Card Container -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div class="flex items-center gap-6">
            <div class="w-12 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</div>
            <div class="flex-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</div>
            <div class="w-24 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</div>
            <div class="w-24 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
            <div class="w-24 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="divide-y divide-gray-200">
          <div 
            v-for="(repo, index) in repos" 
            :key="repo.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div class="flex items-center gap-6">
              <div class="w-12 text-sm text-gray-500">{{ index + 1 }}</div>
              <div class="flex-1 text-sm font-medium text-gray-900 truncate">
                {{ repo.title }}
              </div>
              <div class="w-24">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="repo.private ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'"
                >
                  {{ repo.private ? 'Private' : 'Public' }}
                </span>
              </div>
              <div class="w-24">
                <!-- Toggle Button -->
                <button
                  @click="toggleStatus(repo.id)"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  :class="repo.status ? 'bg-blue-600' : 'bg-gray-300'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                    :class="repo.status ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
              <div class="w-24">
                <router-link 
                  v-if="repo.status"
                  :to="{name: 'mainTask', params: {'repoId': repo.id}}" 
                  class="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200"
                >
                  Go To
                </router-link>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="repos.length === 0" class="px-6 py-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No repositories</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by updating your repositories.</p>
          </div>
        </div>
      </div>

      <!-- Update Button -->
      <div class="mt-6 flex justify-center">
        <button
          @click="updateRepos"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          Update Repositories
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>