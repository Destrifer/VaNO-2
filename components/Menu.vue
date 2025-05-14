<script setup>
import { ref } from "vue";
import { products } from "~/assets/products.js";

const showDropdown = ref(false);
let timeout;

const open = () => {
  clearTimeout(timeout);
  showDropdown.value = true;
};

const close = () => {
  timeout = setTimeout(() => {
    showDropdown.value = false;
  }, 150);
};
</script>

<template>
  <nav class="hidden md:flex gap-6 font-semibold text-sm-fluid relative">
    <!-- Продукция с выпадающим -->
    <div class="relative" @mouseenter="open" @mouseleave="close">
      <div class="cursor-pointer hover:text-danger">Продукция</div>
      <div
        v-if="showDropdown"
        class="absolute left-0 top-full mt-2 bg-white shadow-lg p-4 rounded-xl w-[min(100vw,70rem)] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 z-50 max-h-[60vh] overflow-y-auto"
      >
        <NuxtLink
          v-for="item in products"
          :key="item.title"
          :to="item.href"
          class="flex items-center gap-2"
        >
          <img
            :src="item.icon"
            alt="icon"
            class="w-5 h-5 object-contain"
            v-if="item.icon"
          />
          {{ item.title }}
        </NuxtLink>
      </div>
    </div>

    <!-- Остальные пункты -->
    <NuxtLink to="/delivery">Доставка и оплата</NuxtLink>
    <NuxtLink to="/contacts">Контакты</NuxtLink>
  </nav>
</template>
