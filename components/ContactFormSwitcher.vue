<template>
  <div>
    <!-- Блок выбора -->
    <div v-if="!showForm" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Левый блок -->
      <div
        class="flex flex-col items-center justify-center p-6 border rounded-lg hover:shadow-lg cursor-pointer transition"
        @click="openForm('positive')"
      >
        <p class="text-xl font-semibold mb-2">Написать нам</p>
        <Icon
          name="fluent-emoji:smiling-face-with-sunglasses"
          size="80"
          class="happy-bounce"
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
          class="scared-shake"
        />
      </div>
    </div>

    <!-- Подключение формы -->
    <FeedbackForm v-if="showForm" :form-type="formType" @back="resetForm" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import FeedbackForm from "@/components/FeedbackForm.vue";

const formType = ref(""); // 'positive' или 'director'
const showForm = ref(false);

const openForm = (type) => {
  formType.value = type;
  showForm.value = true;
};

const resetForm = () => {
  formType.value = "";
  showForm.value = false;
};
</script>

<style scoped>
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
