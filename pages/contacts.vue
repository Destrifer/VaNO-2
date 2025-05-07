<template>
  <div class="relative w-[600px] mx-auto mt-8">
    <!-- Одна картинка с двумя персонажами -->
    <img
      src="/images/1.jpg"
      alt="Два персонажа"
      class="w-full h-full object-contain"
    />

    <!-- Глаза персонажа 1 -->
    <div
      class="eye absolute w-8 h-8 bg-white rounded-full overflow-hidden left-[20%] top-[30%]"
    >
      <div
        class="pupil w-3 h-3 bg-black rounded-full relative top-2 left-2 transition-transform"
      ></div>
    </div>
    <div
      class="eye absolute w-8 h-8 bg-white rounded-full overflow-hidden left-[35%] top-[30%]"
    >
      <div
        class="pupil w-3 h-3 bg-black rounded-full relative top-2 left-2 transition-transform"
      ></div>
    </div>

    <!-- Глаза персонажа 2 -->
    <div
      class="eye absolute w-8 h-8 bg-white rounded-full overflow-hidden left-[65%] top-[30%]"
    >
      <div
        class="pupil w-3 h-3 bg-black rounded-full relative top-2 left-2 transition-transform"
      ></div>
    </div>
    <div
      class="eye absolute w-8 h-8 bg-white rounded-full overflow-hidden left-[80%] top-[30%]"
    >
      <div
        class="pupil w-3 h-3 bg-black rounded-full relative top-2 left-2 transition-transform"
      ></div>
    </div>
  </div>

  <!-- Форма -->
  <div class="mt-8 flex justify-center">
    <form class="space-y-4">
      <input
        type="text"
        placeholder="Имя"
        class="border px-4 py-2 block w-64"
      />
      <input
        type="email"
        placeholder="Email"
        class="border px-4 py-2 block w-64"
      />
      <input
        type="password"
        placeholder="Пароль"
        class="border px-4 py-2 block w-64"
      />
    </form>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";

const handleInput = (e) => {
  const targetRect = e.target.getBoundingClientRect();

  // Центр поля
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  // Вычисляем смещение по X в зависимости от длины текста
  const textLength = e.target.value.length;
  const maxLength = 30; // максимальная длина текста для полного "смещения"

  // Фактор смещения: от 0 до 1
  const factor = Math.min(textLength / maxLength, 1);

  document.querySelectorAll(".eye").forEach((eye) => {
    const pupil = eye.querySelector(".pupil");
    const rect = eye.getBoundingClientRect();

    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    // Считаем угол (по центру Y, но смещаем X в зависимости от текста)
    const dx = targetX + targetRect.width * (factor - 0.5) - eyeCenterX;
    const dy = targetY - eyeCenterY;
    const angle = Math.atan2(dy, dx);

    // Максимальный радиус движения зрачка
    const radius = 10;
    const pupilX = Math.cos(angle) * radius;
    const pupilY = Math.sin(angle) * radius;

    pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  });
};

const resetEyes = () => {
  // Вернуть глаза в центр при blur
  document.querySelectorAll(".eye .pupil").forEach((pupil) => {
    pupil.style.transform = `translate(0, 0)`;
  });
};

onMounted(() => {
  document.querySelectorAll("form input").forEach((input) => {
    input.addEventListener("focus", handleInput);
    input.addEventListener("input", handleInput);
    input.addEventListener("blur", resetEyes);
  });
});

onBeforeUnmount(() => {
  document.querySelectorAll("form input").forEach((input) => {
    input.removeEventListener("focus", handleInput);
    input.removeEventListener("input", handleInput);
    input.removeEventListener("blur", resetEyes);
  });
});
</script>

<style scoped>
/* При желании добавь мягкие анимации */
</style>
