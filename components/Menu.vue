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
  }, 200); // задержка на закрытие
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
  <nav
    class="hidden md:flex gap-[clamp(1rem,2cqw,9rem)] font-semibold text-[clamp(1rem,1cqw,9rem)] relative"
  >
    <!-- Продукция с выпадающим -->
    <div class="relative" @mouseenter="open" @mouseleave="close">
      <div class="cursor-pointer hover:text-link">Продукция</div>

      <div
        v-if="showDropdown"
        class="absolute left-0 top-full mt-2 bg-white shadow-lg p-4 rounded-xl w-[min(100vw,60rem)] grid grid-cols-3 gap-4 z-50 text-sm"
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
    <NuxtLink to="#" class="hover:text-link">Фото работ</NuxtLink>
    <NuxtLink to="#" class="hover:text-link">Доставка</NuxtLink>
    <NuxtLink to="#" class="hover:text-link">О нас</NuxtLink>
  </nav>
</template>
