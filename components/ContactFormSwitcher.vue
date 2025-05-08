<template>
  <FormWatcher>
    <template #form>
      <Transition name="fade" mode="out-in">
        <!-- Выбор блоков -->
        <div
          v-if="!showForm"
          key="choice"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <!-- Левый блок -->
          <div
            class="flex flex-col items-center justify-center p-6 border rounded-lg hover:shadow-lg cursor-pointer transition"
            @click="openForm('positive')"
          >
            <p class="text-xl font-semibold mb-2">Написать нам</p>
            <Icon
              name="fluent-emoji:smiling-face-with-sunglasses"
              size="80"
              class="happy-bounce cursor-pointer"
            />
          </div>

          <!-- Правый блок -->
          <div
            class="flex flex-col items-center justify-center p-6 border rounded-lg hover:shadow-lg cursor-pointer transition"
            @click="openForm('director')"
          >
            <p class="text-xl font-semibold mb-2">Написать директору</p>
            <Icon
              name="fluent-emoji:pleading-face"
              size="80"
              class="scared-shake cursor-pointer"
            />
          </div>
        </div>

        <!-- Форма -->
        <div v-else key="form">
          <h2 class="text-2xl font-semibold mb-4 text-center">
            {{
              formType === "positive"
                ? "Спасибо за ваш позитивный отзыв!"
                : "Обращение к директору"
            }}
          </h2>

          <form @submit.prevent="submitForm" class="max-w-md mx-auto space-y-4">
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
              :class="[
                'w-full rounded px-4 py-2 transition',
                formType === 'director'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white',
              ]"
            >
              Отправить
            </button>
          </form>

          <p v-if="submitted" class="text-green-600 mt-2 text-center">
            Спасибо! Ваше сообщение отправлено.
          </p>

          <!-- Кнопка "Назад" -->
          <div class="mt-4 text-center">
            <button
              @click="resetForm"
              class="text-sm text-gray-500 underline hover:text-gray-700"
            >
              ← Вернуться к выбору
            </button>
          </div>
        </div>
      </Transition>
    </template>
  </FormWatcher>
</template>

<script setup>
import { ref } from "vue";
import FormWatcher from "@/components/FormWatcher.vue"; // 👈 добавлен импорт

const showForm = ref(false);
const formType = ref(""); // 'positive' или 'director'

const form = ref({
  name: "",
  email: "",
  message: "",
});

const submitted = ref(false);

const openForm = (type) => {
  formType.value = type;
  showForm.value = true;
  submitted.value = false;
};

const submitForm = () => {
  console.log(
    `Форма отправлена (${
      formType.value === "positive" ? "Позитивный отзыв" : "Директор"
    }):`,
    form.value
  );
  submitted.value = true;
  form.value = { name: "", email: "", message: "" };
};

const resetForm = () => {
  showForm.value = false;
};
</script>

<style scoped>
/* Радостная анимация */
@keyframes jump-bounce {
  0% {
    transform: translateY(0) scale(1, 0.7);
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
    transform: translateY(0) scale(1, 0.7);
  }
}

.happy-bounce:hover {
  animation: jump-bounce 0.6s ease-in-out infinite;
}

/* Страх/дрожание */
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

/* Плавная смена */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
