<template>
  <section class="text-center py-16 space-y-5">
    <h1 class="text-4xl md:text-6xl font-bold text-text mb-6">
      Добро пожаловать в CentralPrint1
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
    <ImageCarousel
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
    />
    <div class="columns-1 sm:columns-2 md:columns-3 gap-8">
      <ParallaxImage
        v-for="(img, i) in images"
        :key="i"
        :src="img.src"
        :aspect="img.aspect"
        :caption="`Фото #${i + 1}`"
      />
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
  { src: "/images/main/1.jpg", aspect: "square" },
  { src: "/images/main/2.jpg", aspect: "wide" },
  { src: "/images/main/3.jpg", aspect: "tall" },
  { src: "/images/main/4.jpg", aspect: "square" },
  { src: "/images/main/5.jpg", aspect: "wide" },
  { src: "/images/main/6.jpg", aspect: "tall" },
  { src: "/images/main/7.jpg", aspect: "square" },
  { src: "/images/main/8.jpg", aspect: "square" },
  { src: "/images/main/9.jpg", aspect: "wide" },
  { src: "/images/main/10.jpg", aspect: "tall" },
];
</script>
