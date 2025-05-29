<script setup>
import ProductCalculatorFilm from "@/components/ProductCalculatorFilm.vue";
import RoundStickersPreview from "@/components/products/LeafletsPreview.vue";

const defaultValues = {
  diameter: 50,
  views: [{ qty: 500 }],
  printMode: "4+0",
  materialKey: "Пленка Muflon 80г/м² глянцевая",
  laminationKey: "Глянцевая 25 мкр",
  useLamination: true,
  useFoil: false,
  foilColor: "серебро",
};

const enabledOptions = {
  bending: false,
  round_corners: false,
  pikallo: false,
  drilling: false,
  lamination: true,
  foil: true,
};

const availableSizes = []; // предустановленные диаметры, если есть
</script>

<template>
  <ProductCalculatorFilm
    title="Круглые наклейки на плёнке"
    icon="/icons/stickers.svg"
    :defaultValues="defaultValues"
    :enabledOptions="enabledOptions"
    :availableSizes="availableSizes"
    :previewComponent="RoundStickersPreview"
    :diameter="defaultValues.diameter"
  />
</template>
