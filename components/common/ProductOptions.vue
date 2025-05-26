<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  diameter: Number,
  width: Number,
  height: Number,
  material: String,
  lamination: String,
  useLamination: Boolean,
  useFoil: Boolean,
  foilColor: String,
  materials: Array,
  laminations: Object,
  printMode: String,
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
]);

// 🔁 Проксированные v-model поля
const materialProxy = ref(props.material);
const laminationProxy = ref(props.lamination);
const printModeProxy = ref(props.printMode);
const useLaminationProxy = ref(props.useLamination);
const useFoilProxy = ref(props.useFoil);
const foilColorProxy = ref(props.foilColor);

// 🔁 Слежение и синхронизация с emit
watch(materialProxy, (val) => emit("update:material", val));
watch(
  () => props.material,
  (val) => (materialProxy.value = val)
);

watch(laminationProxy, (val) => emit("update:lamination", val));
watch(
  () => props.lamination,
  (val) => (laminationProxy.value = val)
);

watch(printModeProxy, (val) => emit("update:printMode", val));
watch(
  () => props.printMode,
  (val) => (printModeProxy.value = val)
);

watch(useLaminationProxy, (val) => emit("update:useLamination", val));
watch(
  () => props.useLamination,
  (val) => (useLaminationProxy.value = val)
);

watch(useFoilProxy, (val) => emit("update:useFoil", val));
watch(
  () => props.useFoil,
  (val) => (useFoilProxy.value = val)
);

watch(foilColorProxy, (val) => emit("update:foilColor", val));
watch(
  () => props.foilColor,
  (val) => (foilColorProxy.value = val)
);
</script>

<template>
  <div class="space-y-4">
    <!-- Размер изделия -->
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
      <label class="block">
        Ширина (мм):
        <input
          type="number"
          min="1"
          class="mt-1 border px-2 py-1 w-full"
          :value="width"
          @input="emit('update:width', +$event.target.value)"
        />
      </label>

      <label class="block">
        Высота (мм):
        <input
          type="number"
          min="1"
          class="mt-1 border px-2 py-1 w-full"
          :value="height"
          @input="emit('update:height', +$event.target.value)"
        />
      </label>

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
            <option v-for="(price, key) in laminations" :key="key" :value="key">
              {{ key }} — {{ price }}₽
            </option>
          </select>
        </label>
      </div>
    </div>

    <!-- Фольгирование -->
    <div class="block">
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="useFoilProxy" />
        Добавить фольгирование
      </label>
    </div>
  </div>
</template>
