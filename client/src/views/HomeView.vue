<script setup lang="ts">
import router from "@/router";
import axios from "axios";
import { ref } from "vue";

const username = ref("User1");
const password = ref("password1");
const error = ref("");

async function handleSubmit(e: Event) {
  e.preventDefault();
  try {
    await axios.post(
      "api/login",
      {
        username: username.value,
        password: password.value,
      },
      { withCredentials: true }
    );
    router.push("/chat");
  } catch (e: unknown) {
    if (!axios.isAxiosError(e)) {
      throw e;
    }
    if (e.response) {
      const errData = e.response.data as { message: string };
      error.value = errData.message;
    }
  }
}
</script>

<template>
  <div class="bg-gray-50 border-gray-50 border h-[500px] flex flex-col">
    <header class="mx-auto text-xl mt-10">Login</header>
    <form @submit="handleSubmit" class="mt-20 px-5 space-y-5 flex flex-col">
      <input v-model="username" type="text" placeholder="username" />
      <input v-model="password" type="password" placeholder="password" />
      <button type="submit" class="border bg-white w-1/2 mx-auto">Login</button>
      <p v-if="error" class="text-red-300 text-center">{{ error }}</p>
    </form>
  </div>
</template>
