<template>
  <footer class="bg-gray-100 text-sm text-gray-700 py-8 px-4 md:px-10">
    <div class="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Блок: Контакты -->
      <div>
        <h3 class="text-base font-bold mb-2">Контакты</h3>
        <ul class="space-y-1">
          <li>📍 Москва, ул. Печати, д. 3</li>
          <li>
            📞
            <a href="tel:+79998887766" class="hover:text-danger"
              >+7 (999) 888-77-66</a
            >
          </li>
          <li>
            📧
            <a href="mailto:info@centralprint.ru" class="hover:text-danger"
              >info@centralprint.ru</a
            >
          </li>
          <li>🕓 Пн–Пт, 9:00–18:00</li>
        </ul>
      </div>

      <!-- Блок: Навигация -->
      <div>
        <h3 class="text-base font-bold mb-2">Навигация</h3>
        <ul class="space-y-1">
          <li>
            <a href="/catalog" class="hover:text-danger">Каталог продукции</a>
          </li>
          <li><a href="/delivery" class="hover:text-danger">Доставка</a></li>
          <li><a href="/contacts" class="hover:text-danger">Контакты</a></li>
          <li>
            <a href="/privacy" class="hover:text-danger"
              >Политика конфиденциальности</a
            >
          </li>
        </ul>
      </div>

      <!-- Блок: Связь и мессенджеры -->
      <div>
        <h3 class="text-base font-bold mb-2">Мы на связи</h3>
        <div class="flex items-center gap-4 mb-2">
          <a href="https://t.me/yourbot" target="_blank" aria-label="Telegram">
            <Icon
              name="simple-icons:telegram"
              class="w-6 h-6 hover:text-danger"
            />
          </a>
          <a
            href="https://wa.me/79998887766"
            target="_blank"
            aria-label="WhatsApp"
          >
            <Icon
              name="simple-icons:whatsapp"
              class="w-6 h-6 hover:text-danger"
            />
          </a>
        </div>
        <a
          href="/callback"
          class="inline-block mt-2 bg-primary text-text py-2 px-4 rounded-full font-semibold hover:bg-yellow-400"
        >
          Заказать звонок
        </a>
      </div>
    </div>

    <!-- Копирайт -->
    <div class="mt-8 text-center text-xs text-gray-500">
      © 2025 CentralPrint. Все права защищены.
    </div>
  </footer>
</template>
