<template>
  <a
    :href="src"
    data-fancybox="gallery"
    :data-caption="captionHtml"
    class="w-full relative mx-auto my-4 block rounded-xl shadow-md border border-gray-200 cursor-pointer overflow-hidden"
    :class="aspectClass"
  >
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
      <!-- Изображение -->
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

      <!-- Подпись на превью -->
      <div
        class="absolute left-1/2 bottom-[10%] -translate-x-1/2 pointer-events-none group"
        style="transform: translateZ(50px)"
      >
        <div
          class="px-3 py-1.5 rounded-md border border-black bg-[#ffd600cc] shadow-md backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg"
        >
          <div
            class="text-xl font-bold text-black text-center"
            style="
              -webkit-text-stroke: 0.3px white;
              text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5),
                2px 2px 2px rgba(0, 0, 0, 0.2);
            "
          >
            {{ caption }}
          </div>
        </div>
      </div>
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
  link: { type: String, default: "" },
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

const captionHtml = computed(() => {
  if (!props.link) return props.caption;
  return `
    <div class="fancybox-caption-custom">
      <div class="caption-text">${props.caption}</div>
      <a href="${props.link}" class="caption-button" target="_blank">Рассчитать стоимость</a>
    </div>
  `;
});
</script>

<style>
/* Fancybox caption поверх картинки */
.fancybox-caption-custom {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 1000;
  width: 100%;
}

.caption-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 4px black;
  margin-bottom: 1rem;
}

.caption-button {
  display: inline-block;
  background: #ffd600cc;
  color: #000;
  padding: 0.5rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.caption-button:hover {
  background: #e6c200;
}
</style>
