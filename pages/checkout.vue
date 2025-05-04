<template>
  <div class="mx-auto p-6 flex flex-col md:flex-row gap-6">
    <!-- Левая колонка -->
    <CheckoutCartSection />

    <!-- Правая колонка -->
    <CheckoutFormSection />
  </div>
</template>

<script setup>
import CheckoutCartSection from "~/components/checkout/CheckoutCartSection.vue";
import CheckoutFormSection from "~/components/checkout/CheckoutFormSection.vue";
</script>
