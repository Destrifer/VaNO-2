<template>
  <div
    ref="tiltRef"
    class="w-[400px] h-[300px] mx-auto mt-20 text-black flex items-center justify-center bg-cover bg-center"
    data-tilt
    data-tilt-max="25"
    data-tilt-scale="1.05"
    data-tilt-speed="500"
    data-tilt-perspective="1000"
    :style="tiltStyle"
  >
    <h1 style="transform: translateZ(50px); font-size: 2rem">
      {{ caption }}
    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import VanillaTilt from "vanilla-tilt";

const props = defineProps({
  src: { type: String, required: true },
  caption: { type: String, default: "vanilla-tilt.js" },
});

const tiltRef = ref(null);

onMounted(() => {
  if (tiltRef.value) {
    VanillaTilt.init(tiltRef.value);
  }
});

const tiltStyle = computed(() => ({
  backgroundImage: `url(${props.src})`,
  transformStyle: "preserve-3d",
}));
</script>
