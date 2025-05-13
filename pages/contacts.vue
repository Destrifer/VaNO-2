<template>
  <h1>Контакты</h1>

  <div class="grid grid-cols-1 lg:grid-cols-[1fr_min-content_1fr] gap-8">
    <!-- Левая колонка -->
    <section class="text-center flex flex-col gap-6">
      <h2>Связаться с нами</h2>

      <a href="tel:+79991234567" class="text-3xl font-bold"
        >+7 (999) 123-45-67</a
      >

      <a href="mailto:info@example.com" class="text-3xl font-bold"
        >info@example.com</a
      >

      <div class="flex justify-center items-center gap-4 my-4">
        <a href="https://t.me/yourbot" target="_blank" aria-label="Telegram">
          <Icon name="simple-icons:telegram" size="40" />
        </a>
        <a
          href="https://wa.me/79998887766"
          target="_blank"
          aria-label="WhatsApp"
        >
          <Icon name="simple-icons:whatsapp" size="40" />
        </a>
      </div>

      Оставьте положительный отзыв или напяшите напрямую нашему директору. Да,
      он действительно сам читает каждый отзыв:).

      <!-- Форма -->
      <ContactFormSwitcher class="mt-4" />
    </section>

    <div class="hidden lg:block w-px bg-gray-300"></div>

    <!-- Правая колонка -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Наш офис</h2>
      <ul class="space-y-2 mb-4">
        <li><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 1</li>
        <li><strong>Режим работы:</strong> Пн–Пт: 9:00–18:00</li>
      </ul>

      <div class="mt-4">
        <!-- Картинка вместо кнопки -->
        <NuxtImg
          src="/videos/way.png"
          alt="Смотреть видео"
          class="cursor-pointer w-full mx-auto rounded shadow hover:opacity-80 transition"
          @click="openDialog"
        />

        <!-- Диалог -->
        <dialog ref="videoDialog" class="custom-dialog" @close="onDialogClose">
          <form method="dialog" class="dialog-inner">
            <button class="close-button">×</button>
            <video controls width="100%">
              <source src="/videos/way.mp4" type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </form>
        </dialog>
      </div>

      <div class="mt-4">
        <h3 class="text-lg font-medium mb-2">Панорама</h3>
        <div style="position: relative; overflow: hidden">
          <a
            href="https://yandex.ru/maps/213/moscow/?utm_medium=mapframe&utm_source=maps"
            style="color: #eee; font-size: 12px; position: absolute; top: 0px"
            >Москва</a
          ><a
            href="https://yandex.ru/maps/213/moscow/house/ulitsa_sadovniki_2/Z04YcANpTkwCQFtvfXp2d3VqYg==/?l=stv%2Csta&ll=37.650752%2C55.677063&panorama%5Bdirection%5D=245.733436%2C0.000000&panorama%5Bfull%5D=true&panorama%5Bid%5D=1298339761_674032612_23_1685246908&panorama%5Bpoint%5D=37.651163%2C55.677311&panorama%5Bspan%5D=119.249703%2C60.000000&utm_medium=mapframe&utm_source=maps&z=17.74"
            style="color: #eee; font-size: 12px; position: absolute; top: 14px"
            >Улица Садовники, 2 — Яндекс Карты</a
          ><iframe
            src="https://yandex.ru/map-widget/v1/?l=stv%2Csta&ll=37.650752%2C55.677063&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjY2Njc1NRI80KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINGD0LvQuNGG0LAg0KHQsNC00L7QstC90LjQutC4LCAyIgoNZZkWQhU-tV5C&panorama%5Bdirection%5D=245.733436%2C0.000000&panorama%5Bfull%5D=true&panorama%5Bid%5D=1298339761_674032612_23_1685246908&panorama%5Bpoint%5D=37.651163%2C55.677311&panorama%5Bspan%5D=119.249703%2C60.000000&z=17.74"
            width="100%"
            height="100%"
            frameborder="1"
            allowfullscreen="true"
            style="position: relative"
            class="aspect-video"
          ></iframe>
        </div>
      </div>
    </section>
  </div>

  <!-- Карта -->
  <section class="mt-8">
    <h2 class="text-2xl font-semibold mb-4">Мы на карте</h2>
    <div id="map" class="w-full h-64"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import ContactFormSwitcher from "~/components/ContactFormSwitcher.vue";

const videoDialog = ref(null);

const openDialog = () => {
  videoDialog.value.showModal();

  nextTick(() => {
    const video = videoDialog.value.querySelector("video");
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Автозапуск не сработал:", error);
        });
      }
    }
  });
};

const onDialogClose = () => {
  const video = videoDialog.value.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
};

// 🚀 ИНИЦИАЛИЗАЦИЯ ЯНДЕКС.КАРТЫ
onMounted(() => {
  // Загружаем API динамически
  const script = document.createElement("script");
  script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    ymaps.ready(initMap);
  };

  function initMap() {
    const map = new ymaps.Map("map", {
      center: [55.677311, 37.651163], // Координаты твоего офиса
      zoom: 16,
    });

    const placemark = new ymaps.Placemark(
      [55.677311, 37.651163],
      {
        hintContent: "Типография «Centralprint»",
        balloonContent: `
					<div style="font-size: 14px; line-height: 1.5;">
						<strong style="font-size: 16px; display: block; margin-bottom: 8px;">Наш офис</strong>
						г. Москва, ул. Садовники, дом 2,<br>
						2 этаж, офис 67А
						<hr style="margin: 10px 0;">
						<strong>Телефон:</strong>
						<a href="tel:+79991234567" style="color: #1d68a7; text-decoration: underline; font-weight: bold;">
							+7 (999) 123-45-67
						</a>
					</div>
				`,
      },
      {
        iconLayout: "default#image",
        iconImageHref: "/icons/marker.png", // 👉 относительный путь к иконке
        iconImageSize: [59, 80], // размер иконки
        iconImageOffset: [-25, -50], // смещение (центр по X, низ по Y)
      }
    );

    map.geoObjects.add(placemark);
  }
});
</script>

<style scoped>
.close-button {
  position: absolute;
  top: 0px;
  right: 15px;
  border: none;
  background: none;
  font-size: 32px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  outline: none;
  box-shadow: none;
}

.custom-dialog {
  width: 90%;
  max-width: 800px;
  border: none;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.dialog-inner {
  position: relative;
  width: 100%;
}
</style>
