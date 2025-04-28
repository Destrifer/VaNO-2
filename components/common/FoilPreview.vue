<script setup>
import { NuxtImg } from "#components";
import settings from "~/assets/settings.json";

const props = defineProps({
  foilColor: String,
});

const emit = defineEmits(["update:foilColor"]);

const foilColors = settings.foil_colors;

const selectColor = (color) => {
  emit("update:foilColor", color);
};
</script>

<template>
  <div class="space-y-4 mt-4">
    <h3 class="text-lg font-semibold">Выберите цвет фольги:</h3>

    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="(img, color) in foilColors"
        :key="color"
        class="cursor-pointer border rounded p-2 flex flex-col items-center"
        :class="foilColor === color ? 'border-blue-500' : 'border-gray-300'"
        @click="selectColor(color)"
      >
        <NuxtImg
          :src="img"
          alt=""
          width="80"
          height="80"
          format="avif,webp,jpg"
          class="rounded mb-2 object-cover"
        />
        <span class="text-sm text-center">{{ color }}</span>
      </div>
    </div>

    <div class="mt-6">
      <h4 class="text-md font-medium mb-2">Предпросмотр выбранной фольги:</h4>
      <NuxtImg
        :src="foilColors[foilColor]"
        alt="Выбранная фольга"
        width="400"
        height="400"
        format="avif,webp,jpg"
        class="rounded shadow object-cover"
      />
    </div>
  </div>
</template>
