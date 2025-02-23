<script setup lang="ts">
import { useRepositoryStore } from '@/stores/repository';
import { computed, onMounted } from 'vue';

const repoStore = useRepositoryStore();

const repos = computed(() => repoStore.repositories);

const updateRepos = () => {
  repoStore.update();
};  

onMounted(() => {
  repoStore.getAllRepos();  
});

</script>

<template>
  <main class="w-full flex justify-center items-center">
    <div class="p-3 w-[50%]">
      <div class="flex justify-center mb-2">
        <div class="w-[1.5rem] font-bold">#</div>
        <div class="min-w-48 text-base max-w-prose font-bold">Title</div>
        <div class="w-[5rem] font-bold">Type</div>
        <div class="font-bold">Action</div>
      </div>
      <div class="flex justify-center mb-2" v-for="repo,index in repos">
        <div class="w-[1.5rem]">{{ index + 1 }}</div>
        <div class="min-w-48 text-base max-w-prose">{{ repo.title }}</div>
        <div class="w-[5rem]">{{ repo.private ? 'Private' : 'Public' }}</div>
        <router-link :to="{name: 'mainTask', params: {'repoId': repo.id}}" class="px-2 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white">Go To</router-link>
      </div>
      <div class="flex justify-center mb-2">
        <div 
          class="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
          @click="updateRepos"  
        >Update Repos</div>
      </div>
    </div>  
  </main>
</template>

<style>

</style>
