<script setup lang="ts">
import type { Repository } from '@/types/repository';
import IconFolder from './icons/IconFolder.vue';
import { ref, computed } from 'vue';

const props = defineProps<{
  repos: Repository[],
  reposId: number
}>()

const isRepositoriesOpen = ref(true);
const searchQuery = ref('');

const toggleRepositories = () => {
  isRepositoriesOpen.value = !isRepositoriesOpen.value;
};

const filteredRepos = computed(() => {
  // First filter by status (only show repos where status is true)
  const activeRepos = props.repos.filter(repo => repo.status === true);
  
  // Then filter by search query if there is one
  if (!searchQuery.value.trim()) {
    return activeRepos;
  }
  
  return activeRepos.filter(repo => 
    repo.title.toLowerCase().startsWith(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="flex flex-col w-64 h-screen bg-white border-r border-gray-200">
    <!-- Logo/Brand -->
    <div class="border-b border-gray-200">
      <router-link 
        :to="{ name: 'repositories' }"
        class="block px-6 py-6 hover:bg-gray-50 transition-colors duration-200"
      >
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          GitTrack
        </h1>
      </router-link>
    </div>

    <!-- Navigation Section -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="mb-6">
        <!-- Accordion Header -->
        <button
          @click="toggleRepositories"
          class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          <span>Repositories</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 transition-transform duration-200"
            :class="{ 'rotate-180': isRepositoriesOpen }"
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Accordion Content -->
        <div 
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="isRepositoriesOpen ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'"
        >
          <nav class="space-y-1">
            <!-- Search Input -->
            <div class="px-3 py-2">
              <div class="relative">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search repositories..." 
                  class="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-2"></div>

            <!-- Individual Repos -->
            <router-link 
              v-for="repo in filteredRepos" 
              :key="repo.id"
              :to="{ name: 'mainTask', params: { 'repoId': repo.id.toString() } }" 
              class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200"
              :class="[
                repo.id === reposId 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              ]"
            >
              <IconFolder class="flex-shrink-0" />
              <span class="truncate">{{ repo.title }}</span>
            </router-link>

            <!-- No Results Message -->
            <div v-if="searchQuery && filteredRepos.length === 0" class="px-3 py-4 text-center text-sm text-gray-500">
              No repositories found
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- Views Section -->
    <div class="border-t border-gray-200 p-4">
      <h2 class="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Views
      </h2>
      <nav class="space-y-1">
        <!-- Kanban Board -->
        <router-link 
          :to="{ name: 'repositories' }" 
          class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z" />
          </svg>
          <span class="truncate">Kanban Board</span>
        </router-link>

        <!-- Table -->
        <router-link 
          :to="{ name: 'repositories' }" 
          class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd" />
          </svg>
          <span class="truncate">Table</span>
        </router-link>

        <!-- Analytics -->
        <router-link 
          :to="{ name: 'repositories' }" 
          class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <span class="truncate">Analytics</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<style scoped>
/* Active link styling is handled by classes above */
</style>