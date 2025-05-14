<script setup>
import { ref, computed, watch } from "vue";
import { useAddToCart } from "~/composables/useAddToCart";
import settings from "~/assets/settings.json";
import { products } from "~/assets/products.js";

import ProductViews from "@/components/common/ProductViews.vue";
import ProductOptions from "@/components/common/ProductOptions.vue";
import FoilPreview from "@/components/common/FoilPreview.vue";
import BetterDeals from "@/components/common/BetterDeals.vue";
import RoundStickersPreview from "@/components/products/RoundStickersPreview.vue";

const printPrices = settings.print_price;
const cuttingPrices = settings.cutting_price;
const foilPrices = settings.foil_price;
const sheet = settings.sheet;

const views = ref([{ qty: 500 }]);
const diameter = ref(50);
const materialKey = ref("Самоклейка 80г/м² полуглянцевая");
const laminationKey = ref("Soft touch 30 мкр");
const useLamination = ref(true);
const useFoil = ref(false);
const foilColor = ref("серебро");

const savedMaterial = ref("");
const savedLamination = ref("");
const correctionMessage = ref("");

const { addProduct } = useAddToCart();

const totalTirazh = computed(() =>
  views.value.reduce((sum, view) => sum + (Number(view.qty) || 0), 0)
);

const getTierPrice = (tiers, value) =>
  tiers.find((t) => value <= t.to)?.price ?? tiers.at(-1).price;

const result = computed(() => {
  const sizeWithMargin = Number(diameter.value) + sheet.margin * 2;
  const itemsPerRow = Math.floor(sheet.width / sizeWithMargin);
  const itemsPerCol = Math.floor(sheet.height / sizeWithMargin);
  const itemsPerSheet = itemsPerRow * itemsPerCol;

  if (!itemsPerSheet || itemsPerSheet === 0) return { total: 0 };

  const sheetsNeeded = Math.ceil(totalTirazh.value / itemsPerSheet);

  const material = settings.materials[materialKey.value];
  const lamination = useLamination.value
    ? settings.lamination[laminationKey.value]
    : 0;
  const foil = useFoil.value ? getTierPrice(foilPrices, sheetsNeeded) : 0;

  const unitPrice =
    getTierPrice(printPrices, sheetsNeeded) + material + lamination;

  const subtotal = sheetsNeeded * unitPrice;
  const cuttingTotal =
    getTierPrice(cuttingPrices, itemsPerSheet) * sheetsNeeded;
  const foilTotal = foil * sheetsNeeded;

  return {
    itemsPerSheet,
    sheetsNeeded,
    unitPrice,
    subtotal,
    cuttingTotal,
    foilTotal,
    total: subtotal + cuttingTotal + foilTotal,
  };
});

watch(useFoil, (newVal) => {
  if (newVal) {
    savedMaterial.value = materialKey.value;
    savedLamination.value = laminationKey.value;
    if (materialKey.value.includes("Самоклейка")) {
      materialKey.value = "Пленка Muflon 80г/м² глянцевая";
    }
    laminationKey.value = "Soft touch 30 мкр";
    useLamination.value = true;
  } else {
    if (savedMaterial.value) materialKey.value = savedMaterial.value;
    if (savedLamination.value) {
      laminationKey.value = savedLamination.value;
      useLamination.value = true;
    } else {
      useLamination.value = false;
    }
  }
});

const handleOrder = () => {
  correctionMessage.value = "";

  const sizeWithMargin = Number(diameter.value) + sheet.margin * 2;
  const itemsPerRow = Math.floor(sheet.width / sizeWithMargin);
  const itemsPerCol = Math.floor(sheet.height / sizeWithMargin);
  const itemsPerSheet = itemsPerRow * itemsPerCol;

  if (!itemsPerSheet || itemsPerSheet === 0) return;

  let currentTirazh = totalTirazh.value;
  let total = 0;

  while (true) {
    const sheets = Math.ceil(currentTirazh / itemsPerSheet);
    const material = settings.materials[materialKey.value];
    const lamination = useLamination.value
      ? settings.lamination[laminationKey.value]
      : 0;
    const foil = useFoil.value ? getTierPrice(foilPrices, sheets) : 0;
    const unitPrice = getTierPrice(printPrices, sheets) + material + lamination;
    const subtotal = sheets * unitPrice;
    const cutting = getTierPrice(cuttingPrices, itemsPerSheet) * sheets;
    const foilTotal = foil * sheets;

    total = subtotal + cutting + foilTotal;

    if (total >= 2000 || currentTirazh > 100000) break;
    currentTirazh++;
  }

  if (currentTirazh !== totalTirazh.value) {
    correctionMessage.value = `Тираж был увеличен до ${currentTirazh} для соблюдения минимальной суммы заказа в 2000 ₽.`;
    const diff = currentTirazh - totalTirazh.value;
    views.value[0].qty += diff;
  }

  // Получаем иконку из products
  const productInfo = products.find((p) => p.title === "Наклейки");

  const viewOptions =
    views.value.length === 1
      ? totalTirazh.value
      : views.value.map((view) => view.qty);

  addProduct({
    title: "Наклейки",
    icon: productInfo?.icon || "/icons/default.svg",
    options: {
      тираж: viewOptions,
      диаметр: `${diameter.value} мм`,
      материал: materialKey.value,
      ламинация: useLamination.value ? laminationKey.value : "без ламинации",
      фольгирование: useFoil.value ? `Да, цвет: ${foilColor.value}` : "Нет",
    },
    price: result.value.total,
  });
};

const betterDeals = computed(() => {
  const sizeWithMargin = Number(diameter.value) + sheet.margin * 2;
  const itemsPerRow = Math.floor(sheet.width / sizeWithMargin);
  const itemsPerCol = Math.floor(sheet.height / sizeWithMargin);
  const itemsPerSheet = itemsPerRow * itemsPerCol;

  if (!itemsPerSheet || itemsPerSheet === 0) return [];

  const currentSheets = Math.ceil(totalTirazh.value / itemsPerSheet);
  const currentPricePerSheet = getTierPrice(printPrices, currentSheets);

  const deals = [];
  let foundDeals = 0;

  for (const tier of printPrices) {
    if (tier.to <= currentSheets) continue;
    if (foundDeals >= 4) break;

    const neededSheets = tier.to;
    const neededTirazh = neededSheets * itemsPerSheet;

    const printCost = getTierPrice(printPrices, neededSheets);
    const materialCost = settings.materials[materialKey.value];
    const laminationCost = useLamination.value
      ? settings.lamination[laminationKey.value]
      : 0;
    const foilCost = useFoil.value ? getTierPrice(foilPrices, neededSheets) : 0;
    const cuttingCost = getTierPrice(cuttingPrices, itemsPerSheet);

    const totalCost =
      (printCost + materialCost + laminationCost + foilCost + cuttingCost) *
      neededSheets;

    const fullUnitPrice = (totalCost / neededTirazh).toFixed(2);

    const currentTotalCost =
      (currentPricePerSheet +
        materialCost +
        laminationCost +
        (useFoil.value ? getTierPrice(foilPrices, currentSheets) : 0) +
        cuttingCost) *
      currentSheets;

    const currentUnitPrice = currentTotalCost / totalTirazh.value;

    const saving = 100 - (totalCost / neededTirazh / currentUnitPrice) * 100;

    if (saving > 0) {
      deals.push({
        neededTirazh: neededTirazh,
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
</script>

<template>
  <div class="mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Левая колонка -->
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Калькулятор круглых наклеек</h1>

      <ProductViews v-model="views" />

      <ProductOptions
        :diameter="diameter"
        v-model:material="materialKey"
        v-model:lamination="laminationKey"
        v-model:useLamination="useLamination"
        v-model:useFoil="useFoil"
        v-model:foilColor="foilColor"
        @update:diameter="(val) => (diameter = val)"
      />

      <FoilPreview
        v-if="useFoil"
        :foilColor="foilColor"
        @update:foilColor="(val) => (foilColor = val)"
      />

      <div v-if="correctionMessage" class="text-orange-600 italic text-sm">
        {{ correctionMessage }}
      </div>
    </div>

    <!-- Центральная колонка -->
    <div class="flex flex-col items-center space-y-6">
      <RoundStickersPreview />
      <BetterDeals :better-deals="betterDeals" @select-deal="applyDeal" />
    </div>

    <!-- Правая колонка -->
    <div class="space-y-6">
      <div class="border-t pt-6">
        <h2 class="text-xl font-semibold mb-2">Итог заказа:</h2>
        <ul class="space-y-1">
          <li>
            Изделий на листе: <strong>{{ result.itemsPerSheet }}</strong>
          </li>
          <li>
            Листов нужно: <strong>{{ result.sheetsNeeded }}</strong>
          </li>
          <li class="text-lg font-bold mt-2">
            Общая сумма:
            <span class="text-green-600">{{ result.total }} ₽</span>
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
