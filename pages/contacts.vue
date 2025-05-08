<template>
  <h1 class="text-3xl font-bold mb-8 text-center">Контакты</h1>

  <div class="grid grid-cols-1 lg:grid-cols-[1fr_min-content_1fr] gap-8">
    <!-- Левая колонка -->
    <section class="text-center">
      <h2 class="text-2xl font-semibold mb-4">Связаться с нами</h2>
      <ul class="space-y-2 mb-4">
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

      <div class="flex justify-center items-center gap-4 mb-4">
        <a href="https://t.me/yourbot" target="_blank" aria-label="Telegram">
          <Icon name="simple-icons:telegram" size="30" />
        </a>
        <a
          href="https://wa.me/79998887766"
          target="_blank"
          aria-label="WhatsApp"
        >
          <Icon name="simple-icons:whatsapp" size="30" />
        </a>
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
      <Icon
        name="fluent-emoji:smiling-face-with-sunglasses"
        size="60"
        class="mt-5 happy-bounce cursor-pointer transition"
      />

      <Icon
        name="fluent-emoji:pleading-face"
        size="60"
        class="mt-5 scared-shake cursor-pointer transition"
      />
      <p v-if="submitted" class="text-green-600 mt-2">
        Спасибо! Ваше сообщение отправлено.
      </p>
    </section>

    <div class="hidden lg:block w-px bg-gray-300"></div>

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

      <div class="mt-4">
        <!-- Картинка вместо кнопки -->
        <NuxtImg
          src="/videos/way.png"
          alt="Смотреть видео"
          class="cursor-pointer w-full mx-auto rounded shadow hover:opacity-80 transition"
          @click="openDialog"
        />

        <!-- Диалог -->
        <dialog ref="videoDialog" class="custom-dialog" @close="onDialogClose">
          <form method="dialog" class="dialog-inner">
            <button class="close-button">×</button>
            <video controls width="100%">
              <source src="/videos/way.mp4" type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </form>
        </dialog>
      </div>
    </section>
  </div>

  <!-- Карта -->
  <section class="mt-8">
    <h2 class="text-2xl font-semibold mb-4">Мы на карте</h2>
    <div class="w-full h-64">
      <!-- Яндекс.Карта -->
      <iframe
        src="https://yandex.ru/map-widget/v1/?um=constructor%3Aexample"
        width="100%"
        height="100%"
        frameborder="0"
      ></iframe>
    </div>
  </section>
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
  console.log("Форма отправлена", form.value);
  submitted.value = true;
  form.value = { name: "", email: "", message: "" };
};

const videoDialog = ref(null);

const openDialog = () => {
  videoDialog.value.showModal();

  nextTick(() => {
    const video = videoDialog.value.querySelector("video");
    if (video) {
      const playPromise = video.play();
      // Проверяем, если возвращает промис
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Автозапуск не сработал:", error);
        });
      }
    }
  });
};

const onDialogClose = () => {
  const video = videoDialog.value.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
};
</script>

<style scoped>
.close-button {
  position: absolute;
  top: 0px;
  right: 15px;
  border: none;
  background: none;
  font-size: 32px; /* Больше */
  font-weight: bold; /* Толще */
  color: white; /* Белый цвет */
  cursor: pointer;
  outline: none;
  box-shadow: none;
}

.custom-dialog {
  width: 90%;
  max-width: 800px;
  border: none;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  /* Центрирование */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.dialog-inner {
  position: relative;
  width: 100%;
}

@keyframes jump-bounce {
  0% {
    transform: translateY(0) scale(1, 0.9);
  }
  30% {
    transform: translateY(-10%) scale(1, 1);
  }
  50% {
    transform: translateY(-25%);
  }
  70% {
    transform: translateY(-10%);
  }
  100% {
    transform: translateY(0) scale(1, 0.9);
  }
}

.happy-bounce:hover {
  animation: jump-bounce 0.6s ease-in-out infinite;
}

@keyframes shake-scared {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  10% {
    transform: translate(-2px, -2px) rotate(-5deg);
  }
  20% {
    transform: translate(2px, -2px) rotate(5deg);
  }
  30% {
    transform: translate(-2px, 2px) rotate(-5deg);
  }
  40% {
    transform: translate(2px, 2px) rotate(5deg);
  }
  50% {
    transform: translate(-2px, -2px) rotate(-5deg);
  }
  60% {
    transform: translate(2px, -2px) rotate(5deg);
  }
  70% {
    transform: translate(-2px, 2px) rotate(-5deg);
  }
  80% {
    transform: translate(2px, 2px) rotate(5deg);
  }
  90% {
    transform: translate(-2px, -2px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.scared-shake:hover {
  animation: shake-scared 0.8s infinite;
}
</style>
