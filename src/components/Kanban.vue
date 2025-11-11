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
  <div class="flex flex-col w-full h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-6 py-4">
        <h1 class="text-lg font-medium text-gray-900">
          {{ repoTitle }} <span class="text-gray-400">/</span> 
          <span class="text-gray-600">Kanban Board</span>
        </h1>
      </div>
    </div>

    <!-- Board -->
    <div class="flex gap-4 p-6 overflow-x-auto h-full">
      <div 
        class="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4" 
        v-for="status in statuses" 
        :key="status.id"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {{ status.title }}
          </h2>
          <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {{ tasksByStatus(status.id).length }}
          </span>
        </div>

        <!-- Tasks -->
        <draggable 
          v-if="tasks.length > 0"
          :list="tasksByStatus(status.id)" 
          group="tasks" 
          itemKey="id"
          class="space-y-3 min-h-[200px]"
          @end="onTaskDrop"
          :data-status-id="status.id"
        >
          <template #item="{ element: task }">
            <div 
              class="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
              :data-task-id="task.id"
              @click="openTask(task.id)"
            >
              <div class="text-xs text-gray-500 font-mono mb-2">{{ task.key }}</div>
              <div class="text-sm font-medium text-gray-900 line-clamp-2">{{ task.title }}</div>
            </div>
          </template>
        </draggable>

        <!-- Add Task Button -->
        <button 
          @click="createNewTask"
          class="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white border border-dashed border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200"
        >
          + New task
        </button>
      </div>
    </div>
  </div>

  <!-- New Task Modal -->
  <div 
    v-if="isNewTaskPopupOpen" 
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50"
    @click.self="closePopup"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">New Task</h3>
        <p class="text-sm text-gray-500 mt-1">{{ repoTitle }}</p>
      </div>
      
      <div class="p-6 space-y-4">
        <input 
          v-model="newTaskName" 
          type="text" 
          placeholder="Task name" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <textarea 
          v-model="newTaskDescription" 
          placeholder="Task description" 
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>

        <select 
          v-model="newTaskStatus" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="1">Open</option>
          <option value="2">In Progress</option>
          <option value="3">Done</option>
        </select>
      </div>

      <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
        <button 
          @click="closePopup" 
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="saveTask" 
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Create
        </button>
      </div>
    </div>
  </div>

  <!-- Edit Task Modal -->
  <div 
    v-if="isTaskPopupOpen" 
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50"
    @click.self="closeTaskPopup"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">{{ currentTaskKey }}</h3>
      </div>
      
      <div class="p-6 space-y-4">
        <input 
          v-model="currentTaskTitle" 
          type="text" 
          placeholder="Task name" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <textarea 
          v-model="currentTaskDescription" 
          placeholder="Task description" 
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>

        <select 
          v-model="currentTaskStatus" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="1">Open</option>
          <option value="2">In Progress</option>
          <option value="3">Done</option>
        </select>
      </div>

      <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
        <button 
          @click="closeTaskPopup" 
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="updateTask" 
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-move {
  transition: transform 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>