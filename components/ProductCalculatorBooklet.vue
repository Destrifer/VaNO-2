<script setup>
import { watch, ref, computed } from "vue";
import { useProductCalculatorBooklet } from "~/composables/useProductCalculatorBooklet";
import { useAddToCart } from "~/composables/useAddToCart";
import settings from "~/assets/settings_print.json";

import ProductViews from "@/components/common/ProductViews.vue";
import ProductOptions from "@/components/common/ProductOptions.vue";
import BetterDeals from "@/components/common/BetterDeals.vue";

const props = defineProps({
  title: String,
  icon: String,
  defaultValues: Object,
  enabledOptions: Object,
  previewComponent: [Object, Function],
  sizes: {
    type: Object,
    default: () => ({}),
  },
  allowCustomSize: {
    type: Boolean,
    default: true,
  },
});

const views = ref(props.defaultValues.views || [{ qty: 500 }]);
const width = ref(props.defaultValues.width);
const height = ref(props.defaultValues.height);
const printMode = ref(props.defaultValues.printMode);
const materialKey = ref(props.defaultValues.materialKey);
const laminationKey = ref(props.defaultValues.laminationKey);
const useLamination = ref(props.defaultValues.useLamination);
const pages = ref(props.defaultValues.pages || 48);
const materialBlockKey = ref(Object.keys(settings.materials)[0]);
const bindingType = ref("скоба");
const correctionMessage = ref("");
const laminationOptions = computed(() =>
  Object.fromEntries(
    Object.entries(settings.lamination).filter(([name]) =>
      name.toLowerCase().includes("ultra bond")
    )
  )
);
const { addProduct } = useAddToCart();
const calculate = useProductCalculatorBooklet(settings);

const totalTirazh = computed(() =>
  views.value.reduce((sum, view) => sum + (Number(view.qty) || 0), 0)
);

const totalTirazhWithReserve = computed(() => {
  const reserve = Math.max(Math.ceil(totalTirazh.value * 0.05), 2);
  return totalTirazh.value + reserve;
});

const result = computed(() =>
  calculate({
    width: width.value,
    height: height.value,
    views: views.value,
    materialKey: materialKey.value,
    materialBlockKey: materialBlockKey.value,
    laminationKey: laminationKey.value,
    printMode: printMode.value,
    useLamination: useLamination.value,
    pages: pages.value,
    bindingType: bindingType.value,
  })
);

const materialsWithStatus = computed(() =>
  Object.entries(settings.materials)
    .filter(([name]) => !name.toLowerCase().includes("картон"))
    .map(([name, price]) => ({
      name,
      price,
      disabled: false,
    }))
);

const bindingOptions = computed(() => [
  {
    value: "скоба",
    label: "Скоба",
    maxPages: 64,
  },
  {
    value: "пружина",
    label: "Пружина",
    maxPages: 200,
  },
  {
    value: "кбс",
    label: "КБС",
    maxPages: 300,
  },
]);

const betterDeals = computed(() => {
  const tiers = [50, 100, 200, 300, 500, 1000];
  const currentPricePerUnit = result.value.total / totalTirazh.value;

  return tiers
    .filter((tier) => tier > totalTirazh.value)
    .map((tier) => {
      const multiplier = tier / totalTirazh.value;
      const newViews = views.value.map((v) => ({
        ...v,
        qty: Math.ceil(v.qty * multiplier),
      }));

      const newResult = calculate({
        width: width.value,
        height: height.value,
        views: newViews,
        materialKey: materialKey.value,
        materialBlockKey: materialBlockKey.value,
        laminationKey: laminationKey.value,
        printMode: printMode.value,
        useLamination: useLamination.value,
        pages: pages.value,
        bindingType: bindingType.value,
      });

      const newPricePerUnit = newResult.total / tier;
      const savingPercent = Math.round(
        ((currentPricePerUnit - newPricePerUnit) / currentPricePerUnit) * 100
      );

      return {
        neededTirazh: tier,
        fullUnitPrice: newPricePerUnit.toFixed(2),
        saving: savingPercent,
        total: newResult.total,
      };
    })
    .filter((deal) => deal.saving > 0)
    .sort((a, b) => a.neededTirazh - b.neededTirazh);
});

const applyDeal = (deal) => {
  const multiplier = deal.neededTirazh / totalTirazh.value;
  views.value.forEach((view) => {
    view.qty = Math.ceil(view.qty * multiplier);
  });
};

watch(pages, (newPages) => {
  const validBinding = bindingOptions.value.find((opt) => {
    // Если КБС — разрешаем только от 100
    if (opt.value === "кбс") return newPages >= 100 && newPages <= opt.maxPages;
    // Для остальных — обычная проверка
    return newPages <= opt.maxPages;
  });

  if (validBinding && bindingType.value !== validBinding.value) {
    bindingType.value = validBinding.value;
  }
});

const handleOrder = () => {
  addProduct({
    title: props.title,
    icon: props.icon || "/icons/default.svg",
    options: {
      Тираж: views.value.map((view) => view.qty),
      Размер: `${width.value}×${height.value} мм`,
      Страниц: pages.value,
      Печать: printMode.value,
      Материал: materialKey.value,
      "Материал блока": materialBlockKey.value,
      Ламинация: useLamination.value ? laminationKey.value : "без ламинации",
      Скрепление: bindingType.value,
    },
    price: result.value.total,
  });
};
</script>

<template>
  <div class="mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Калькулятор {{ title.toLowerCase() }}</h1>

      <ProductViews v-model="views" />

      <ProductOptions
        :width="width"
        :height="height"
        v-model:material="materialKey"
        v-model:lamination="laminationKey"
        v-model:useLamination="useLamination"
        :materials="materialsWithStatus"
        :laminations="laminationOptions"
        @update:width="(val) => (width = val)"
        @update:height="(val) => (height = val)"
        :printMode="printMode"
        @update:printMode="(val) => (printMode = val)"
        :enabledOptions="enabledOptions"
        :availableSizes="availableSizes"
        :sizes="props.sizes"
        :showPages="true"
        :pages="pages"
        @update:pages="(val) => (pages = val)"
      />

      <div class="space-y-2">
        <label class="block">
          Материал блока:
          <select
            class="mt-1 border px-2 py-1 w-full"
            v-model="materialBlockKey"
          >
            <option
              v-for="item in materialsWithStatus"
              :key="item.name"
              :value="item.name"
              :disabled="item.disabled"
            >
              {{ item.name }}
            </option>
          </select>
        </label>
      </div>

      <div class="space-y-2">
        <label class="block">
          Скрепление:
          <select v-model="bindingType" class="mt-1 border px-2 py-1 w-full">
            <option
              v-for="opt in bindingOptions"
              :key="opt.value"
              :value="opt.value"
              :disabled="
                pages > opt.maxPages || (opt.value === 'кбс' && pages < 100)
              "
            >
              {{ opt.label }} (до {{ opt.maxPages }} стр.)
            </option>
          </select>
        </label>
      </div>

      <div v-if="correctionMessage" class="text-orange-600 italic text-sm">
        {{ correctionMessage }}
      </div>
    </div>

    <div class="flex flex-col items-center space-y-6">
      <component :is="previewComponent" :width="width" :height="height" />
      <BetterDeals :better-deals="betterDeals" @select-deal="applyDeal" />
    </div>

    <div class="space-y-6">
      <div class="border-t pt-6">
        <h2 class="text-xl font-semibold mb-2">Итог заказа:</h2>
        <ul class="space-y-1 text-sm">
          <li>
            Тираж: <strong>{{ totalTirazh }}</strong> +
            <strong>{{ Math.max(Math.ceil(totalTirazh * 0.05), 2) }}</strong>
            запас = <strong>{{ totalTirazhWithReserve }}</strong>
          </li>
          <li>
            Страниц в брошюре: <strong>{{ pages }}</strong>
          </li>

          <li class="font-semibold mt-2">Обложка:</li>
          <li>
            Печать ({{ printMode }}) × {{ result.cover.sheetsNeeded }}:
            <strong>{{ result.cover.printTotal.toFixed(2) }} ₽</strong>
          </li>
          <li>
            Материал × {{ result.cover.sheetsNeeded }}:
            <strong>{{ result.cover.materialTotal.toFixed(2) }} ₽</strong>
          </li>
          <li v-if="useLamination">
            Ламинация × {{ result.cover.sheetsNeeded }}:
            <strong>{{ result.cover.laminationTotal.toFixed(2) }} ₽</strong>
          </li>

          <li class="font-semibold mt-2">Блок:</li>
          <li class="text-xs text-gray-500 italic">
            {{ pages }} стр → {{ Math.ceil(pages / 2) }} разв/брошюру ×
            {{ totalTirazhWithReserve }} брошюр =
            {{ result.block.spreadsTotal }} разворотов →
            {{ result.block.sheetsNeeded }} листов по
            {{ result.spreadsPerSheet }} на лист
          </li>
          <li>
            Печать (4+4) × {{ result.block.sheetsNeeded }}:
            <strong>{{ result.block.printTotal.toFixed(2) }} ₽</strong>
          </li>
          <li>
            Материал × {{ result.block.sheetsNeeded }}:
            <strong>{{ result.block.materialTotal.toFixed(2) }} ₽</strong>
          </li>

          <li v-if="useLamination">
            Приладка ламинации:
            <strong>{{ settings.lamination_setup_cost }} ₽</strong>
          </li>
          <li>
            Скрепление ({{ bindingType }} × {{ totalTirazhWithReserve }}):
            <strong>{{ result.binding.toFixed(2) }} ₽</strong>
          </li>
          <li>
            Резка:
            <strong>{{ result.cutting.toFixed(2) }} ₽</strong>
          </li>
          <li class="text-lg font-bold mt-3">
            Общая сумма:
            <span class="text-green-600">{{ result.total.toFixed(2) }} ₽</span>
          </li>
          <li>
            Цена за штуку:
            <strong class="text-blue-600">
              {{ (result.total / totalTirazh).toFixed(2) }} ₽
            </strong>
          </li>
        </ul>
      </div>

      <button
        @click="handleOrder"
        class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
      >
        Заказать
      </button>
    </div>
  </div>
</template>
