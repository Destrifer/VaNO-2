<script setup>
const props = defineProps({
  diameter: Number,
  material: String,
  lamination: String,
  useLamination: Boolean,
  useFoil: Boolean,
  foilColor: String,
  materials: Array, // [{ name, price, disabled }]
  laminations: Object, // { key: price }
});

const emit = defineEmits([
  "update:diameter",
  "update:material",
  "update:lamination",
  "update:useLamination",
  "update:useFoil",
  "update:foilColor",
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Диаметр -->
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

    <!-- Материал -->
    <label class="block">
      Материал:
      <select
        class="mt-1 border px-2 py-1 w-full"
        :value="material"
        @change="emit('update:material', $event.target.value)"
      >
        <option
          v-for="item in materials"
          :key="item.name"
          :value="item.name"
          :disabled="item.disabled"
          :class="{ 'opacity-50': item.disabled }"
        >
          {{ item.name }} — {{ item.price }}₽
        </option>
      </select>
    </label>

    <!-- Ламинация -->
    <div class="block">
      <label class="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          :checked="useLamination"
          @change="emit('update:useLamination', $event.target.checked)"
          :disabled="useFoil"
        />
        Добавить ламинацию
      </label>

      <div v-if="useLamination">
        <label class="block">
          Тип ламинации:
          <select
            class="mt-1 border px-2 py-1 w-full"
            :value="lamination"
            @change="emit('update:lamination', $event.target.value)"
            :disabled="useFoil"
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
        <input
          type="checkbox"
          :checked="useFoil"
          @change="emit('update:useFoil', $event.target.checked)"
        />
        Добавить фольгирование
      </label>
    </div>
  </div>
</template>
