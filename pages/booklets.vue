<script setup>
import ProductCalculatorBooklet from "@/components/ProductCalculatorBooklet.vue";
import BookletPreview from "@/components/products/LeafletsPreview.vue"; // можно заменить на свою визуализацию
import settings from "@/assets/settings_print.json";

// Значения по умолчанию
const defaultValues = {
  width: 210,
  height: 297,
  views: [{ qty: 20 }],
  printMode: "4+4",
  materialKey: "Мелованная матовая 150 гр.",
  laminationKey: "Глянцевая 30 мкм",
  useLamination: true,
  pages: 28, // ← Добавлено
};

// Включённые опции
const enabledOptions = {
  bending: true,
  round_corners: true,
  pikallo: true,
  drilling: true,
  lamination: true,
};

// Предустановленные размеры
const availableSizes = ["A4 (210×297 мм)", "A5 (148×210 мм)"];
</script>

<template>
  <ProductCalculatorBooklet
    title="Брошюры"
    icon="/icons/booklet.svg"
    :defaultValues="defaultValues"
    :enabledOptions="enabledOptions"
    :availableSizes="availableSizes"
    :previewComponent="BookletPreview"
    :allowCustomSize="false"
  />
</template>
