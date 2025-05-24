<script setup>
import { ref, onMounted, nextTick } from "vue";
import emblaCarousel from "embla-carousel";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
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

  Fancybox.bind("[data-fancybox=gallery]", {
    Thumbs: false,
    Toolbar: false,
    animated: false,
    dragToClose: true,
    click: false,
    idle: false,
    zoom: false,
    Carousel: {
      transition: "fade",
    },
  });
});
</script>

<template>
  <div ref="emblaRef" class="overflow-hidden">
    <div class="flex">
      <a
        v-for="(img, index) in images"
        :key="index"
        :href="img"
        data-fancybox="gallery"
        class="basis-1/2 sm:basis-1/3 lg:basis-1/4 shrink-0 px-2"
      >
        <NuxtImg
          :src="img"
          format="webp"
          sizes="sm:100vw md:50vw lg:25vw"
          quality="75"
          class="w-full h-auto object-cover rounded-xl"
          loading="lazy"
        />
      </a>
    </div>
  </div>
</template>
