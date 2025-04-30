<template>
  <footer class="bg-primary py-8 px-4 md:px-10 text-text">
    <div
      class="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
    >
      <!-- Контакты -->
      <div class="mx-auto text-center md:text-left">
        <p class="text-md-fluid mb-4">Контакты</p>
        <ul class="text-sm-fluid">
          <li
            class="mb-2 flex items-center justify-center md:justify-start gap-2"
          >
            <Icon name="f7:house-fill" class="text-2xl" />
            <span>Москва, ул. Печати, д. 3</span>
          </li>
          <li
            class="mb-2 flex items-center justify-center md:justify-start gap-2"
          >
            <Icon name="f7:clock-fill" class="text-2xl" />
            <span>Пн–Пт, 9:00–18:00</span>
          </li>
          <li class="flex justify-center md:justify-start">
            <iframe
              src="https://yandex.ru/sprav/widget/rating-badge/245571942010?type=rating&theme=dark"
              width="150"
              height="50"
              frameborder="0"
              title="Рейтинг Яндекса"
            ></iframe>
          </li>
        </ul>
      </div>

      <!-- Навигация -->
      <nav
        aria-label="Навигация сайта"
        class="mx-auto text-center md:text-left"
      >
        <p class="text-md-fluid mb-4">Навигация</p>
        <ul class="text-sm-fluid">
          <li class="mb-2">
            <NuxtLink to="/catalog">Каталог продукции</NuxtLink>
          </li>
          <li class="mb-2">
            <NuxtLink to="/delivery">Доставка и оплата</NuxtLink>
          </li>
          <li class="mb-2">
            <NuxtLink to="/about">О компании</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contacts">Контакты</NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Связь -->
      <div class="mx-auto text-center md:text-left">
        <p class="text-md-fluid mb-4">Мы на связи</p>

        <div
          class="flex justify-center md:justify-start items-center gap-4 mb-4"
        >
          <a href="https://t.me/yourbot" target="_blank" aria-label="Telegram">
            <Icon name="simple-icons:telegram" class="text-2xl" />
          </a>
          <a
            href="https://wa.me/79998887766"
            target="_blank"
            aria-label="WhatsApp"
          >
            <Icon name="simple-icons:whatsapp" class="text-2xl" />
          </a>
        </div>

        <ul class="text-sm-fluid">
          <li
            class="mb-2 flex items-center justify-center md:justify-start gap-2"
          >
            <Icon name="f7:phone-circle-fill" class="text-2xl" />
            <a href="tel:+79998887766">+7 (999) 888-77-66</a>
          </li>
          <li
            class="mb-4 flex items-center justify-center md:justify-start gap-2"
          >
            <Icon name="f7:envelope-circle-fill" class="text-2xl" />
            <a href="mailto:info@centralprint.ru">info@centralprint.ru</a>
          </li>
        </ul>

        <UiBaseButton size="md" variant="primary" to="/callback">
          Заказать звонок
        </UiBaseButton>
      </div>
    </div>

    <!-- Копирайт -->
    <div
      class="mt-8 text-center text-xs-fluid text-gray-600 border-black border-solid border-t-4 pt-4"
    >
      © 2025 CentralPrint. Все права защищены.
      <NuxtLink to="/contacts">Политика конфиденциальности</NuxtLink> и
      <NuxtLink to="/contacts">Условия предоставления услуг</NuxtLink>.
    </div>
  </footer>
</template>
