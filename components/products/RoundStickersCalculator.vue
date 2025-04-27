<script setup>
import { ref, computed, watch } from "vue";
import settings from "~/assets/settings.json";
import { useAddToCart } from "~/composables/useAddToCart";
import { NuxtImg } from "#components";

const printPrices = settings.print_price;
const cuttingPrices = settings.cutting_price;
const foilPrices = settings.foil_price;
const foilColors = settings.foil_colors;
const sheet = settings.sheet;

const views = ref([{ qty: 1000 }]); // 🆕 Массив видов (по умолчанию один вид)
const diameter = ref(50);
const materialKey = ref("paper_sticker");
const laminationKey = ref("soft_touch");
const useLamination = ref(true);
const useFoil = ref(false);
const foilColor = ref("серебро");
const correctionMessage = ref("");

const savedMaterial = ref("");
const savedLamination = ref("");

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
  const unitPrice =
    getTierPrice(printPrices, sheetsNeeded) + material + lamination;

  const subtotal = sheetsNeeded * unitPrice;
  const cuttingUnitPrice = getTierPrice(cuttingPrices, itemsPerSheet);
  const cuttingTotal = cuttingUnitPrice * sheetsNeeded;

  const foilUnitPrice = useFoil.value
    ? getTierPrice(foilPrices, sheetsNeeded)
    : 0;
  const foilTotal = useFoil.value ? foilUnitPrice * sheetsNeeded : 0;

  return {
    itemsPerSheet,
    sheetsNeeded,
    unitPrice,
    subtotal,
    cuttingUnitPrice,
    cuttingTotal,
    foilUnitPrice,
    foilTotal,
    total: subtotal + cuttingTotal + foilTotal,
  };
});

watch(useFoil, (newVal) => {
  if (newVal) {
    savedMaterial.value = materialKey.value;
    savedLamination.value = laminationKey.value;
    if (materialKey.value === "paper_sticker") {
      materialKey.value = "muflon";
    }
    laminationKey.value = "soft_touch";
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

const addView = () => {
  if (views.value.length < 5) {
    views.value.push({ qty: 0 });
  }
};

const removeView = (index) => {
  if (views.value.length > 1) {
    views.value.splice(index, 1);
  }
};

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
    // Автоматически увеличиваем первый вид
    const diff = currentTirazh - totalTirazh.value;
    views.value[0].qty += diff;
  }

  addProduct({
    title: "Круглые наклейки",
    options: {
      виды: views.value.map((view, idx) => `Вид ${idx + 1}: ${view.qty} шт.`),
      диаметр: diameter.value,
      материал: materialKey.value,
      ламинация: useLamination.value ? laminationKey.value : "без ламинации",
      фольгирование: useFoil.value ? `Да, цвет: ${foilColor.value}` : "Нет",
    },
    price: result.value.total,
  });
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold">Калькулятор круглых наклеек</h1>

    <div class="space-y-4">
      <div>
        <h2 class="text-xl font-semibold mb-2">Виды продукции:</h2>
        <div
          v-for="(view, index) in views"
          :key="index"
          class="flex items-center gap-2 mb-2"
        >
          <input
            v-model.number="view.qty"
            type="number"
            min="1"
            class="border px-2 py-1 w-24"
            placeholder="Тираж"
          />
          <button
            v-if="views.length > 1"
            @click="removeView(index)"
            class="text-red-500 hover:underline text-sm"
          >
            Удалить
          </button>
        </div>

        <button
          v-if="views.length < 5"
          @click="addView"
          class="text-blue-600 hover:underline text-sm mt-2"
        >
          + Добавить вид
        </button>

        <div class="text-gray-600 mt-2">
          Суммарный тираж: <strong>{{ totalTirazh }}</strong>
        </div>
      </div>

      <label class="block">
        Диаметр (мм):
        <input
          v-model.number="diameter"
          type="number"
          min="1"
          class="mt-1 border px-2 py-1 w-full"
        />
      </label>

      <label class="block">
        Материал:
        <select v-model="materialKey" class="mt-1 border px-2 py-1 w-full">
          <option
            v-for="(price, key) in settings.materials"
            :value="key"
            :key="key"
            :disabled="useFoil && key === 'paper_sticker'"
          >
            {{ key }} — {{ price }}₽
          </option>
        </select>
      </label>

      <div class="block">
        <label class="flex items-center gap-2 mb-1">
          <input type="checkbox" v-model="useLamination" :disabled="useFoil" />
          Добавить ламинацию
        </label>

        <div v-if="useLamination">
          <label class="block">
            Тип ламинации:
            <select
              v-model="laminationKey"
              class="mt-1 border px-2 py-1 w-full"
              :disabled="useFoil"
            >
              <option
                v-for="(price, key) in settings.lamination"
                :value="key"
                :key="key"
              >
                {{ key }} — {{ price }}₽
              </option>
            </select>
          </label>
        </div>
      </div>

      <div class="block">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="useFoil" />
          Добавить фольгирование
        </label>
      </div>

      <div v-if="useFoil" class="space-y-4 mt-4">
        <h3 class="text-lg font-semibold">Выберите цвет фольги:</h3>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="(img, color) in foilColors"
            :key="color"
            class="cursor-pointer border rounded p-2 flex flex-col items-center"
            :class="foilColor === color ? 'border-blue-500' : 'border-gray-300'"
            @click="foilColor = color"
          >
            <NuxtImg
              :src="img"
              alt=""
              width="80"
              height="80"
              format="avif,webp,jpg"
              class="rounded mb-2 object-cover"
            />
            <span class="text-sm text-center">{{ color }}</span>
          </div>
        </div>

        <div class="mt-6">
          <h4 class="text-md font-medium mb-2">
            Предпросмотр выбранной фольги:
          </h4>
          <NuxtImg
            :src="foilColors[foilColor]"
            alt="Выбранная фольга"
            width="400"
            height="400"
            format="avif,webp,jpg"
            class="rounded shadow object-cover"
          />
        </div>
      </div>
    </div>

    <div v-if="correctionMessage" class="text-orange-600 italic text-sm mt-2">
      {{ correctionMessage }}
    </div>

    <div class="border-t pt-6">
      <h2 class="text-xl font-semibold mb-2">Расчёт:</h2>
      <ul class="space-y-1">
        <li>
          Изделий на листе: <strong>{{ result.itemsPerSheet }}</strong>
        </li>
        <li>
          Необходимо листов: <strong>{{ result.sheetsNeeded }}</strong>
        </li>
        <li>
          Стоимость за лист (печать + материал{{
            useLamination ? " + ламинация" : ""
          }}):
          <strong>{{ result.unitPrice }}₽</strong>
        </li>
        <li>
          Сумма за печать и материалы: <strong>{{ result.subtotal }}₽</strong>
        </li>
        <li>
          Резка: {{ result.cuttingUnitPrice }}₽ × {{ result.sheetsNeeded }} =
          <strong>{{ result.cuttingTotal }}₽</strong>
        </li>
        <li v-if="useFoil">
          Фольгирование: {{ result.foilUnitPrice }}₽ ×
          {{ result.sheetsNeeded }} =
          <strong>{{ result.foilTotal }}₽</strong>
        </li>
        <li class="text-lg font-bold mt-2">
          Итого: <span class="text-green-600">{{ result.total }}₽</span>
        </li>
      </ul>
    </div>

    <button
      @click="handleOrder"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow mt-4"
    >
      Заказать
    </button>
  </div>
</template>
