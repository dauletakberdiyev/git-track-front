<script setup lang="ts">
import { useRepositoryStore } from '@/stores/repository';
import { useTaskStore } from '@/stores/task';
import { useUserStore } from '@/stores/user';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import SideBarRepos from '@/components/SideBarRepos.vue';
import Kanban from '@/components/Kanban.vue';
import { useStatusStore } from '@/stores/status';
import type { updateTask } from '@/types/task';

const repoStore = useRepositoryStore();
const tasksStore = useTaskStore();
const statusStore = useStatusStore();
const userStore = useUserStore();

const route = useRoute();
const repoId = computed(() => parseInt(route.params.repoId as string));

const repos = computed(() => repoStore.repositories);
if (repos.value.length === 0) {
  repoStore.getAllRepos();
}

const tasks = computed(() => tasksStore.tasks);
const task = computed(() => tasksStore.task);
const statuses = computed(() => statusStore.statuses);
const user = computed(() => userStore.user);

const currentRepo = computed(() => {
  return repos.value.find(repo => repo.id === repoId.value);
});

const fetchTasks = async () => {
  await tasksStore.getAllTasksByRepo(repoId.value);
};

onMounted(() => {
  tasksStore.getAllTasksByRepo(repoId.value);
  statusStore.getAllStatuses();
  userStore.userInfo();
});

watch(repoId, (newRepoId) => {
  if (newRepoId) {
    tasksStore.getAllTasksByRepo(repoId.value);
  }
});

const handleTaskStatusUpdate = async ({taskId, newStatusId}: {taskId: number, newStatusId: number}) => {
  await tasksStore.updateTaskStatus(taskId, newStatusId);
  await fetchTasks();
};

const updateTask = async (task: updateTask) => {
  await tasksStore.updateTask(task);
  await fetchTasks();
};

const openTask = async (taskId: number) => {
  await tasksStore.getTaskById(taskId);
};
</script>

<template>
  <div class="flex w-full">
  <SideBarRepos :repos="repos" :reposId="repoId"/>
  <Kanban 
    :repoTitle="currentRepo?.title" 
    :tasks="tasks" 
    :reposId="repoId" 
    :statuses="statuses"
    :task="task"
    :user="user"
    @task-created="fetchTasks"  
    @task-status-updated="handleTaskStatusUpdate"
    @task-selected="openTask"
    @task-updated="updateTask"
  />
  </div>
</template>

<style>

</style>
