// components/ImageCarousel.vue
<script setup>
import { ref, onMounted, nextTick } from "vue";
import emblaCarousel from "embla-carousel";
import { NuxtImg } from "#components";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const emblaRef = ref(null);
const embla = ref(null);

onMounted(async () => {
  await nextTick();
  if (emblaRef.value && !embla.value) {
    embla.value = emblaCarousel(emblaRef.value, {
      loop: true,
    });
  }
});
</script>

<template>
  <div ref="emblaRef" class="overflow-hidden">
    <div class="flex">
      <div v-for="img in images" :key="img" class="flex-[0_0_100%] px-2">
        <NuxtImg
          :src="img"
          format="webp"
          sizes="sm:100vw md:50vw lg:33vw"
          quality="75"
          class="w-full h-auto object-cover rounded-xl"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>
