<script setup>
import ProductCalculatorFilm from "@/components/ProductCalculatorFilm.vue";
import StickerPreview from "@/components/products/LeafletsPreview.vue";

const defaultValues = {
  width: 40,
  height: 60,
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

const sizes = {
  "40×60 мм": { width: 40, height: 60 },
  "80×30 мм": { width: 80, height: 30 },
  "90×50 мм": { width: 90, height: 50 },
};
</script>

<template>
  <ProductCalculatorFilm
    title="Наклейки на плёнке"
    icon="/icons/stickers.svg"
    :defaultValues="defaultValues"
    :enabledOptions="enabledOptions"
    :availableSizes="availableSizes"
    :previewComponent="StickerPreview"
    :sizes="sizes"
  />
</template>
