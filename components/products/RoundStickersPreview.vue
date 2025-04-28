<template>
  <div class="flex justify-center items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="300"
      height="300"
    >
      <!-- Подложка -->
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="#f0f0f0"
        stroke="#cccccc"
        stroke-width="2"
      />

      <!-- Поле для отрыва -->
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="#999999"
        stroke-width="4"
        stroke-dasharray="5,5"
      />

      <!-- Наклейка -->
      <circle
        cx="100"
        cy="100"
        r="76"
        fill="white"
        stroke="#666666"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<script setup>
// Пока без динамики, просто статичное превью
</script>
