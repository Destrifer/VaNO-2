<script setup>
import { useCartStore } from "@/stores/cart";
import { ref } from "vue";

const cart = useCartStore();

const name = ref("");
const phone = ref("");
const email = ref("");
const delivery = ref("pickup");
const payment = ref("card");
const address = ref("");
const agree = ref(false);
const orderComment = ref("");
const message = ref("");
const submitted = ref(false);

const submitOrder = async () => {
  message.value = "";

  if (!name.value || !phone.value || !email.value) {
    message.value = "Пожалуйста, заполните все поля.";
    return;
  }
  if (!agree.value) {
    message.value = "Пожалуйста, подтвердите согласие с условиями.";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("phone", phone.value);
    formData.append("email", email.value);
    formData.append("delivery", delivery.value);
    formData.append("payment", payment.value);
    formData.append("address", address.value);
    formData.append("orderComment", orderComment.value);

    cart.items.forEach((item, index) => {
      formData.append(`items[${index}][title]`, item.title);
      formData.append(`items[${index}][price]`, item.price);
      formData.append(
        `items[${index}][simpleDesign]`,
        item.simpleDesign ? "true" : ""
      );
      formData.append(
        `items[${index}][photoRedraw]`,
        item.photoRedraw ? "true" : ""
      );
      formData.append(`items[${index}][comment]`, item.comment || "");

      if (item.options) {
        Object.entries(item.options).forEach(([key, val]) => {
          formData.append(`items[${index}][options][${key}]`, val);
        });
      }

      if (item.files?.length) {
        item.files.forEach((file, fileIndex) => {
          formData.append(`items[${index}][files][${fileIndex}]`, file);
        });
      }
    });

    const response = await $fetch("/api/send-order", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      submitted.value = true;
      message.value = "Спасибо! Ваш заказ отправлен.";
      cart.clearCart();
    } else {
      message.value = "Ошибка при отправке заказа: " + response.error;
    }
  } catch (err) {
    message.value = "Ошибка сети или сервера: " + err.message;
  }
};
</script>

<template>
  <div class="space-y-4 w-full">
    <h2 class="text-xl font-bold">Данные покупателя</h2>

    <input
      v-model="name"
      type="text"
      placeholder="Имя"
      required
      class="border px-2 py-1 w-full rounded"
    />
    <input
      v-model="phone"
      type="tel"
      placeholder="Телефон"
      required
      class="border px-2 py-1 w-full rounded"
    />
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      required
      class="border px-2 py-1 w-full rounded"
    />

    <div class="mt-4 space-y-2">
      <h3 class="font-semibold">Доставка</h3>
      <label class="flex items-center gap-2">
        <input type="radio" value="pickup" v-model="delivery" /> Самовывоз
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" value="courier" v-model="delivery" /> Курьер
      </label>
      <input
        v-if="delivery === 'courier'"
        v-model="address"
        type="text"
        placeholder="Адрес доставки"
        class="border px-2 py-1 w-full rounded"
      />
    </div>

    <div class="mt-4 space-y-2">
      <h3 class="font-semibold">Оплата</h3>
      <label class="flex items-center gap-2">
        <input type="radio" value="card" v-model="payment" /> Онлайн картой
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" value="cash" v-model="payment" /> Наличные курьеру
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" value="invoice" v-model="payment" /> По счёту (юр.
        лица)
      </label>
    </div>

    <label class="block mt-4">
      Комментарий к заказу:
      <textarea
        v-model="orderComment"
        placeholder="Пожелания к заказу: например, срок, упаковка, детали доставки"
        class="mt-1 border px-2 py-1 w-full rounded"
        rows="3"
      ></textarea>
    </label>

    <label class="flex items-center gap-2 mt-4">
      <input type="checkbox" v-model="agree" />
      Я согласен с
      <a href="/privacy" class="underline hover:text-danger"
        >политикой конфиденциальности</a
      >
    </label>

    <div
      v-if="message"
      :class="[submitted ? 'text-green-600' : 'text-red-600']"
      class="italic"
    >
      {{ message }}
    </div>

    <button
      @click="submitOrder"
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow w-full"
    >
      Отправить заказ
    </button>
  </div>
</template>
