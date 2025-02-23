<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    // Store the token
    localStorage.setItem('authToken', token);

    // Redirect to dashboard
    router.push({ name: 'repositories' });
  } else {
    console.error('Login failed or token missing');
    router.push({ name: 'sign-in' });
  }
};

onMounted(() => {
  handleCallback();
})
</script>

<template>
  
</template>

