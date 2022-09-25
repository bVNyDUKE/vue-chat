<script setup lang="ts">
import router from "@/router";
import axios from "axios";
import { onBeforeMount, onMounted, onUpdated, ref } from "vue";

type MessageData = {
  type: "users" | "message";
  content: string;
  createdAt: Date;
  author: {
    name: string;
  };
}[];

const user = ref(null);
const messageLog = ref<MessageData>([]);
const usersList = ref<string[]>([]);
const msg = ref("");
const chatlog = ref<HTMLElement>();

function scroll() {
  if (chatlog.value) {
    chatlog.value.scrollTop = chatlog.value?.scrollHeight;
  }
}

onBeforeMount(async () => {
  try {
    const [{ data: userData }, { data: messageData }] = await Promise.all([
      axios.get("api/user"),
      axios.get("api/messages"),
    ]);
    user.value = userData.user;
    const messages = messageData.data as MessageData;
    messageLog.value = messages;
  } catch {
    router.push("/");
  }
});

onMounted(() => scroll());
onUpdated(() => scroll());

const socketUrl =
  window.location.host === "localhost"
    ? "ws://localhost:8000"
    : `ws://${window.location.host}`;

const socket = new WebSocket(socketUrl);
socket.addEventListener("open", () => socket.send("Hello!"));
socket.addEventListener("message", (ev: MessageEvent) => {
  const messageData = JSON.parse(ev.data);

  if (messageData.type === "users") {
    usersList.value = messageData.content;
  } else {
    messageLog.value.push(messageData);
  }
});

function sendMessage() {
  socket.send(msg.value);
  msg.value = "";
}

async function handleLogout() {
  await axios.post("api/logout");
  socket.close();
  router.push("/");
}
</script>

<template>
  <div
    class="bg-gray-700 text-gray-400 border-gray-400 container max-w-3xl border h-[700px] flex flex-col"
  >
    <header class="mx-auto text-xl p-1 relative w-full border-b">
      <div class="w-1/2 text-center mx-auto">Chat</div>
      <button class="absolute right-0 top-0 h-full" @click="handleLogout">
        Logout
      </button>
    </header>
    <div class="flex h-full">
      <div class="border-r w-1/5 flex flex-col">
        <div>Active:</div>
        <div v-for="(user, idx) of usersList" class="px-2" :key="idx">
          {{ user }}
        </div>
      </div>
      <div class="flex flex-col w-4/5">
        <div id="chatLog" ref="chatlog" class="overflow-scroll h-[600px]">
          <div v-for="(msg, idx) of messageLog" class="px-2" :key="idx">
            {{ msg.author.name }} : {{ msg.content }}
          </div>
        </div>
        <form @submit.prevent="sendMessage" class="h-[50px] flex border-t">
          <input
            type="text"
            class="h-full grow px-2 outline-none bg-gray-700"
            name="send"
            autocomplete="off"
            v-model="msg"
            placeholder="Your message here..."
          />
          <button type="submit" class="w-16">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
#chatLog::-webkit-scrollbar {
  display: none;
}

#chatLog {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
