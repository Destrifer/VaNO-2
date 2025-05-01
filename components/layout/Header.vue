<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-primary shadow-md">
    <div
      class="max-w-screen-xl mx-auto flex items-center justify-between px-4 md:px-10 py-4"
    >
      <!-- Лого или текст -->
      <div class="flex items-center">
        <NuxtLink to="/" class="lg:hidden hover-scale">
          <img src="/logo.svg" class="w-10 h-10" alt="Logo" />
        </NuxtLink>
        <NuxtLink
          to="/"
          class="hidden lg:block font-bold text-md-fluid font-display hover-scale"
        >
          CentralPrint
        </NuxtLink>
      </div>

      <!-- Навигация -->
      <nav class="hidden sm:flex gap-6 items-center">
        <Menu />
      </nav>

      <!-- Контакты -->
      <nav aria-label="Контакты" class="flex gap-4 items-center text-sm-fluid">
        <a
          href="https://t.me/yourbot"
          class="flex items-center hover-scale"
          target="_blank"
          aria-label="Telegram"
        >
          <Icon name="simple-icons:telegram" size="30" />
        </a>
        <a
          href="https://wa.me/79998887766"
          class="flex items-center hover-scale"
          target="_blank"
          aria-label="WhatsApp"
        >
          <Icon name="simple-icons:whatsapp" size="30" />
        </a>

        <!-- Телефон -->
        <a
          href="tel:+79998887766"
          class="flex items-center gap-2 group hover-scale"
        >
          <Icon name="f7:phone-circle-fill" size="36" />
          <span class="hidden xl:inline font-semibold">+7 (999) 888-77-66</span>
        </a>

        <!-- Почта -->
        <a
          href="mailto:info@centralprint.ru"
          class="flex items-center gap-2 group hover-scale"
        >
          <Icon name="f7:envelope-circle-fill" size="36" />
          <span class="hidden xl:inline font-semibold"
            >info@centralprint.ru</span
          >
        </a>
      </nav>

      <!-- Кнопка с текстом (ПК) -->
      <NuxtLink
        to="/checkout"
        class="hidden sm:flex gap-2 items-center uppercase ml-4 bg-text text-primary py-2 px-4 rounded-full font-semibold hover:bg-danger transition hover-scale"
      >
        <Icon name="solar:cart-5-outline" size="24" />
        Заказать
      </NuxtLink>

      <!-- Круглая иконка (мобайл) -->
      <NuxtLink
        to="/checkout"
        class="flex sm:hidden items-center justify-center bg-text text-primary w-9 h-9 rounded-full hover:bg-danger transition hover-scale"
        aria-label="Заказать"
      >
        <Icon name="solar:cart-5-outline" size="20" />
      </NuxtLink>

      <!-- Бургер -->
      <button @click="toggleMenu" class="md:hidden text-3xl ml-4 hover-scale">
        ☰
      </button>
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
