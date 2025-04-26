<script setup>
import { useCartStore } from "@/stores/cart";
import { ref, computed } from "vue";

const cart = useCartStore();

const name = ref("");
const phone = ref("");
const email = ref("");
const message = ref("");
const submitted = ref(false);

// Пересчёт суммы заказа
const cartTotal = computed(() => {
  return cart.items.reduce((sum, item) => {
    let extraPrice = 0;
    if (item.simpleDesign) extraPrice += 900;
    if (item.photoRedraw) extraPrice += 500;
    return sum + item.price + extraPrice;
  }, 0);
});

// Работа с файлами
const onFilesChange = (e, itemIndex) => {
  const files = Array.from(e.target.files);
  const allowedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "tiff",
    "svg",
    "pdf",
    "ai",
    "psd",
    "rar",
    "zip",
  ];

  const validFiles = files.filter((file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.includes(ext);
  });

  if (!cart.items[itemIndex].files) {
    cart.items[itemIndex].files = [];
  }

  cart.items[itemIndex].files = [
    ...cart.items[itemIndex].files,
    ...validFiles,
  ].slice(0, 3);
};

const removeFile = (itemIndex, fileIndex) => {
  cart.items[itemIndex].files.splice(fileIndex, 1);
};

const removeItem = (index) => {
  cart.items.splice(index, 1);
};

const submitOrder = async () => {
  message.value = "";

  if (!name.value || !phone.value || !email.value) {
    message.value = "Пожалуйста, заполните все поля.";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("phone", phone.value);
    formData.append("email", email.value);

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

      // Новый блок — передаём параметры (options)
      if (item.options) {
        Object.entries(item.options).forEach(([optKey, optValue]) => {
          formData.append(`items[${index}][options][${optKey}]`, optValue);
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

      <ul class="space-y-4 border p-4 rounded">
        <li
          v-for="(item, index) in cart.items"
          :key="index"
          class="relative border-b pb-6"
        >
          <button
            @click="removeItem(index)"
            class="absolute top-0 right-0 text-red-500 hover:text-red-700 text-xl"
            title="Удалить товар"
          >
            ×
          </button>

          <div class="font-semibold">{{ item.title }}</div>

          <!-- Параметры товара -->
          <ul v-if="item.options" class="text-sm text-gray-700 mt-2">
            <li v-for="(val, key) in item.options" :key="key">
              {{ key }}: {{ val }}
            </li>
          </ul>

          <div class="mt-2">
            Базовая цена: <strong>{{ item.price }} ₽</strong>
          </div>

          <!-- Дополнительные услуги -->
          <div class="mt-4 space-y-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="item.simpleDesign" />
              Простой дизайн (+900 ₽)
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="item.photoRedraw" />
              Отрисовка по фото (+500 ₽)
            </label>
          </div>

          <!-- Прикрепление файлов -->
          <div class="mt-4">
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.tiff,.svg,.pdf,.ai,.psd,.rar,.zip"
              @change="onFilesChange($event, index)"
              class="border p-2 rounded w-full"
            />

            <div v-if="item.files?.length" class="space-y-2 mt-2">
              <div
                v-for="(file, fileIndex) in item.files"
                :key="fileIndex"
                class="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span class="text-sm truncate">{{ file.name }}</span>
                <button
                  @click="removeFile(index, fileIndex)"
                  class="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Комментарий к макету -->
          <div v-if="item.files?.length" class="mt-4">
            <textarea
              v-model="item.comment"
              placeholder="Комментарий к макету..."
              class="border p-2 rounded w-full"
              rows="3"
            ></textarea>
          </div>
        </li>
      </ul>

      <div class="text-right text-xl font-bold mt-6">
        Общая сумма: <span class="text-green-600">{{ cartTotal }} ₽</span>
      </div>

      <form class="mt-8 space-y-4" @submit.prevent="submitOrder">
        <label class="block">
          Имя:
          <input
            v-model="name"
            type="text"
            required
            class="mt-1 border px-2 py-1 w-full rounded"
          />
        </label>

        <label class="block">
          Телефон:
          <input
            v-model="phone"
            type="tel"
            required
            class="mt-1 border px-2 py-1 w-full rounded"
          />
        </label>

        <label class="block">
          Email:
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 border px-2 py-1 w-full rounded"
          />
        </label>

        <div v-if="message" class="text-red-600 italic">{{ message }}</div>

        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow w-full"
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
