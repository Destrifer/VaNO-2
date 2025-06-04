<script setup>
import ProductCalculatorBooklet from "@/components/ProductCalculatorBooklet.vue";
import BookletPreview from "@/components/products/LeafletsPreview.vue";

const defaultValues = {
  width: 210,
  height: 297,
  views: [{ qty: 20 }],
  printMode: "4+4",
  materialKey: "Мелованная матовая 150 гр.",
  laminationKey: "Ultra Bond глянец",
  useLamination: true,
  pages: 28,
  materialBlockKey: "Офсет 80 гр.",
  bindingType: "staple",
};

const enabledOptions = {
  bending: false,
  round_corners: false,
  pikallo: false,
  drilling: false,
  lamination: true,
};

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
