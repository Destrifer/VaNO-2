<script setup>
import ProductCalculator from "@/components/ProductCalculator.vue";
import LeafletsPreview from "@/components/products/LeafletsPreview.vue";
import settings from "@/assets/settings_print.json"; // для доступа к размерам (если нужно)

// Значения по умолчанию
const defaultValues = {
  width: 148,
  height: 210,
  views: [{ qty: 500 }],
  printMode: "4+0",
  materialKey: "Мелованная матовая 150 гр.",
  laminationKey: "Глянцевая 30 мкм",
  useLamination: true,
  useFoil: false,
  foilColor: "серебро",
};

// Включённые опции
const enabledOptions = {
  bending: false,
  round_corners: false,
  pikallo: false,
  drilling: false,
  lamination: true,
  foil: true,
};

// Предустановленные размеры
const sizes = {
  "A5 (148×210 мм)": { width: 148, height: 210 },
  "A4 (210×297 мм)": { width: 210, height: 297 },
  "90×50 мм": { width: 90, height: 50 },
};
</script>

<template>
  <ProductCalculator
    title="Листовки"
    icon="/icons/default.svg"
    :defaultValues="defaultValues"
    :enabledOptions="enabledOptions"
    :sizes="sizes"
    :previewComponent="LeafletsPreview"
  />
</template>
