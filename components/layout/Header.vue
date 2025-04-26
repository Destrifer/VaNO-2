<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-primary shadow-md">
    <div
      class="w-full flex items-center justify-between px-[2cqw] md:px-[10cqw] py-[2cqw] md:py-[1cqw]"
    >
      <!-- Лого -->
      <span class="font-bold text-medium font-display">CentralPrint</span>

      <!-- Навигация (desktop) -->
      <Menu class="hidden md:flex" />

      <!-- Контакты + кнопка (desktop) -->
      <nav class="hidden md:flex gap-[clamp(1rem,1.5cqw,9rem)] items-center">
        <Icon
          name="simple-icons:telegram"
          class="text-[clamp(1rem,1.5cqw,9rem)]"
        />
        <Icon
          name="simple-icons:whatsapp"
          class="text-[clamp(1rem,1.5cqw,9rem)]"
        />
        <div class="flex items-center gap-2">
          <Icon
            name="f7:phone-circle-fill"
            class="text-[clamp(1rem,2cqw,9rem)]"
          />
          <a
            href="tel:+79998887766"
            class="text-[clamp(1rem,1cqw,9rem)] font-semibold"
            >+7 (999) 888-77-66</a
          >
        </div>
        <div class="flex items-center gap-2">
          <Icon
            name="f7:envelope-circle-fill"
            class="text-[clamp(1rem,2cqw,9rem)]"
          />
          <a
            href="mailto:info@centralprint.ru"
            class="text-[clamp(1rem,1cqw,9rem)] font-semibold"
            >info@centralprint.ru</a
          >
        </div>
      </nav>

      <!-- Кнопка Заказать -->
      <a
        href="/checkout"
        class="bg-bone hidden md:flex items-center uppercase font-semibold text-text px-[clamp(1rem,1cqw,9rem)] py-[clamp(0.5rem,0.5cqw,9rem)] text-[clamp(1rem,1cqw,9rem)] rounded-4xl gap-[clamp(1rem,0.5cqw,9rem)]"
      >
        <Icon
          name="solar:cart-5-outline"
          class="text-[clamp(1rem,1.5cqw,9rem)] text-text"
        />
        Заказать
      </a>

      <!-- Бургер (mobile) -->
      <button @click="menuOpen = !menuOpen" class="md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Меню (mobile) -->
    <div v-if="menuOpen" class="md:hidden px-4 pb-4">
      <Menu mobile />
      <button
        class="myfont mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-[2cqw] px-[2cqw] rounded"
      >
        Заказать
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import Menu from "~/components/Menu.vue";

const menuOpen = ref(false);
</script>

<style scoped>
html {
  scroll-padding-top: 64px;
}
.myfont {
  font-family: "Verdana", sans-serif;
  font-weight: 700;
}
</style>
