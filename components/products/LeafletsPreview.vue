<template>
  <div class="flex justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 640"
      width="300"
      height="450"
    >
      <!-- Лист с отступами -->
      <rect
        x="10"
        y="10"
        width="400"
        height="620"
        rx="12"
        ry="12"
        fill="#f9f9f9"
        stroke="#ccc"
        stroke-width="2"
      />

      <!-- Сетка -->
      <g stroke="#cccccc" stroke-dasharray="4,4" stroke-width="1">
        <!-- Вертикальные линии -->
        <line x1="110" y1="20" x2="110" y2="630" />
        <line x1="210" y1="20" x2="210" y2="630" />
        <line x1="310" y1="20" x2="310" y2="630" />
        <!-- Горизонтальные линии -->
        <line x1="20" y1="120" x2="400" y2="120" />
        <line x1="20" y1="220" x2="400" y2="220" />
        <line x1="20" y1="320" x2="400" y2="320" />
        <line x1="20" y1="420" x2="400" y2="420" />
        <line x1="20" y1="520" x2="400" y2="520" />
      </g>

      <!-- Кружки по центру ячеек -->
      <g fill="white" stroke="#999" stroke-width="1.5">
        <!-- Первая строка -->
        <circle cx="60" cy="70" r="32" />
        <circle cx="160" cy="70" r="32" />
        <circle cx="260" cy="70" r="32" />
        <circle cx="360" cy="70" r="32" />
        <!-- Вторая строка -->
        <circle cx="60" cy="170" r="32" />
        <circle cx="160" cy="170" r="32" />
        <circle cx="260" cy="170" r="32" />
        <circle cx="360" cy="170" r="32" />
        <!-- Третья строка -->
        <circle cx="60" cy="270" r="32" />
        <circle cx="160" cy="270" r="32" />
        <circle cx="260" cy="270" r="32" />
        <circle cx="360" cy="270" r="32" />
        <!-- Четвертая строка -->
        <circle cx="60" cy="370" r="32" />
        <circle cx="160" cy="370" r="32" />
        <circle cx="260" cy="370" r="32" />
        <circle cx="360" cy="370" r="32" />
        <!-- Пятая строка -->
        <circle cx="60" cy="470" r="32" />
        <circle cx="160" cy="470" r="32" />
        <circle cx="260" cy="470" r="32" />
        <circle cx="360" cy="470" r="32" />
        <!-- Шестая строка -->
        <circle cx="60" cy="570" r="32" />
        <circle cx="160" cy="570" r="32" />
        <circle cx="260" cy="570" r="32" />
        <circle cx="360" cy="570" r="32" />
      </g>
    </svg>
  </div>
</template>
