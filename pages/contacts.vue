<template>
  <div class="relative w-[600px] mx-auto mt-8">
    <!-- Блок с картинкой и персонажами -->
    <div class="relative overflow-hidden">
      <img src="/images/main.jpg" alt="Фон" />

      <!-- Катушки -->
      <img
        src="/images/left.png"
        class="absolute w-[160px] top-[38px] left-[186px] cat"
      />
      <img
        src="/images/right.png"
        class="absolute w-[160px] top-[32px] left-[470px] cat-reverse"
      />

      <!-- Передний слой (маска) -->
      <img
        src="/images/front-mask.png"
        class="absolute top-[86px] left-[174px] w-[84px] h-auto pointer-events-none"
      />

      <!-- Шторка -->
      <div
        class="absolute top-0 left-0 w-full h-full bg-white z-20 transition-transform duration-[2000ms] ease-in-out"
        :class="{ '-translate-y-full': curtainOpened }"
      ></div>
    </div>

    <!-- Глаза персонажа 1 -->
    <div class="eye absolute left-[85px] top-[162px]">
      <div
        class="pupil w-1 h-1 bg-black rounded-full relative top-2 left-2 transition-transform"
      ></div>
    </div>
    <div class="eye absolute left-[153px] top-[165px]">
      <div
        class="pupil w-1 h-1 bg-black rounded-full relative top-2 left-2 transition-transform"
      ></div>
    </div>

    <!-- Глаза персонажа 2 -->
    <div class="eye absolute left-[385px] top-[251px]">
      <div
        class="pupil w-1 h-1 bg-black rounded-full relative top-2 left-2 transition-transform"
      ></div>
    </div>
    <div class="eye absolute left-[454px] top-[254px]">
      <div
        class="pupil w-1 h-1 bg-black rounded-full relative top-2 left-2 transition-transform"
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
import { ref, onMounted, onBeforeUnmount } from "vue";

const curtainOpened = ref(false);
const eyesActive = ref(false);
let curtainSound = null;

const handleFocus = () => {
  if (!curtainOpened.value) {
    curtainOpened.value = true;
    curtainSound.play().catch((err) => {
      console.log("Звук не проигрался:", err);
    });
  }
};

const handleInput = (e) => {
  // Начинаем следить только после начала ввода
  if (!eyesActive.value) {
    eyesActive.value = true;
  }

  if (!eyesActive.value) return; // безопасность

  const targetRect = e.target.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  const textLength = e.target.value.length;
  const maxLength = 30;
  const factor = Math.min(textLength / maxLength, 1);

  document.querySelectorAll(".eye").forEach((eye) => {
    const pupil = eye.querySelector(".pupil");
    const rect = eye.getBoundingClientRect();

    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const dx = targetX + targetRect.width * (factor - 0.5) - eyeCenterX;
    const dy = targetY - eyeCenterY;
    const angle = Math.atan2(dy, dx);

    const radius = 12;
    const maxVertical = 4;

    const pupilX = Math.cos(angle) * radius;
    let pupilY = Math.sin(angle) * radius;

    if (pupilY > maxVertical) pupilY = maxVertical;
    if (pupilY < -maxVertical) pupilY = -maxVertical;

    pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  });
};

const resetEyes = () => {
  document.querySelectorAll(".eye .pupil").forEach((pupil) => {
    pupil.style.transform = `translate(0, 0)`;
  });
  eyesActive.value = false; // отключаем слежку после blur
};

onMounted(() => {
  curtainSound = new Audio("/sounds/door.mp3");

  document.querySelectorAll("form input").forEach((input) => {
    input.addEventListener("focus", handleFocus);
    input.addEventListener("input", handleInput);
    input.addEventListener("blur", resetEyes);
  });
});

onBeforeUnmount(() => {
  document.querySelectorAll("form input").forEach((input) => {
    input.removeEventListener("focus", handleFocus);
    input.removeEventListener("input", handleInput);
    input.removeEventListener("blur", resetEyes);
  });
});
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

.cat {
  animation: spin 2s linear infinite;
  transform-origin: center center;
}

.cat-reverse {
  animation: spin-reverse 1s linear infinite; /* 2 раза быстрее */
  transform-origin: center center;
}
</style>
