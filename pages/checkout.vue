<script setup>
import { useCartStore } from "@/stores/cart";
import { ref } from "vue";

const cart = useCartStore();

const name = ref("");
const phone = ref("");
const email = ref("");
const message = ref("");
const submitted = ref(false);

const submitOrder = async () => {
  message.value = "";

  if (!name.value || !phone.value || !email.value) {
    message.value = "Пожалуйста, заполните все поля.";
    return;
  }

  try {
    const response = await $fetch("/api/send-order", {
      method: "POST",
      body: {
        name: name.value,
        phone: phone.value,
        email: email.value,
        items: cart.items,
      },
    });

    if (response.ok) {
      submitted.value = true;
      message.value = "Спасибо! Ваш заказ отправлен.";
      cart.clearCart();
    } else {
      message.value = "Ошибка при отправке письма: " + response.error;
    }
  } catch (err) {
    message.value = "Ошибка сети или сервера: " + err.message;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold mb-4">Оформление заказа</h1>

    <div v-if="cart.items.length === 0 && !submitted" class="text-gray-600">
      Ваша корзина пуста.
    </div>

    <div v-else-if="!submitted">
      <h2 class="text-xl font-semibold mb-2">Товары в корзине:</h2>
      <ul class="space-y-2 border p-4 rounded">
        <li
          v-for="(item, index) in cart.items"
          :key="index"
          class="border-b pb-2"
        >
          <div class="font-semibold">{{ item.title }}</div>
          <ul class="text-sm text-gray-700">
            <li v-for="(val, key) in item.options" :key="key">
              {{ key }}: {{ val }}
            </li>
          </ul>
          <div class="mt-1">
            Цена: <strong>{{ item.price }} ₽</strong>
          </div>
        </li>
      </ul>

      <form class="mt-6 space-y-4" @submit.prevent="submitOrder">
        <label class="block">
          Имя:
          <input
            v-model="name"
            type="text"
            required
            class="mt-1 border px-2 py-1 w-full"
          />
        </label>

        <label class="block">
          Телефон:
          <input
            v-model="phone"
            type="tel"
            required
            class="mt-1 border px-2 py-1 w-full"
          />
        </label>

        <label class="block">
          Email:
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 border px-2 py-1 w-full"
          />
        </label>

        <div v-if="message" class="text-red-600 italic">{{ message }}</div>

        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Отправить заказ
        </button>
      </form>
    </div>

    <div v-else class="text-green-600 text-lg">
      {{ message }}
    </div>
  </div>
</template>
