<script setup lang="ts">
import { ref, computed } from "vue";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const newTodo = ref("");
const todos = ref<Todo[]>([]);
let nextId = 1;

const remaining = computed(() => todos.value.filter((t) => !t.done).length);

function addTodo() {
  const text = newTodo.value.trim();
  if (!text) return;
  todos.value = [...todos.value, { id: nextId++, text, done: false }];
  newTodo.value = "";
}

function toggleTodo(id: number) {
  todos.value = todos.value.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t,
  );
}

function removeTodo(id: number) {
  todos.value = todos.value.filter((t) => t.id !== id);
}
</script>

<template>
  <main class="app">
    <h1>待辦清單</h1>
    <form class="todo-form" @submit.prevent="addTodo">
      <input v-model="newTodo" type="text" placeholder="今天要做什麼?" />
      <button type="submit">新增</button>
    </form>
    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="{ done: todo.done }">
        <label>
          <input
            type="checkbox"
            :checked="todo.done"
            @change="toggleTodo(todo.id)"
          />
          <span>{{ todo.text }}</span>
        </label>
        <button class="remove" @click="removeTodo(todo.id)">刪除</button>
      </li>
    </ul>
    <p class="summary">還有 {{ remaining }} 件事情待完成</p>
  </main>
</template>
