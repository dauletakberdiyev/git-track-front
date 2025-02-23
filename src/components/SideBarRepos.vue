<script setup lang="ts">
import type { Repository } from '@/types/repository';
import IconFolder from './icons/IconFolder.vue';

defineProps<{
  repos: Repository[],
  reposId: number
}>()
</script>

<template>
  <div class="flex flex-col p-2 border-r">
    <div class="mx-auto mb-4 text-3xl font-extrabold leading-none tracking-tight">
      GitTrack
    </div>
    <div>
      <div class="mb-2 text-xl">
        Repositories
      </div>
      <div>
        <div v-for="repo in repos" :key="repo.id" class="flex items-center">
          <IconFolder/>
          <router-link 
            :to="{ name: 'mainTask', params: { 'repoId': repo.id.toString() } }" 
            class="w-full"
            :class="{'font-bold': repo.id === reposId}"
          >
            {{ repo.title }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
