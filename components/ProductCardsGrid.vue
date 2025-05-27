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
  <div
    class="grid gap-6 mt-12"
    style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))"
  >
    <NuxtLink
      v-for="product in productList"
      :key="product.href"
      :to="product.href"
      class="p-4 hover:shadow-lg transition border rounded-xl bg-white flex flex-col items-center text-center"
    >
      <img :src="product.icon" alt="" class="w-24 h-24 object-contain mb-2" />
      <div class="font-semibold text-lg">{{ product.title }}</div>
      <div v-if="product.pricePerUnit" class="text-sm text-gray-500 mt-1">
        от <strong>{{ product.pricePerUnit.toFixed(2) }} ₽</strong> / шт
      </div>
    </NuxtLink>
  </div>
</template>
