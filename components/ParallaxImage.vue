<template>
  <a
    :href="src"
    data-fancybox="gallery"
    class="w-full relative mx-auto my-4 block rounded-xl shadow-md border border-gray-200"
    :class="aspectClass"
  >
    <!-- Tilt wrapper -->
    <div
      ref="tiltRef"
      class="w-full h-full"
      :style="tiltStyle"
      data-tilt
      data-tilt-max="5"
      data-tilt-scale="1.05"
      data-tilt-speed="500"
      data-tilt-perspective="1000"
      style="transform-style: preserve-3d"
    >
      <!-- Изображение через NuxtImg -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <NuxtImg
          :src="src"
          format="avif,webp,jpg"
          quality="70"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          densities="1x 2x"
          class="w-full h-full object-cover"
          loading="lazy"
          alt=""
        />
      </div>

      <!-- Подпись с эффектом парения -->
      <h2
        class="absolute left-1/2 bottom-[10%] -translate-x-1/2 text-3xl font-extrabold text-black text-center pointer-events-none"
        style="
          transform: translateZ(50px);
          -webkit-text-stroke: 1px white;
          text-shadow: 1px 1px 0 #fff, 2px 2px 0 #bbb,
            3px 3px 1px rgba(0, 0, 0, 0.2);
        "
      >
        {{ caption }}
      </h2>
    </div>
  </a>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import VanillaTilt from "vanilla-tilt";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { NuxtImg } from "#components";

const props = defineProps({
  src: { type: String, required: true },
  caption: { type: String, default: "" },
  aspect: { type: String, default: "square" }, // square | wide | tall
});

const tiltRef = ref(null);

onMounted(() => {
  if (tiltRef.value) {
    VanillaTilt.init(tiltRef.value);
  }

  Fancybox.bind("[data-fancybox='gallery']", {
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

const tiltStyle = computed(() => ({
  transformStyle: "preserve-3d",
}));

const aspectClass = computed(() => {
  switch (props.aspect) {
    case "wide":
      return "aspect-[2/1]";
    case "tall":
      return "aspect-[3/4]";
    default:
      return "aspect-square";
  }
});
</script>
