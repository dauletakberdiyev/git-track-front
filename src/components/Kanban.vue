<script setup lang="ts">
import type { Task } from '@/types/task';
import taskService from '@/services/taskService';
import { ref, watch } from 'vue';
import type { Status } from '@/types/status';
import draggable from "vuedraggable";
import type { User } from '@/types/user';


const props = defineProps<{
  repoTitle: string | undefined,
  tasks: Task[],
  reposId: number,
  statuses: Status[],
  task: Task | null,
  user: User | null,
}>()

const emit = defineEmits([
  'task-created', 
  'task-status-updated',
  'task-selected',
  'task-updated'
]);

const selectedTask = ref<Task | null>(null);

const isNewTaskPopupOpen = ref(false);
const isTaskPopupOpen = ref(false);

const newTaskName = ref('');
const newTaskDescription = ref('');
const newTaskStatus = ref(1);

const currentTaskTitle = ref('');
const currentTaskDescription = ref('');
const currentTaskStatus = ref(1);
const currentTaskKey = ref('');

const createNewTask = () => {
  isNewTaskPopupOpen.value = true;
}

const openTask = (taskId: number) => {
  emit('task-selected', taskId);
  setTimeout(() => {
    isTaskPopupOpen.value = true;
    if (selectedTask.value) {
      currentTaskTitle.value = selectedTask.value.title;
      currentTaskDescription.value = selectedTask.value.decription ?? '';
      currentTaskStatus.value = selectedTask.value.taskStatus?.id ?? 1;
      currentTaskKey.value = selectedTask.value.key ?? '';
    } 
  }, 100);
}

const closePopup = () => {
  isNewTaskPopupOpen.value = false;
  newTaskName.value = '';
  newTaskDescription.value = '';
  newTaskStatus.value = 1;
};

const closeTaskPopup = () => {
  isTaskPopupOpen.value = false;
  currentTaskTitle.value = '';
  currentTaskDescription.value = '';
  currentTaskStatus.value = 1;
  currentTaskKey.value = '';
};

const saveTask = async () => {
  const newTask = {
    title: newTaskName.value,
    description: newTaskDescription.value,
    status: parseInt(newTaskStatus.value.toString()),
    userId: props.user?.id ?? 1,
    repositoryId: props.reposId,
  }

  const response = await taskService().saveTask(newTask);

  if (response) emit('task-created');

  closePopup();
};

const updateTask = async () => {
  const updatedTask = {
    id: selectedTask.value?.id,
    title: currentTaskTitle.value,
    description: currentTaskDescription.value,
    status: parseInt(currentTaskStatus.value.toString()),
    userId: props.user?.id ?? 1,
  }

  emit('task-updated', { ...updatedTask });

  closeTaskPopup();
}

const tasksByStatus = (statusId: number) => {
  return props.tasks.filter((t) => t.taskStatus.id === statusId);
};

const onTaskDrop = (event: any) => {
  const taskId = parseInt(event.item.dataset.taskId);
  const newStatusId = parseInt(event.to.dataset.statusId);
  emit('task-status-updated', { taskId, newStatusId });
};

watch(() => props.task, (newTask) => {
  selectedTask.value = newTask;
}, {immediate: true});
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="text-xl p-4 border-b">
      {{ repoTitle }} / Kanban Board
    </div>
    <div class="flex justify-between h-full">
      <div class="w-full border-r" v-for="status in statuses" :key="status.id">
        <div class="text-lg text-center pt-2">{{ status.title }}</div>

        <draggable 
          v-if="tasks.length > 0"
          :list="tasksByStatus(status.id)" 
          group="tasks" 
          itemKey="id"
          class="min-h-[100px]"
          @end="onTaskDrop"
          :data-status-id="status.id"
        >
          <template #item="{ element: task }">
            <div 
              class="border mb-2 w-96 mx-auto p-2 rounded-md bg-white"
              :data-task-id="task.id"
              @click="openTask(task.id)"
            >
              <div class="text-xs mb-3">{{ task.key }}</div>
              <div class="font-bold">{{ task.title }}</div>
            </div>
          </template>
        </draggable>

        <div 
          @click="createNewTask"
          class="border px-3 py-2 mx-auto w-24 text-center rounded-md cursor-pointer mt-5">
          New task
        </div>
      </div>
    </div>
  </div>

  <div 
    v-if="isNewTaskPopupOpen" 
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-5 rounded-md shadow-lg w-96">
      <span class="text-md font-semibold">New Task to {{ repoTitle }}</span>
      <!-- Task Name Input -->
      <input 
        v-model="newTaskName" 
        type="text" 
        placeholder="Task name" 
        class="w-full p-2 border rounded mb-3"/>

      <!-- Task Description Textarea -->
      <textarea 
        v-model="newTaskDescription" 
        placeholder="Task description" 
        class="w-full p-2 border rounded mb-3"></textarea>

      <!-- Task Status Select -->
      <select v-model="newTaskStatus" class="w-full p-2 border rounded mb-3">
        <option value="1">Open</option>
        <option value="2">In Progress</option>
        <option value="3">Done</option>
      </select>
      <div class="flex justify-end mt-4">
        <button @click="closePopup" class="px-4 py-2 bg-gray-300 rounded-lg mr-2">Cancel</button>
        <button @click="saveTask" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Create</button>
      </div>
    </div>
  </div>

  <div 
    v-if="isTaskPopupOpen" 
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-5 rounded-md shadow-lg w-96">
      <span class="text-md font-semibold">{{ currentTaskKey }}</span>
      <!-- Task Name Input -->
      <input 
        v-model="currentTaskTitle" 
        type="text" 
        placeholder="Task name" 
        class="w-full p-2 border rounded mb-3"/>

      <!-- Task Description Textarea -->
      <textarea 
        v-model="currentTaskDescription" 
        placeholder="Task description" 
        class="w-full p-2 border rounded mb-3"></textarea>

      <!-- Task Status Select -->
      <select v-model="currentTaskStatus" class="w-full p-2 border rounded mb-3">
        <option value="1">Open</option>
        <option value="2">In Progress</option>
        <option value="3">Done</option>
      </select>
      <div class="flex justify-end mt-4">
        <button @click="closeTaskPopup" class="px-4 py-2 bg-gray-300 rounded-lg mr-2">Cancel</button>
        <button @click="updateTask" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-move {
  transition: transform 0.3s ease;
}
</style>
