<script setup>
import { ref } from "vue";
import { NuxtImg } from "#components";
import settings from "~/assets/settings.json";

const props = defineProps({
  foilColor: String,
});
const emit = defineEmits(["update:foilColor"]);

const foilColors = settings.foil_colors;

const previewingColor = ref(null);

const selectColor = (color) => {
  emit("update:foilColor", color);
  previewingColor.value = color === previewingColor.value ? null : color;
};
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-gray-800">Цвет фольги</h3>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div
        v-for="(img, color) in foilColors"
        :key="color"
        class="relative cursor-pointer border rounded-md p-2 flex flex-col items-center"
        :class="
          foilColor === color
            ? 'border-blue-500 ring-2 ring-blue-300'
            : 'border-gray-300'
        "
        @click="selectColor(color)"
      >
        <!-- Тултип сверху -->
        <div
          v-if="previewingColor === color"
          class="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-3"
        >
          <div
            class="relative bg-white border rounded shadow-xl p-2 w-[200px] sm:w-[400px]"
          >
            <!-- Кнопка закрытия -->
            <button
              class="absolute top-0 right-2 text-4xl text-white hover:text-black hover:cursor-pointer"
              @click.stop="previewingColor = null"
              aria-label="Закрыть предпросмотр"
            >
              &times;
            </button>
            <NuxtImg
              :src="img"
              alt="Предпросмотр фольги"
              width="400"
              height="400"
              format="avif,webp,jpg"
              class="rounded object-cover w-full h-auto"
            />
          </div>
        </div>

        <NuxtImg
          :src="img"
          alt="Цвет фольги"
          width="80"
          height="80"
          format="avif,webp,jpg"
          class="rounded object-cover"
        />
        <span class="text-xs text-center mt-1 text-gray-700">{{ color }}</span>
      </div>
    </div>
  </div>
</template>
