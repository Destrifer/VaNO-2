<template>
  <div class="max-w-xl mx-auto mt-8 relative">
    <!-- Абсолютный блок с эффектом -->
    <div
      v-show="effectActive"
      class="absolute left-1/2 transform -translate-x-1/2 w-[600px] z-50 overflow-hidden pointer-events-none"
      style="bottom: calc(100% + 30px)"
    >
      <div class="relative w-full">
        <!-- Кнопка закрыть -->
        <button
          @click="closeEffect"
          class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 z-50 pointer-events-auto"
        >
          Закрыть
        </button>

        <img src="/images/main.jpg" alt="Фон" class="w-full h-auto" />

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
    </div>

    <!-- Контент (форма и любой другой контент) -->
    <div class="relative z-10 watcher-form-wrapper">
      <slot name="top" />
      <slot name="form" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, defineProps } from "vue";

const props = defineProps({
  activateEffect: {
    type: Boolean,
    default: true,
  },
});

const effectActive = ref(false);
const curtainOpened = ref(false);
const eyesActive = ref(false);
let curtainSound = null;

watch(effectActive, async (visible) => {
  if (visible) {
    await nextTick();
    curtainSound = new Audio("/sounds/door.mp3");
    curtainSound.volume = 1.0;

    const inputs = document.querySelectorAll(".watcher-form-wrapper input");
    inputs.forEach((input) => {
      input.addEventListener("input", handleInput);
      input.addEventListener("blur", resetEyes);
    });

    setTimeout(() => {
      curtainOpened.value = true;
      curtainSound?.play().catch((err) => {
        console.log("Звук не проигрался:", err);
      });
    }, 50);
  }
});

const handleFocus = () => {
  if (!effectActive.value && props.activateEffect) {
    effectActive.value = true;
  }
};

const handleInput = (e) => {
  if (!eyesActive.value) {
    eyesActive.value = true;
  }
  if (!eyesActive.value) return;

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
  eyesActive.value = false;
};

const closeEffect = () => {
  curtainOpened.value = false;

  curtainSound = new Audio("/sounds/door.mp3");
  curtainSound.volume = 1.0;
  curtainSound.play().catch((err) => {
    console.log("Звук не проигрался (закрытие):", err);
  });

  setTimeout(() => {
    effectActive.value = false;
    eyesActive.value = false;
  }, 2000);
};

onMounted(() => {
  const inputs = document.querySelectorAll(".watcher-form-wrapper input");
  inputs.forEach((input) => {
    input.addEventListener("focus", handleFocus);
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
  animation: spin-reverse 1s linear infinite;
  transform-origin: center center;
}
</style>
