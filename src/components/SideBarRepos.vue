<script setup lang="ts">
import type { Repository } from '@/types/repository';
import IconFolder from './icons/IconFolder.vue';
import { ref } from 'vue';

defineProps<{
  repos: Repository[],
  reposId: number
}>()

const isRepositoriesOpen = ref(true);

const toggleRepositories = () => {
  isRepositoriesOpen.value = !isRepositoriesOpen.value;
};
</script>

<template>
  <div class="flex flex-col w-64 h-screen bg-white border-r border-gray-200">
    <!-- Logo/Brand -->
    <div class="px-6 py-6 border-b border-gray-200">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        GitTrack
      </h1>
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
            <!-- All Repos Link -->
            <router-link 
              :to="{ name: 'repositories' }" 
              class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              <span class="truncate">All Repositories</span>
            </router-link>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-2"></div>

            <!-- Individual Repos -->
            <router-link 
              v-for="repo in repos" 
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