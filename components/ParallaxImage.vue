<template>
  <div
    ref="tiltRef"
    class="mb-4 rounded-xl border border-gray-200 shadow-md bg-white overflow-hidden break-inside-avoid"
    data-tilt
    data-tilt-glare="true"
    data-tilt-max-glare="0.4"
    data-tilt-scale="1.05"
    data-tilt-speed="500"
  >
    <div
      :class="aspectClass"
      class="w-full relative transform-style preserve-3d"
      style="transform: perspective(1000px)"
    >
      <img
        :src="src"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div
        v-if="caption"
        class="absolute left-1/2 bottom-[20%] translate-x-[-50%] z-10"
        style="transform: translateZ(20px)"
      >
        <div
          class="text-black text-lg font-bold bg-white/80 px-4 py-2 rounded shadow backdrop-blur-sm"
        >
          {{ caption }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import VanillaTilt from "vanilla-tilt";

const props = defineProps({
  src: { type: String, required: true },
  caption: { type: String, default: "" },
  aspect: { type: String, default: "square" }, // square | wide | tall
});

const tiltRef = ref(null);

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

onMounted(() => {
  if (tiltRef.value) {
    VanillaTilt.init(tiltRef.value, {
      max: 5,
      speed: 500,
      scale: 1.05,
      glare: true,
      "max-glare": 0.4,
      gyroscope: true,
    });
  }
});
</script>

<style scoped>
.transform-style {
  transform-style: preserve-3d;
}
</style>
