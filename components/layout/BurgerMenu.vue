<template>
  <transition name="slide-down">
    <aside
      v-if="isOpen"
      class="fixed inset-0 bg-white z-50 flex flex-col p-6 space-y-6"
    >
      <!-- Закрыть -->
      <button @click="$emit('close')" class="self-end text-3xl">✕</button>

      <!-- Каталог -->
      <div>
        <p class="text-md-fluid font-bold mb-4">Каталог продукции</p>
        <ul class="space-y-2 text-sm-fluid">
          <li>
            <NuxtLink to="/business-cards" @click="$emit('close')"
              >Визитки</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/stickers" @click="$emit('close')">Наклейки</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/booklets" @click="$emit('close')">Буклеты</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/calendars" @click="$emit('close')"
              >Календари</NuxtLink
            >
          </li>
          <li class="flex justify-between items-center">
            <NuxtLink to="/catalog" @click="$emit('close')"
              >Все категории</NuxtLink
            >
            <span>&rsaquo;</span>
          </li>
        </ul>
      </div>

      <hr />

      <!-- Основные страницы -->
      <ul class="space-y-2 text-sm-fluid">
        <li>
          <NuxtLink to="/checkout" @click="$emit('close')"
            >Рассчитать заказ</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/how-to-order" @click="$emit('close')"
            >Как заказать</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/delivery" @click="$emit('close')">Доставка</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contacts" @click="$emit('close')">Контакты</NuxtLink>
        </li>
      </ul>

      <hr />

      <!-- Контакты -->
      <div class="space-y-1 text-sm-fluid">
        <p>Телефон <span class="font-semibold">+7 (495) 000-00-00</span></p>
        <p>
          <a href="https://t.me/yourbot" target="_blank">Telegram</a> /
          <a href="https://wa.me/79998887766" target="_blank">WhatsApp</a>
        </p>
      </div>

      <!-- Кнопка -->
      <UiBaseButton
        size="md"
        variant="primary"
        to="/callback"
        class="w-full mt-auto"
      >
        Заказать звонок
      </UiBaseButton>
    </aside>
  </transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
});
defineEmits(["close"]);
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}
.slide-down-enter-from {
  transform: translateY(-100%);
}
.slide-down-enter-to {
  transform: translateY(0);
}
.slide-down-leave-from {
  transform: translateY(0);
}
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
