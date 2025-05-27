<script setup>
import { computed } from "vue";
import { useProductCalculator } from "~/composables/useProductCalculator";
import settings from "~/assets/settings_print.json";
import { products } from "~/assets/products.js";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const calculate = useProductCalculator(settings);

const productList = computed(() => {
  return products
    .filter((p) => props.list.includes(p.href))
    .map((product) => {
      if (!product.minPriceParams) return { ...product, pricePerUnit: null };

      const result = calculate({
        width: product.minPriceParams.width,
        height: product.minPriceParams.height,
        views: [{ qty: 100 }],
        materialKey: product.minPriceParams.materialKey,
        printMode: "4+0",
        useLamination: false,
        useFoil: false,
        foilColor: "серебро",
      });

      return {
        ...product,
        pricePerUnit: result.total / 100,
      };
    });
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
    <NuxtLink
      v-for="product in productList"
      :key="product.href"
      :to="product.href"
      class="block border rounded-xl p-4 hover:shadow-lg transition text-left"
    >
      <div class="flex items-center gap-3 mb-2">
        <img :src="product.icon" alt="" class="w-6 h-6 object-contain" />
        <div class="font-semibold text-lg">{{ product.title }}</div>
      </div>
      <div v-if="product.pricePerUnit" class="text-sm text-gray-500">
        от <strong>{{ product.pricePerUnit.toFixed(2) }} ₽</strong> / шт
      </div>
    </NuxtLink>
  </div>
</template>
