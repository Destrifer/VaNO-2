<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main -->
    <main class="flex-1 px-4 sm:px-6 lg:px-8 py-8 mt-16 container mx-auto">
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
