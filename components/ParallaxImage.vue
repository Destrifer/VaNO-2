<template>
  <a :href="src" data-fancybox="gallery">
    <div
      ref="tiltRef"
      class="w-full relative mx-auto my-4 rounded-xl shadow-md border border-gray-200 cursor-pointer overflow-hidden"
      :class="aspectClass"
      data-tilt
      data-tilt-max="3"
      data-tilt-scale="1.03"
      data-tilt-speed="500"
      data-tilt-perspective="500"
      style="transform-style: preserve-3d"
    >
      <!-- Оптимизированное изображение -->
      <NuxtImg
        :src="src"
        format="avif,webp,jpg"
        quality="70"
        loading="lazy"
        densities="1x 2x"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        class="absolute inset-0 w-full h-full object-cover object-center"
      />

      <!-- Парящий текст -->
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
import { ref, onMounted, computed, nextTick } from "vue";
import VanillaTilt from "vanilla-tilt";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { NuxtImg } from "#components";

const props = defineProps({
  src: { type: String, required: true },
  caption: { type: String, default: "" },
  aspect: { type: String, default: "square" },
});

const tiltRef = ref(null);

onMounted(async () => {
  if (tiltRef.value) {
    VanillaTilt.init(tiltRef.value);
  }

  await nextTick();

  Fancybox.bind("[data-fancybox=gallery]", {
    Thumbs: false,
    Toolbar: false,
    animated: false,
    dragToClose: true,
    idle: false,
    zoom: false,
    Carousel: {
      transition: "fade",
    },
  });
});

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
