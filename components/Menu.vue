<script setup>
import { ref } from "vue";

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

const products = [
  { title: "Наклейки", href: "/stickers" },
  { title: "Этикетки", href: "/labels" },
  { title: "Каталоги", href: "/catalogs" },
  { title: "Буклеты", href: "/booklets" },
  { title: "Визитки", href: "/business-cards" },
  { title: "Бирки и воблеры", href: "/tags" },
  { title: "Календари", href: "/calendars" },
  { title: "Листовки и флаеры", href: "/flyers" },
  { title: "Блокноты", href: "/notebooks" },
  { title: "Баннеры", href: "/banners" },
  { title: "Роллапы", href: "/rollups" },
  { title: "Таблички", href: "/signs" },
  { title: "Презентации", href: "/presentations" },
  { title: "Холсты", href: "/canvas" },
  { title: "Плакаты", href: "/posters" },
  { title: "Чертежи", href: "/blueprints" },
  { title: "Грамоты", href: "/certificates" },
  { title: "Благодарности", href: "/gratitudes" },
  { title: "Сертификаты", href: "/licenses" },
  { title: "Хенгеры", href: "/hangers" },
  { title: "Бланки", href: "/forms" },
  { title: "Бейджи", href: "/badges" },
  { title: "Ценники", href: "/pricetags" },
  { title: "Открытки", href: "/cards" },
  { title: "Конверты", href: "/envelopes" },
  { title: "Пригласительные", href: "/invites" },
  { title: "Брошюры", href: "/brochures" },
  { title: "Меню", href: "/menu" },
  { title: "Журналы", href: "/magazines" },
  { title: "Лифлеты", href: "/leaflets" },
  { title: "Документация", href: "/docs" },
  { title: "Билеты", href: "/tickets" },
  { title: "Купоны", href: "/coupons" },
  { title: "Тетради", href: "/notebooks2" },
];
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
          class="hover:text-primary"
        >
          {{ item.title }}
        </NuxtLink>
      </div>
    </div>

    <!-- Остальные пункты -->
    <NuxtLink to="/delivery">Доставка и оплата</NuxtLink>
    <NuxtLink to="/about">Контакты</NuxtLink>
  </nav>
</template>
