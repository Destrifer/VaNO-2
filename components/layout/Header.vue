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

        <a
          href="tel:+79998887766"
          class="flex items-center gap-2 group hover-scale"
        >
          <Icon name="f7:phone-circle-fill" size="36" />
          <span class="hidden xl:inline font-semibold">+7 (999) 888-77-66</span>
        </a>

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
        class="relative hidden sm:flex gap-2 items-center uppercase ml-4 bg-text text-primary py-2 px-4 rounded-full font-semibold hover:bg-danger transition hover-scale"
      >
        <Icon name="solar:cart-5-outline" size="24" />
        Заказать
        <span
          v-if="cartCount > 0"
          class="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
        >
          {{ cartCount }}
        </span>
      </NuxtLink>

      <!-- Круглая иконка (мобайл) -->
      <NuxtLink
        to="/checkout"
        class="relative flex sm:hidden items-center justify-center bg-text text-primary w-9 h-9 rounded-full hover:bg-danger transition hover-scale"
        aria-label="Заказать"
      >
        <Icon name="solar:cart-5-outline" size="20" />
        <span
          v-if="cartCount > 0"
          class="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
        >
          {{ cartCount }}
        </span>
      </NuxtLink>

      <!-- Бургер -->
      <button @click="toggleMenu" class="md:hidden text-3xl ml-4 hover-scale">
        ☰
      </button>
    </div>

    <BurgerMenu :isOpen="menuOpen" @close="toggleMenu" />
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "~/stores/cart";
import Menu from "~/components/Menu.vue";
import BurgerMenu from "~/components/layout/BurgerMenu.vue";

const menuOpen = ref(false);
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

const cart = useCartStore();
const cartCount = computed(() => cart.items.length);
</script>
