<template>
  <div class="max-w-xl mx-auto mt-8 relative overflow-visible">
    <!-- Блок с контактами -->
    <div
      ref="contactsBlock"
      class="relative transition-transform duration-500"
      :class="{
        'absolute left-0 right-0 z-30': effectActive,
        '-translate-y-[620px]': effectActive,
      }"
    >
      <h2 class="text-2xl font-semibold mb-4">Связаться с нами</h2>
      <ul class="space-y-2 mb-8">
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
      <ul class="space-y-2 mb-8">
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
      <ul class="space-y-2 mb-8">
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
      <ul class="space-y-2 mb-8">
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
      <ul class="space-y-2 mb-8">
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
    </div>

    <!-- Эффект с персонажами (появляется при активации) -->
    <div
      v-show="effectActive"
      class="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] origin-top z-20 overflow-hidden transition-opacity duration-500"
    >
      <!-- Кнопка закрыть -->
      <button
        @click="closeEffect"
        class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 z-30"
      >
        Закрыть
      </button>

      <div class="relative w-full overflow-hidden">
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

    <!-- Форма -->
    <form class="space-y-4 mt-8 relative z-10">
      <input
        type="text"
        placeholder="Имя"
        class="border px-4 py-2 block w-full"
      />
      <input
        type="email"
        placeholder="Email"
        class="border px-4 py-2 block w-full"
      />
      <input
        type="password"
        placeholder="Пароль"
        class="border px-4 py-2 block w-full"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";

const effectActive = ref(false);
const curtainOpened = ref(false);
const eyesActive = ref(false);
let curtainSound = null;

watch(effectActive, async (visible) => {
  if (visible) {
    await nextTick();
    curtainSound = new Audio("/sounds/door.mp3");
    curtainSound.volume = 1.0;

    // Навешиваем обработчики для глаз
    document.querySelectorAll("form input").forEach((input) => {
      input.addEventListener("input", handleInput);
      input.addEventListener("blur", resetEyes);
    });

    // Открытие: звук + шторка
    setTimeout(() => {
      curtainOpened.value = true;
      curtainSound?.play().catch((err) => {
        console.log("Звук не проигрался:", err);
      });
    }, 50);
  }
});

const handleFocus = () => {
  if (!effectActive.value) {
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
  // Закрытие: запускаем шторку вниз + звук
  curtainOpened.value = false;

  curtainSound = new Audio("/sounds/door.mp3");
  curtainSound.volume = 1.0;
  curtainSound.play().catch((err) => {
    console.log("Звук не проигрался (закрытие):", err);
  });

  // Ждём окончания шторки (2 сек), затем скрываем всё
  setTimeout(() => {
    effectActive.value = false;
    eyesActive.value = false;
  }, 2000);
};

onMounted(() => {
  document.querySelectorAll("form input").forEach((input) => {
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
