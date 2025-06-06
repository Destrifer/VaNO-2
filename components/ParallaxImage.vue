<template>
  <div
    ref="tiltRef"
    class="w-full h-[300px] bg-cover bg-center relative mx-auto my-4"
    data-tilt
    data-tilt-max="20"
    data-tilt-scale="1.05"
    data-tilt-speed="500"
    data-tilt-perspective="1000"
    :style="tiltStyle"
  >
    <!-- Парящий текст -->
    <h2
      class="absolute left-1/2 bottom-[30%] -translate-x-1/2 text-black text-lg font-bold"
      style="transform: translateZ(50px)"
    >
      {{ caption }}
    </h2>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import VanillaTilt from "vanilla-tilt";

const props = defineProps({
  src: { type: String, required: true },
  caption: { type: String, default: "" },
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
