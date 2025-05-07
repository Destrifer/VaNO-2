<template>
  <FormWatcher>
    <template #top>
      <h2 class="text-2xl font-semibold mb-4">Связаться с нами</h2>
      <ul class="space-y-2 mb-8">
        <li>
          <a
            href="tel:+79991234567"
            class="text-blue-600 hover:underline text-2xl font-bold"
            >+7 (999) 123-45-67</a
          >
        </li>
        <li>
          <a
            href="mailto:info@example.com"
            class="text-blue-600 hover:underline text-2xl font-bold"
            >info@example.com</a
          >
        </li>
      </ul>
    </template>

    <template #form>
      <form class="space-y-4">
        <input
          type="text"
          placeholder="Имя"
          class="border px-4 py-2 block w-full"
        />
        <input
          type="email"
          placeholder="Email"
          class="border px-4 py-2 block w-full"
        />
        <input
          type="password"
          placeholder="Пароль"
          class="border px-4 py-2 block w-full"
        />
      </form>
    </template>
  </FormWatcher>
</template>

<script setup>
import FormWatcher from "@/components/FormWatcher.vue";
</script>
