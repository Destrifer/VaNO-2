<template>
  <FormWatcher ref="formWatcher" :activateEffect="formType === 'director'">
    <template #form>
      <div>
        <h2 class="text-2xl font-semibold mb-4 text-center">
          {{
            formType === "positive"
              ? "Спасибо за ваш позитивный отзыв!"
              : "Обращение к директору"
          }}
        </h2>

        <form @submit.prevent="submitForm" class="max-w-md mx-auto space-y-4">
          <input
            v-model="name"
            type="text"
            placeholder="Ваше имя"
            class="w-full border rounded px-3 py-2"
          />
          <input
            v-model="email"
            type="email"
            placeholder="Ваш email"
            class="w-full border rounded px-3 py-2"
          />
          <input
            v-model="phone"
            type="text"
            placeholder="Ваш телефон"
            class="w-full border rounded px-3 py-2"
          />
          <textarea
            v-model="message"
            placeholder="Ваше сообщение"
            class="w-full border rounded px-3 py-2"
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

          <p v-if="messageSent" class="text-green-600 text-sm text-center mt-2">
            Ваше сообщение успешно отправлено!
          </p>
        </form>

        <div class="mt-4 text-center">
          <button
            @click="emit('back')"
            class="text-sm text-gray-500 underline hover:text-gray-700"
          >
            ← Вернуться к выбору
          </button>
        </div>
      </div>
    </template>
  </FormWatcher>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import FormWatcher from "@/components/FormWatcher.vue";

const props = defineProps({
  formType: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["back"]);

const formWatcher = ref(null);
const name = ref("");
const email = ref("");
const phone = ref("");
const message = ref("");
const messageSent = ref(false);

const submitForm = async () => {
  const data = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    message: message.value,
    to: props.formType,
  };

  const send = async () => {
    try {
      await fetch("/api/send-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Ошибка отправки:", err);
    }
  };

  if (props.formType === "director") {
    formWatcher.value?.closeEffect();
    setTimeout(() => {
      send();
      finishForm();
    }, 2200);
  } else {
    send();
    finishForm();
  }
};

const finishForm = () => {
  messageSent.value = true;
  name.value = "";
  email.value = "";
  phone.value = "";
  message.value = "";

  setTimeout(() => {
    messageSent.value = false;
  }, 5000);
};
</script>
