<script setup>
import ProductCalculator from "@/components/ProductCalculator.vue";
import LeafletsPreview from "@/components/products/LeafletsPreview.vue";

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

const enabledOptions = {
  bending: false,
  round_corners: false,
  pikallo: false,
  drilling: false,
  lamination: true,
  foil: true,
};
</script>

<template>
  <ProductCalculator
    title="Листовки"
    icon="/icons/leaflet.svg"
    :defaultValues="defaultValues"
    :enabledOptions="enabledOptions"
    :previewComponent="LeafletsPreview"
  />
</template>
