<template>
  <section class="text-center py-16 space-y-5">
    <h1 class="text-4xl md:text-6xl font-bold text-text mb-6">
      Добро пожаловать в CentralPrint!
    </h1>
    <ProductCardsGrid
      :list="[
        '/flyers',
        '/booklets',
        '/stickers',
        '/tags',
        '/posters',
        '/certificates',
      ]"
    />
    <!--<ImageCarousel
      :images="[
        '/images/main/1.jpg',
        '/images/main/2.jpg',
        '/images/main/3.jpg',
        '/images/main/4.jpg',
        '/images/main/5.jpg',
        '/images/main/6.jpg',
        '/images/main/7.jpg',
        '/images/main/8.jpg',
        '/images/main/9.jpg',
        '/images/main/10.jpg',
        '/images/main/11.jpg',
        '/images/main/12.jpg',
        '/images/main/13.jpg',
        '/images/main/14.jpg',
        '/images/main/15.jpg',
        '/images/main/16.jpg',
        '/images/main/17.jpg',
        '/images/main/18.jpg',
        '/images/main/19.jpg',
        '/images/main/20.jpg',
        '/images/main/21.jpg',
        '/images/main/22.jpg',
        '/images/main/23.jpg',
      ]"
    />-->
    <div class="columns-1 sm:columns-2 md:columns-3 gap-8 space-y-8">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="break-inside-avoid"
      >
        <ParallaxImage
          :src="img.src"
          :caption="img.caption"
          :aspect="img.aspect"
          :link="img.link"
        />
      </div>
    </div>
    <NuxtLink
      to="/"
      class="inline-block bg-primary text-text font-semibold px-6 py-3 rounded-2xl hover:bg-yellow-400 transition mt-6"
    >
      Перейти в каталог!
    </NuxtLink>
  </section>
</template>

<script setup>
import ImageCarousel from "@/components/ImageCarousel.vue";
import ProductCardsGrid from "~/components/ProductCardsGrid.vue";
const images = [
  {
    src: "/images/main/1.jpg",
    caption: "Команда в сборе",
    aspect: "wide",
    link: "/flyers",
  },
  {
    src: "/images/main/2.jpg",
    caption: "Прототип 2.0",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/3.jpg",
    caption: "Закат над морем",
    aspect: "tall",
    link: "/flyers",
  },
  {
    src: "/images/main/4.jpg",
    caption: "Новое направление",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/5.jpg",
    caption: "Тестирование",
    aspect: "wide",
    link: "/flyers",
  },
  {
    src: "/images/main/6.jpg",
    caption: "Офис в горах",
    aspect: "tall",
    link: "/flyers",
  },
  {
    src: "/images/main/7.jpg",
    caption: "Раннее утро",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/8.jpg",
    caption: "Производство",
    aspect: "wide",
    link: "/flyers",
  },
  {
    src: "/images/main/9.jpg",
    caption: "Промо-кампания",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/10.jpg",
    caption: "Тренинг",
    aspect: "tall",
    link: "/flyers",
  },
  {
    src: "/images/main/11.jpg",
    caption: "Обед на крыше",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/12.jpg",
    caption: "Совещание",
    aspect: "wide",
    link: "/flyers",
  },
  {
    src: "/images/main/13.jpg",
    caption: "Демо-день",
    aspect: "tall",
    link: "/flyers",
  },
  {
    src: "/images/main/14.jpg",
    caption: "Финал хакатона",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/15.jpg",
    caption: "Интервью",
    aspect: "wide",
    link: "/flyers",
  },
  {
    src: "/images/main/16.jpg",
    caption: "Новая локация",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/17.jpg",
    caption: "Встреча партнёров",
    aspect: "tall",
    link: "/flyers",
  },
  {
    src: "/images/main/18.jpg",
    caption: "Конференция",
    aspect: "wide",
    link: "/flyers",
  },
  {
    src: "/images/main/19.jpg",
    caption: "Дорожная карта",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/20.jpg",
    caption: "Результаты",
    aspect: "tall",
    link: "/flyers",
  },
  {
    src: "/images/main/21.jpg",
    caption: "Обратная связь",
    aspect: "square",
    link: "/flyers",
  },
  {
    src: "/images/main/22.jpg",
    caption: "Миссия выполнена",
    aspect: "wide",
    link: "/flyers",
  },
  {
    src: "/images/main/23.jpg",
    caption: "До новых встреч",
    aspect: "square",
    link: "/flyers",
  },
];
</script>
