<script setup>
import ProductCalculatorFilm from "@/components/ProductCalculatorFilm.vue";
import StickerPreview from "@/components/products/LeafletsPreview.vue";

const defaultValues = {
  width: 70,
  height: 100,
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

const availableSizes = [];
</script>

<template>
  <ProductCalculatorFilm
    title="Наклейки на плёнке"
    icon="/icons/stickers.svg"
    :defaultValues="defaultValues"
    :enabledOptions="enabledOptions"
    :availableSizes="availableSizes"
    :previewComponent="StickerPreview"
  />
</template>
