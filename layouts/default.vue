<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main -->
    <main class="flex-1 container mx-auto py-8 mt-16">
      <slot></slot>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
<script setup>
import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";
</script>
