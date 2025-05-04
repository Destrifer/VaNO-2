<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const orderId = route.query.order;
</script>

<template>
  <div class="max-w-xl mx-auto p-8 text-center">
    <h1 class="text-3xl font-bold mb-4">Спасибо за заказ!</h1>
    <p class="text-lg">Ваш заказ успешно оформлен.</p>
    <p class="text-lg font-semibold mt-4">
      Номер заказа:
      <span class="text-green-600">{{ orderId }}</span>
    </p>
    <NuxtLink
      to="/"
      class="inline-block mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Вернуться на главную
    </NuxtLink>
  </div>
</template>
