<template>
  <section class="text-center py-16">
    <h1 class="text-4xl md:text-6xl font-bold text-text mb-6">
      Добро пожаловать в CentralPrint
    </h1>

    <ImageCarousel
      :images="[
        '/images/products/business-cards/pexels-francesco-ungaro-1525041.jpg',
        '/images/products/business-cards/pexels-lilartsy-1213447.jpg',
        '/images/products/business-cards/pexels-maoriginalphotography-1485894.jpg',
        '/images/products/business-cards/pexels-simon73-1183099.jpg',
        '/images/products/business-cards/pexels-steve-1266808.jpg',
      ]"
    />

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
</script>
