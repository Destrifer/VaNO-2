<script setup>
import { ref, watch } from "vue";
import settings from "@/assets/settings_print.json";

const props = defineProps({
  diameter: Number,
  width: Number,
  height: Number,
  material: String,
  lamination: String,
  useLamination: Boolean,
  useFoil: Boolean,
  foilColor: String,
  printMode: String,
  isComplexShape: Boolean, // 👈 добавлено
  materials: Array,
  laminations: Object,
  enabledOptions: {
    type: Object,
    default: () => ({
      lamination: true,
      foil: true,
    }),
  },
  availableSizes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "update:diameter",
  "update:width",
  "update:height",
  "update:material",
  "update:lamination",
  "update:useLamination",
  "update:useFoil",
  "update:foilColor",
  "update:printMode",
  "update:isComplexShape", // 👈 добавлено
]);

// Прокси-поля
const materialProxy = ref(props.material);
const laminationProxy = ref(props.lamination);
const printModeProxy = ref(props.printMode);
const useLaminationProxy = ref(props.useLamination);
const useFoilProxy = ref(props.useFoil);
const foilColorProxy = ref(props.foilColor);
const isComplexShapeProxy = ref(props.isComplexShape); // 👈 добавлено

const selectedFormat = ref("Custom");

// watchers props -> ref
watch(
  () => props.material,
  (val) => (materialProxy.value = val)
);
watch(
  () => props.lamination,
  (val) => (laminationProxy.value = val)
);
watch(
  () => props.printMode,
  (val) => (printModeProxy.value = val)
);
watch(
  () => props.useLamination,
  (val) => (useLaminationProxy.value = val)
);
watch(
  () => props.useFoil,
  (val) => (useFoilProxy.value = val)
);
watch(
  () => props.foilColor,
  (val) => (foilColorProxy.value = val)
);
watch(
  () => props.isComplexShape,
  (val) => (isComplexShapeProxy.value = val)
); // 👈

watch(materialProxy, (val) => emit("update:material", val));
watch(laminationProxy, (val) => emit("update:lamination", val));
watch(printModeProxy, (val) => emit("update:printMode", val));
watch(useLaminationProxy, (val) => emit("update:useLamination", val));
watch(useFoilProxy, (val) => emit("update:useFoil", val));
watch(foilColorProxy, (val) => emit("update:foilColor", val));
watch(isComplexShapeProxy, (val) => emit("update:isComplexShape", val)); // 👈

// попытка установить формат
watch(
  () => [props.width, props.height],
  ([w, h]) => {
    for (const key of props.availableSizes) {
      const size = settings.sizes[key];
      if (size && size.width === w && size.height === h) {
        selectedFormat.value = key;
        return;
      }
    }
    selectedFormat.value = "Custom";
  },
  { immediate: true }
);

watch(selectedFormat, (val) => {
  if (val !== "Custom" && settings.sizes[val]) {
    emit("update:width", settings.sizes[val].width);
    emit("update:height", settings.sizes[val].height);
  }
});
</script>

<template>
  <div class="space-y-4">
    <!-- Диаметр -->
    <template v-if="diameter !== undefined">
      <label class="block">
        Диаметр (мм):
        <input
          type="number"
          min="1"
          class="mt-1 border px-2 py-1 w-full"
          :value="diameter"
          @input="emit('update:diameter', +$event.target.value)"
        />
      </label>
    </template>

    <template v-else>
      <!-- Форматы -->
      <label class="block" v-if="availableSizes.length">
        Формат:
        <select v-model="selectedFormat" class="mt-1 border px-2 py-1 w-full">
          <option v-for="key in availableSizes" :key="key" :value="key">
            {{ key }}
          </option>
          <option value="Custom">Свой размер</option>
        </select>
      </label>

      <!-- Сложная форма -->
      <label class="block text-sm">
        <input type="checkbox" v-model="isComplexShapeProxy" class="mr-2" />
        Сложная форма (облако, вырубка и т.п.)
      </label>

      <!-- Ширина × Высота -->
      <template v-if="selectedFormat === 'Custom' || !availableSizes.length">
        <label class="block">
          Размер (мм):
          <div class="mt-1 flex items-center gap-2">
            <input
              type="number"
              min="1"
              class="border px-2 py-1 w-24"
              :value="width"
              @input="emit('update:width', +$event.target.value)"
            />
            <span>×</span>
            <input
              type="number"
              min="1"
              class="border px-2 py-1 w-24"
              :value="height"
              @input="emit('update:height', +$event.target.value)"
            />
            <span>мм</span>
          </div>
        </label>
      </template>

      <!-- Печать -->
      <label class="block">
        Печать:
        <select class="mt-1 border px-2 py-1 w-full" v-model="printModeProxy">
          <option value="4+0">4+0</option>
          <option value="4+4">4+4</option>
        </select>
      </label>
    </template>

    <!-- Материал -->
    <label class="block">
      Материал:
      <select class="mt-1 border px-2 py-1 w-full" v-model="materialProxy">
        <option
          v-for="item in materials"
          :key="item.name"
          :value="item.name"
          :disabled="item.disabled"
        >
          {{ item.name }}
        </option>
      </select>
    </label>

    <!-- Ламинация -->
    <template v-if="enabledOptions.lamination">
      <div class="block">
        <label class="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            v-model="useLaminationProxy"
            :disabled="useFoilProxy"
          />
          Добавить ламинацию
        </label>

        <div v-if="useLaminationProxy">
          <label class="block">
            Тип ламинации:
            <select
              class="mt-1 border px-2 py-1 w-full"
              v-model="laminationProxy"
              :disabled="useFoilProxy"
            >
              <option
                v-for="(price, key) in laminations"
                :key="key"
                :value="key"
              >
                {{ key }} — {{ price }}₽
              </option>
            </select>
          </label>
        </div>
      </div>
    </template>

    <!-- Фольгирование -->
    <template v-if="enabledOptions.foil">
      <div class="block">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="useFoilProxy" />
          Добавить фольгирование
        </label>
      </div>
    </template>
  </div>
</template>
