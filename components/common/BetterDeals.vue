<script setup>
const props = defineProps({
  betterDeals: Array,
});

const emit = defineEmits(["select-deal"]);
</script>

<template>
  <div v-if="betterDeals.length" class="border-t pt-6 mt-6">
    <h2 class="text-xl font-semibold mb-2">
      Выгодные варианты увеличения тиража:
    </h2>

    <div class="overflow-x-auto">
      <table class="min-w-full border text-sm text-center">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1">Экономия</th>
            <th class="border px-2 py-1">Тираж</th>
            <th class="border px-2 py-1">Цена за единицу</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="deal in betterDeals"
            :key="deal.neededTirazh"
            class="hover:bg-blue-100 cursor-pointer transition"
            @click="emit('select-deal', deal)"
          >
            <td class="border px-2 py-1 text-green-600 font-semibold">
              -{{ deal.saving }}%
            </td>
            <td class="border px-2 py-1 font-medium">
              {{ deal.neededTirazh }}
            </td>
            <td class="border px-2 py-1 font-semibold">
              {{ deal.fullUnitPrice }} ₽
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-xs text-gray-500 mt-2 italic">
      Нажмите на строку, чтобы выбрать этот тираж
    </p>
  </div>
</template>
