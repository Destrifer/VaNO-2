<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-primary shadow-md">
    <div
      class="max-w-screen-xl mx-auto flex items-center justify-between px-4 md:px-10 py-4"
    >
      <!-- Лого -->
      <NuxtLink to="/" class="font-bold text-md-fluid font-display">
        CentralPrint
      </NuxtLink>

      <!-- Навигация (desktop) -->
      <nav class="hidden md:flex gap-6 items-center">
        <Menu />
      </nav>

      <!-- Контакты (desktop) -->
      <nav
        aria-label="Контакты"
        class="hidden md:flex gap-6 items-center text-sm-fluid"
      >
        <a href="https://t.me/yourbot" target="_blank" aria-label="Telegram">
          <Icon name="simple-icons:telegram" class="text-2xl" />
        </a>
        <a
          href="https://wa.me/79998887766"
          target="_blank"
          aria-label="WhatsApp"
        >
          <Icon name="simple-icons:whatsapp" class="text-2xl" />
        </a>
        <div class="flex items-center gap-2">
          <Icon name="f7:phone-circle-fill" class="text-2xl" />
          <a href="tel:+79998887766" class="font-semibold"
            >+7 (999) 888-77-66</a
          >
        </div>
        <div class="flex items-center gap-2">
          <Icon name="f7:envelope-circle-fill" class="text-2xl" />
          <a href="mailto:info@centralprint.ru" class="font-semibold"
            >info@centralprint.ru</a
          >
        </div>
      </nav>

      <!-- Кнопка Заказать (desktop) -->
      <UiBaseButton
        size="md"
        variant="primary"
        to="/checkout"
        class="hidden md:flex gap-2 items-center uppercase"
      >
        <Icon name="solar:cart-5-outline" class="text-2xl" />
        Заказать
      </UiBaseButton>

      <!-- Бургер (mobile) -->
      <button @click="toggleMenu" class="md:hidden text-3xl">☰</button>
    </div>

    <!-- Бургер-меню -->
    <BurgerMenu :isOpen="menuOpen" @close="toggleMenu" />
  </header>
</template>

<script setup>
import { ref } from "vue";
import { NuxtLink } from "#components";
import Menu from "~/components/Menu.vue";
import BurgerMenu from "~/components/layout/BurgerMenu.vue";

const menuOpen = ref(false);
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>
