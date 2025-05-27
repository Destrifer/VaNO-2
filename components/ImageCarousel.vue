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
        <div class="aspect-[16/9] w-full overflow-hidden rounded-xl">
          <NuxtImg
            :src="img"
            format="avif,webp,jpg"
            quality="70"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            densities="1x 2x"
            class="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </a>
    </div>
  </div>
</template>
