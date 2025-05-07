<template>
  <h1 class="text-3xl font-bold mb-8">Контакты</h1>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Левая колонка -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Связаться с нами</h2>
      <ul class="space-y-2 mb-4">
        <li>
          <strong>Телефон:</strong>
          <a href="tel:+79991234567" class="text-blue-600 hover:underline"
            >+7 (999) 123-45-67</a
          >
        </li>
        <li>
          <strong>Email:</strong>
          <a
            href="mailto:info@example.com"
            class="text-blue-600 hover:underline"
            >info@example.com</a
          >
        </li>
      </ul>

      <div class="flex space-x-4 mb-6">
        <a href="#" class="text-blue-500 hover:text-blue-700">Telegram</a>
        <a href="#" class="text-green-500 hover:text-green-700">WhatsApp</a>
        <a href="#" class="text-purple-500 hover:text-purple-700">Viber</a>
      </div>

      <!-- Форма -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <input
          v-model="form.name"
          type="text"
          placeholder="Ваше имя"
          class="w-full border rounded px-3 py-2"
          required
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Ваш email"
          class="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          v-model="form.message"
          placeholder="Ваше сообщение"
          class="w-full border rounded px-3 py-2"
          required
        ></textarea>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Отправить
        </button>
      </form>

      <p v-if="submitted" class="text-green-600 mt-2">
        Спасибо! Ваше сообщение отправлено.
      </p>
    </section>

    <!-- Правая колонка -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Наш офис</h2>
      <ul class="space-y-2 mb-4">
        <li><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 1</li>
        <li><strong>Режим работы:</strong> Пн–Пт: 9:00–18:00</li>
      </ul>

      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">Схема проезда</h3>
        <img
          src="/images/map-scheme.jpg"
          alt="Схема проезда"
          class="w-full rounded border"
        />
      </div>

      <div>
        <h3 class="text-lg font-medium mb-2">Панорама</h3>
        <img
          src="/images/map-scheme.jpg"
          alt="Панорама офиса"
          class="w-full rounded border"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
  message: "",
});

const submitted = ref(false);

const submitForm = () => {
  // Здесь можно отправить данные на сервер через fetch/Axios
  console.log("Форма отправлена", form.value);
  submitted.value = true;

  // Очистка формы
  form.value = { name: "", email: "", message: "" };
};
</script>

<style scoped>
/* При желании добавь мягкие анимации */
</style>
