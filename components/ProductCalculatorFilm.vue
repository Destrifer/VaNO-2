<template>
  <div class="mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Левая колонка -->
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Калькулятор {{ title.toLowerCase() }}</h1>

      <ProductViews v-model="views" />

      <ProductOptions
        :diameter="props.diameter"
        :width="width"
        :height="height"
        v-model:diameter="diameter"
        v-model:material="materialKey"
        v-model:lamination="laminationKey"
        v-model:useLamination="useLamination"
        v-model:useFoil="useFoil"
        v-model:foilColor="foilColor"
        :materials="materialsWithStatus"
        :laminations="settings.lamination"
        @update:width="(val) => (width = val)"
        @update:height="(val) => (height = val)"
        :printMode="printMode"
        @update:printMode="(val) => (printMode = val)"
        :enabledOptions="enabledOptions"
        :availableSizes="availableSizes"
        :sizes="{}"
      />

      <FoilPreview
        v-if="useFoil"
        :foilColor="foilColor"
        @update:foilColor="(val) => (foilColor = val)"
      />
    </div>

    <!-- Центральная колонка -->
    <div class="flex flex-col items-center space-y-6">
      <component :is="previewComponent" :width="width" :height="height" />
      <BetterDeals :better-deals="betterDeals" @select-deal="applyDeal" />
    </div>

    <!-- Правая колонка -->
    <div class="space-y-6">
      <div class="border-t pt-6">
        <h2 class="text-xl font-semibold mb-2">Итог заказа:</h2>
        <ul class="space-y-1 text-sm">
          <li>
            Тираж: <strong>{{ totalTirazh }}</strong>
          </li>
          <li>
            Изделий на листе: <strong>{{ result.itemsPerSheet }}</strong>
          </li>
          <li>
            Листов нужно: <strong>{{ result.sheetsNeeded }}</strong>
          </li>

          <li class="mt-2 font-semibold">Стоимость по шагам:</li>

          <li>
            Печать ({{ printMode }}) × {{ result.sheetsNeeded }} листов:
            <strong>
              {{
                getTierPrice(
                  settings.print_price[printMode],
                  result.sheetsNeeded
                ) * result.sheetsNeeded
              }}
              ₽
            </strong>
          </li>

          <li>
            Материал ({{ materialKey }}) × {{ result.sheetsNeeded }}:
            <strong>
              {{ settings.materials[materialKey] * result.sheetsNeeded }} ₽
            </strong>
          </li>

          <li v-if="useLamination">
            Ламинация ({{ laminationKey }}) × {{ result.sheetsNeeded }}:
            <strong>
              {{ settings.lamination[laminationKey] * result.sheetsNeeded }} ₽
            </strong>
          </li>

          <li v-if="useFoil">
            Фольгирование × {{ result.sheetsNeeded }}:
            <strong>{{ result.foilTotal.toFixed(2) }} ₽</strong>
          </li>

          <li>
            Резка:
            <strong>{{ result.cutting.toFixed(2) }} ₽</strong>
            <span class="text-gray-500 italic">(плоттер)</span>
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

<script setup>
import { ref, computed } from "vue";
import { useProductCalculator } from "~/composables/useFilmCalculator";
import { useAddToCart } from "~/composables/useAddToCart";
import settings from "~/assets/settings_film.json";

import ProductViews from "@/components/common/ProductViews.vue";
import ProductOptions from "@/components/common/ProductOptions.vue";
import FoilPreview from "@/components/common/FoilPreview.vue";
import BetterDeals from "@/components/common/BetterDeals.vue";

const props = defineProps({
  title: String,
  icon: String,
  defaultValues: Object,
  enabledOptions: Object,
  diameter: Number,
  previewComponent: [Object, Function],
  availableSizes: {
    type: Array,
    default: () => [],
  },
});

const views = ref(props.defaultValues.views || [{ qty: 500 }]);
const width = ref(props.defaultValues.width);
const height = ref(props.defaultValues.height);
const diameter = ref(props.defaultValues.diameter || null);
const printMode = ref(props.defaultValues.printMode);
const materialKey = ref(props.defaultValues.materialKey);
const laminationKey = ref(props.defaultValues.laminationKey);
const useLamination = ref(props.defaultValues.useLamination);
const useFoil = ref(props.defaultValues.useFoil);
const foilColor = ref(props.defaultValues.foilColor);

const { addProduct } = useAddToCart();
const calculate = useProductCalculator(settings);

const totalTirazh = computed(() =>
  views.value.reduce((sum, view) => sum + (Number(view.qty) || 0), 0)
);

const result = computed(() =>
  calculate({
    diameter: diameter.value,
    width: width.value,
    height: height.value,
    views: views.value,
    materialKey: materialKey.value,
    laminationKey: laminationKey.value,
    printMode: printMode.value,
    useLamination: useLamination.value,
    useFoil: useFoil.value,
    foilColor: foilColor.value,
    enabledOptions: props.enabledOptions,
  })
);

const materialsWithStatus = computed(() =>
  Object.entries(settings.materials).map(([name, price]) => ({
    name,
    price,
    disabled: false,
  }))
);

const getTierPrice = (tiers, value) =>
  tiers.find((t) => value <= t.to)?.price ?? tiers.at(-1).price;

const betterDeals = computed(() => {
  const sizeWithMarginX =
    Number(width.value) + settings.plotter_sheet.margin * 2;
  const sizeWithMarginY =
    Number(height.value) + settings.plotter_sheet.margin * 2;
  const sizeWithMarginAltX =
    Number(height.value) + settings.plotter_sheet.margin * 2;
  const sizeWithMarginAltY =
    Number(width.value) + settings.plotter_sheet.margin * 2;

  const fitNormal =
    Math.floor(settings.plotter_sheet.width / sizeWithMarginX) *
    Math.floor(settings.plotter_sheet.height / sizeWithMarginY);
  const fitRotated =
    Math.floor(settings.plotter_sheet.width / sizeWithMarginAltX) *
    Math.floor(settings.plotter_sheet.height / sizeWithMarginAltY);
  const itemsPerSheet = Math.max(fitNormal, fitRotated);

  if (!itemsPerSheet || itemsPerSheet === 0) return [];

  const currentSheets = Math.ceil(totalTirazh.value / itemsPerSheet);
  const currentPricePerSheet = getTierPrice(
    settings.print_price[printMode.value],
    currentSheets
  );

  const deals = [];
  let foundDeals = 0;

  for (const tier of settings.print_price[printMode.value]) {
    if (tier.to <= currentSheets) continue;
    if (foundDeals >= 4) break;

    const neededSheets = tier.to;
    const neededTirazh = neededSheets * itemsPerSheet;

    const printCost = getTierPrice(
      settings.print_price[printMode.value],
      neededSheets
    );
    const materialCost = settings.materials[materialKey.value];
    const laminationCost = useLamination.value
      ? settings.lamination[laminationKey.value]
      : 0;
    const foilCost = useFoil.value
      ? getTierPrice(settings.foil_price, neededSheets)
      : 0;

    const totalCost =
      (printCost + materialCost + laminationCost + foilCost) * neededSheets;
    const fullUnitPrice = (totalCost / neededTirazh).toFixed(2);

    const currentTotalCost =
      (currentPricePerSheet + materialCost + laminationCost + foilCost) *
      currentSheets;
    const currentUnitPrice = currentTotalCost / totalTirazh.value;

    const saving = 100 - (totalCost / neededTirazh / currentUnitPrice) * 100;

    if (saving > 0) {
      deals.push({
        neededTirazh,
        saving: saving.toFixed(1),
        fullUnitPrice,
      });
      foundDeals++;
    }
  }

  return deals;
});

const applyDeal = (deal) => {
  const multiplier = deal.neededTirazh / totalTirazh.value;
  views.value.forEach((view) => {
    view.qty = Math.ceil(view.qty * multiplier);
  });
};

const handleOrder = () => {
  const size =
    typeof diameter?.value === "number" && !isNaN(diameter.value)
      ? `${diameter.value} мм`
      : `${width.value}×${height.value} мм`;

  addProduct({
    title: props.title,
    icon: props.icon || "/icons/default.svg",
    options: {
      Тираж: views.value.map((view) => view.qty),
      Размер: size,
      Печать: printMode.value,
      Материал: materialKey.value,
      Ламинация: useLamination.value ? laminationKey.value : "без ламинации",
      Фольгирование: useFoil.value ? `Да, цвет: ${foilColor.value}` : "Нет",
    },
    price: result.value.total,
  });
};
</script>
