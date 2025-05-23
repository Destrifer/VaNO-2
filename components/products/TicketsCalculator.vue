<template>
  <div class="mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Левая колонка -->
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Билеты</h1>

      <ProductViews v-model="views" />

      <ProductOptions
        :width="width"
        :height="height"
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
      />

      <FoilPreview
        v-if="useFoil"
        :foilColor="foilColor"
        @update:foilColor="(val) => (foilColor = val)"
      />

      <div class="space-y-2">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="useBending" />
          Биговка
        </label>
        <div v-if="useBending" class="ml-4">
          Кол-во фальцев:
          <input
            type="number"
            min="1"
            max="2"
            v-model.number="bendingFolds"
            class="border px-2 py-1 w-20"
          />
        </div>

        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="useRoundCorners" />
          Скругление уголков
        </label>
        <div v-if="useRoundCorners" class="ml-4">
          Кол-во углов:
          <input
            type="number"
            min="1"
            max="4"
            v-model.number="cornerCount"
            class="border px-2 py-1 w-20"
          />
        </div>

        <label class="block">
          Пиккало / Сверление:
          <select v-model="drillType" class="mt-1 border px-2 py-1 w-full">
            <option :value="null">Не выбрано</option>
            <option value="pikallo">Установка пиккало</option>
            <option value="drilling">Сверление</option>
          </select>
        </label>
        <div v-if="drillType === 'drilling'" class="ml-4">
          Кол-во отверстий:
          <input
            type="number"
            min="1"
            max="4"
            v-model.number="holeCount"
            class="border px-2 py-1 w-20"
          />
        </div>
      </div>

      <div v-if="correctionMessage" class="text-orange-600 italic text-sm">
        {{ correctionMessage }}
      </div>
    </div>

    <!-- Центральная колонка -->
    <div class="flex flex-col items-center space-y-6">
      <LeafletsPreview :width="width" :height="height" />
      <BetterDeals :better-deals="betterDeals" @select-deal="applyDeal" />
    </div>

    <!-- Правая колонка -->
    <div class="space-y-6">
      <div class="border-t pt-6">
        <h2 class="text-xl font-semibold mb-2">Итог заказа:</h2>
        <ul class="space-y-1 text-sm">
          <li>
            Изделий на листе: <strong>{{ result.itemsPerSheet }}</strong>
          </li>
          <li>
            Листов нужно: <strong>{{ result.sheetsNeeded }}</strong>
          </li>
          <li>
            Цена за печать ({{
              getTierPrice(printPrices[printMode], result.sheetsNeeded)
            }}
            ₽/лист):
            <strong
              >{{
                (
                  getTierPrice(printPrices[printMode], result.sheetsNeeded) *
                  result.sheetsNeeded
                ).toFixed(2)
              }}
              ₽</strong
            >
          </li>
          <li>
            Цена за материал ({{ settings.materials[materialKey] }} ₽/лист):
            <strong
              >{{
                (settings.materials[materialKey] * result.sheetsNeeded).toFixed(
                  2
                )
              }}
              ₽</strong
            >
          </li>
          <li v-if="useLamination">
            Ламинация ({{ settings.lamination[laminationKey] }} ₽/лист +
            {{ settings.lamination_setup_cost }} ₽ приладка):
            <strong
              >{{
                (
                  settings.lamination[laminationKey] * result.sheetsNeeded +
                  settings.lamination_setup_cost
                ).toFixed(2)
              }}
              ₽</strong
            >
          </li>
          <li v-if="useFoil">
            Фольгирование ({{ getTierPrice(foilPrices, result.sheetsNeeded) }}
            ₽/лист):
            <strong
              >{{
                (
                  getTierPrice(foilPrices, result.sheetsNeeded) *
                  result.sheetsNeeded
                ).toFixed(2)
              }}
              ₽</strong
            >
          </li>
          <li>
            Резка ({{ settings.cutting_percentage }}% от печати + материала +
            ламинации + фольги):
            <strong>{{ result.cutting.toFixed(2) }} ₽</strong>
          </li>
          <li class="text-lg font-bold mt-2">
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
import { ref, computed, watch } from "vue";
import { useAddToCart } from "~/composables/useAddToCart";
import settings from "~/assets/settings_print.json";
import { products } from "~/assets/products.js";

import ProductViews from "@/components/common/ProductViews.vue";
import ProductOptions from "@/components/common/ProductOptions.vue";
import FoilPreview from "@/components/common/FoilPreview.vue";
import BetterDeals from "@/components/common/BetterDeals.vue";
import LeafletsPreview from "@/components/products/LeafletsPreview.vue";

const printPrices = settings.print_price;
const foilPrices = settings.foil_price;
const sheet = settings.sheet;

const views = ref([{ qty: 500 }]);
const width = ref(98);
const height = ref(200);
const printMode = ref("4+0");
const materialKey = ref(Object.keys(settings.materials)[0]);
const laminationKey = ref("Глянцевая 30 мкм");
const useLamination = ref(true);
const useFoil = ref(false);
const foilColor = ref("серебро");

const useBending = ref(false);
const bendingFolds = ref(1);
const useRoundCorners = ref(false);
const cornerCount = ref(4);
const drillType = ref(null);
const holeCount = ref(1);

const savedMaterial = ref("");
savedMaterial.value = materialKey.value;
const savedLamination = ref("");
const correctionMessage = ref("");

const { addProduct } = useAddToCart();

const totalTirazh = computed(() =>
  views.value.reduce((sum, view) => sum + (Number(view.qty) || 0), 0)
);

const getTierPrice = (tiers, value) =>
  tiers.find((t) => value <= t.to)?.price ?? tiers.at(-1).price;

const result = computed(() => {
  const sizeWithMarginX = Number(width.value) + sheet.margin * 2;
  const sizeWithMarginY = Number(height.value) + sheet.margin * 2;
  const sizeWithMarginAltX = Number(height.value) + sheet.margin * 2;
  const sizeWithMarginAltY = Number(width.value) + sheet.margin * 2;

  const fitNormal =
    Math.floor(sheet.width / sizeWithMarginX) *
    Math.floor(sheet.height / sizeWithMarginY);
  const fitRotated =
    Math.floor(sheet.width / sizeWithMarginAltX) *
    Math.floor(sheet.height / sizeWithMarginAltY);

  const itemsPerSheet = Math.max(fitNormal, fitRotated);

  if (!itemsPerSheet || itemsPerSheet === 0) return { total: 0 };

  const sheetsNeeded = Math.ceil(totalTirazh.value / itemsPerSheet);

  const material = settings.materials[materialKey.value];
  const laminationPerSheet = useLamination.value
    ? settings.lamination[laminationKey.value]
    : 0;
  const laminationSetup = useLamination.value
    ? settings.lamination_setup_cost
    : 0;
  const foil = useFoil.value ? getTierPrice(foilPrices, sheetsNeeded) : 0;

  const unitPrice =
    getTierPrice(printPrices[printMode.value], sheetsNeeded) +
    material +
    laminationPerSheet;

  const subtotal = sheetsNeeded * unitPrice;
  const foilTotal = foil * sheetsNeeded;
  const cutting =
    (subtotal + foilTotal + laminationSetup) *
    (settings.cutting_percentage / 100);

  let extras = laminationSetup;

  if (useBending.value) {
    extras += 300 + 4 * totalTirazh.value * Math.min(bendingFolds.value, 2);
  }
  if (useRoundCorners.value) {
    extras += 300 + 1 * totalTirazh.value * Math.min(cornerCount.value, 4);
  }
  if (drillType.value === "pikallo") {
    extras += 300 + 3 * totalTirazh.value;
  }
  if (drillType.value === "drilling") {
    extras += 500 + 1 * totalTirazh.value * Math.min(holeCount.value, 4);
  }

  return {
    itemsPerSheet,
    sheetsNeeded,
    unitPrice,
    subtotal,
    foilTotal,
    cutting,
    extras,
    total: subtotal + cutting + foilTotal + extras,
  };
});

watch(useFoil, (newVal) => {
  if (newVal) {
    savedMaterial.value = materialKey.value;
    savedLamination.value = laminationKey.value;
    laminationKey.value = "Soft touch";
    useLamination.value = true;
  } else {
    if (savedMaterial.value) materialKey.value = savedMaterial.value;
    if (savedLamination.value) laminationKey.value = savedLamination.value;
  }
});

const materialsWithStatus = computed(() =>
  Object.entries(settings.materials).map(([name, price]) => ({
    name,
    price,
    disabled: false,
  }))
);

const betterDeals = computed(() => {
  const sizeWithMarginX = Number(width.value) + sheet.margin * 2;
  const sizeWithMarginY = Number(height.value) + sheet.margin * 2;
  const sizeWithMarginAltX = Number(height.value) + sheet.margin * 2;
  const sizeWithMarginAltY = Number(width.value) + sheet.margin * 2;

  const fitNormal =
    Math.floor(sheet.width / sizeWithMarginX) *
    Math.floor(sheet.height / sizeWithMarginY);
  const fitRotated =
    Math.floor(sheet.width / sizeWithMarginAltX) *
    Math.floor(sheet.height / sizeWithMarginAltY);
  const itemsPerSheet = Math.max(fitNormal, fitRotated);

  if (!itemsPerSheet || itemsPerSheet === 0) return [];

  const currentSheets = Math.ceil(totalTirazh.value / itemsPerSheet);
  const currentPricePerSheet = getTierPrice(
    printPrices[printMode.value],
    currentSheets
  );

  const deals = [];
  let foundDeals = 0;

  for (const tier of printPrices[printMode.value]) {
    if (tier.to <= currentSheets) continue;
    if (foundDeals >= 4) break;

    const neededSheets = tier.to;
    const neededTirazh = neededSheets * itemsPerSheet;

    const printCost = getTierPrice(printPrices[printMode.value], neededSheets);
    const materialCost = settings.materials[materialKey.value];
    const laminationCost = useLamination.value
      ? settings.lamination[laminationKey.value]
      : 0;
    const foilCost = useFoil.value ? getTierPrice(foilPrices, neededSheets) : 0;

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
  const productInfo = products.find((p) => p.title === "Листовки");
  const viewOptions =
    views.value.length === 1
      ? totalTirazh.value
      : views.value.map((view) => view.qty);

  addProduct({
    title: "Листовки",
    icon: productInfo?.icon || "/icons/default.svg",
    options: {
      Тираж: viewOptions,
      Размер: `${width.value}×${height.value} мм`,
      Печать: printMode.value,
      Материал: materialKey.value,
      Ламинация: useLamination.value ? laminationKey.value : "без ламинации",
      Фольгирование: useFoil.value ? `Да, цвет: ${foilColor.value}` : "Нет",
      Биговка: useBending.value ? `${bendingFolds.value} фальца` : "Нет",
      "Скругление углов": useRoundCorners.value
        ? `${cornerCount.value} угла`
        : "Нет",
      "Пиккало/Сверление":
        drillType.value === "pikallo"
          ? "Пиккало"
          : drillType.value === "drilling"
          ? `${holeCount.value} отверстий`
          : "Нет",
    },
    price: result.value.total,
  });
};
</script>
