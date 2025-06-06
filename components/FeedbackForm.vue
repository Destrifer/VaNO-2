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
          <div>
            <input
              v-model="name"
              type="text"
              placeholder="Ваше имя"
              class="w-full border rounded px-3 py-2"
            />
            <p v-if="nameError" class="text-red-600 text-sm mt-1">
              {{ nameError }}
            </p>
          </div>

          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Ваш email"
              class="w-full border rounded px-3 py-2"
            />
            <p v-if="emailError" class="text-red-600 text-sm mt-1">
              {{ emailError }}
            </p>
          </div>

          <div>
            <IMaskComponent
              v-model="phone"
              :mask="'+7 (000) 000-00-00'"
              :lazy="false"
              placeholder="Ваш телефон"
              class="w-full border rounded px-3 py-2"
              @focus="handlePhoneFocus"
            />
            <p v-if="phoneError" class="text-red-600 text-sm mt-1">
              {{ phoneError }}
            </p>
          </div>

          <div>
            <textarea
              v-model="message"
              placeholder="Ваше сообщение"
              class="w-full border rounded px-3 py-2"
              rows="4"
            ></textarea>
            <p v-if="messageError" class="text-red-600 text-sm mt-1">
              {{ messageError }}
            </p>
          </div>

          <!-- Turnstile -->
          <div id="turnstile-container" class="my-4 flex justify-center" />
          <p v-if="captchaError" class="text-red-600 text-sm text-center mt-1">
            {{ captchaError }}
          </p>

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
import { ref, onMounted } from "vue";
import { IMaskComponent } from "vue-imask";
import FormWatcher from "@/components/FormWatcher.vue";

const emit = defineEmits(["back"]);
const props = defineProps({
  formType: { type: String, required: true },
});

const formWatcher = ref(null);

const name = ref("");
const email = ref("");
const phone = ref("");
const message = ref("");
const captchaToken = ref("");

const nameError = ref("");
const emailError = ref("");
const phoneError = ref("");
const messageError = ref("");
const captchaError = ref("");
const messageSent = ref(false);

const handlePhoneFocus = (e) => {
  setTimeout(() => {
    const prefixLength = "+7 (".length;
    e.target.setSelectionRange(prefixLength, prefixLength);
  }, 0);
};

const validate = () => {
  let valid = true;
  nameError.value = "";
  emailError.value = "";
  phoneError.value = "";
  messageError.value = "";
  captchaError.value = "";

  if (!name.value.trim() || name.value.trim().length < 3) {
    nameError.value = "Введите не менее 3 символов.";
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Введите корректный email.";
    valid = false;
  }

  const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  if (phone.value && !phoneRegex.test(phone.value)) {
    phoneError.value = "Введите телефон в формате: +7 (___) ___-__-__";
    valid = false;
  }

  if (!message.value.trim()) {
    messageError.value = "Поле сообщения обязательно.";
    valid = false;
  }

  if (!captchaToken.value) {
    captchaError.value = "Подтвердите, что вы не робот.";
    valid = false;
  }

  return valid;
};

const submitForm = async () => {
  if (!validate()) return;

  const data = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    message: message.value,
    to: props.formType,
    captcha: captchaToken.value,
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
  captchaToken.value = "";

  setTimeout(() => {
    messageSent.value = false;
  }, 5000);

  // перерендерить turnstile
  renderTurnstile();
};

const renderTurnstile = () => {
  window.turnstile?.render("#turnstile-container", {
    sitekey: "0x4AAAAAABclCvvQuq4VT03C", // вставь свой публичный ключ
    callback: (token) => {
      captchaToken.value = token;
      captchaError.value = "";
    },
    "error-callback": () => {
      captchaError.value = "Ошибка капчи. Попробуйте ещё раз.";
    },
  });
};

onMounted(() => {
  if (!window.turnstile) {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderTurnstile;
    document.head.appendChild(script);
  } else {
    renderTurnstile();
  }
});
</script>
