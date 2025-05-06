<script setup>
import { useCartStore } from "@/stores/cart";
import { ref, computed, watch } from "vue";
import { navigateTo } from "#app";
import { IMaskComponent } from "vue-imask";

const cart = useCartStore();

const name = ref("");
const phone = ref("");
const email = ref("");
const delivery = ref("pickup");
const payment = ref("cash");
const address = ref("");
const agree = ref(false);
const orderComment = ref("");
const message = ref("");
const submitted = ref(false);
const invoiceFile = ref(null);

const nameError = ref("");
const phoneError = ref("");
const emailError = ref("");
const agreeError = ref("");
const addressError = ref("");
const invoiceError = ref("");

const nameRegex = /.{3,}/;
const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

watch(name, (val) => {
  nameError.value = nameRegex.test(val.trim())
    ? ""
    : "Имя должно быть не меньше 3 символов.";
});
watch(phone, (val) => {
  phoneError.value = phoneRegex.test(val)
    ? ""
    : "Введите телефон в формате: +7 (962) 903-48-37";
});
watch(email, (val) => {
  emailError.value = emailRegex.test(val) ? "" : "Введите корректный email.";
});
watch(agree, (val) => {
  agreeError.value = val ? "" : "Пожалуйста, подтвердите согласие.";
});
watch(address, (val) => {
  if (delivery.value === "courier") {
    addressError.value =
      val.trim().length >= 5
        ? ""
        : "Введите адрес доставки (не меньше 5 символов).";
  } else {
    addressError.value = "";
  }
});
watch(delivery, () => {
  if (delivery.value !== "courier") addressError.value = "";
});
watch(invoiceFile, (val) => {
  if (payment.value === "invoice") {
    invoiceError.value = val ? "" : "Прикрепите файл с реквизитами.";
  } else {
    invoiceError.value = "";
  }
});
watch(payment, () => {
  if (payment.value !== "invoice") invoiceError.value = "";
});

const isFormValid = computed(() => {
  const addressOk =
    delivery.value !== "courier" || address.value.trim().length >= 5;
  const invoiceOk = payment.value !== "invoice" || invoiceFile.value;
  return (
    nameRegex.test(name.value.trim()) &&
    phoneRegex.test(phone.value) &&
    emailRegex.test(email.value) &&
    agree.value &&
    addressOk &&
    invoiceOk
  );
});

watch(isFormValid, (val) => {
  if (val && message.value === "Пожалуйста, заполните корректно все поля.") {
    message.value = "";
  }
});

const handleInvoiceFile = (event) => {
  invoiceFile.value = event.target.files[0];
};

const submitOrder = async () => {
  message.value = "";

  if (!isFormValid.value) {
    if (!nameRegex.test(name.value.trim()))
      nameError.value = "Имя должно быть не меньше 3 символов.";
    if (!phoneRegex.test(phone.value))
      phoneError.value = "Введите телефон в формате: +7 (962) 903-48-37";
    if (!emailRegex.test(email.value))
      emailError.value = "Введите корректный email.";
    if (!agree.value) agreeError.value = "Пожалуйста, подтвердите согласие.";
    if (delivery.value === "courier" && address.value.trim().length < 5)
      addressError.value = "Введите адрес доставки (не меньше 5 символов).";
    if (payment.value === "invoice" && !invoiceFile.value)
      invoiceError.value = "Прикрепите файл с реквизитами.";

    message.value = "Пожалуйста, заполните корректно все поля.";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("phone", phone.value);
    formData.append("email", email.value);
    formData.append("delivery", delivery.value);
    formData.append("payment", payment.value);
    formData.append("address", address.value);
    formData.append("orderComment", orderComment.value);

    if (invoiceFile.value) {
      formData.append("invoiceFile", invoiceFile.value);
    }

    cart.items.forEach((item, index) => {
      formData.append(`items[${index}][title]`, item.title);
      formData.append(`items[${index}][price]`, item.price);
      formData.append(
        `items[${index}][simpleDesign]`,
        item.simpleDesign ? "true" : ""
      );
      formData.append(
        `items[${index}][photoRedraw]`,
        item.photoRedraw ? "true" : ""
      );
      formData.append(`items[${index}][comment]`, item.comment || "");

      if (item.options) {
        Object.entries(item.options).forEach(([key, val]) => {
          formData.append(`items[${index}][options][${key}]`, val);
        });
      }

      if (item.files?.length) {
        item.files.forEach((file, fileIndex) => {
          formData.append(`items[${index}][files][${fileIndex}]`, file);
        });
      }
    });

    const response = await $fetch("/api/send-order", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      submitted.value = true;
      message.value = "Спасибо! Ваш заказ отправлен.";
      cart.clearCart();
      navigateTo(`/thank-you?order=${response.orderId}`);
    } else {
      message.value = "Ошибка при отправке заказа: " + response.error;
    }
  } catch (err) {
    message.value = "Ошибка сети или сервера: " + err.message;
  }
};
</script>

<template>
  <div class="space-y-4 w-full">
    <h2 class="text-xl font-bold">Данные покупателя</h2>

    <div>
      <input
        v-model="name"
        type="text"
        placeholder="Имя"
        required
        minlength="3"
        class="border px-2 py-1 w-full rounded"
      />
      <div class="text-red-600 text-sm">{{ nameError }}</div>
    </div>

    <div>
      <IMaskComponent
        v-model="phone"
        :mask="'+7 (000) 000-00-00'"
        :lazy="false"
        placeholder="Телефон"
        class="border px-2 py-1 w-full rounded"
      />
      <div class="text-red-600 text-sm">{{ phoneError }}</div>
    </div>

    <div>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="border px-2 py-1 w-full rounded"
      />
      <div class="text-red-600 text-sm">{{ emailError }}</div>
    </div>

    <div class="mt-4 space-y-2">
      <h3 class="font-semibold">Доставка</h3>
      <label class="flex items-center gap-2">
        <input type="radio" value="pickup" v-model="delivery" /> Самовывоз из
        нашего <NuxtLink to="#">офиса</NuxtLink> на
        <Icon
          name="simple-icons:moscowmetro"
          size="20"
          class="text-[#d4212d] -mr-1"
        />Нагатинская.
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" value="courier" v-model="delivery" /> Курьер
      </label>
      <div v-if="delivery === 'courier'">
        <input
          v-model="address"
          type="text"
          placeholder="Адрес доставки"
          class="border px-2 py-1 w-full rounded"
        />
        <div class="text-red-600 text-sm">{{ addressError }}</div>
      </div>
    </div>

    <div class="mt-4 space-y-2">
      <h3 class="font-semibold">Оплата</h3>
      <label class="flex items-center gap-2 text-gray-400 cursor-not-allowed">
        <input type="radio" value="card" v-model="payment" disabled /> Онлайн
        картой
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" value="cash" v-model="payment" /> Наличные курьеру
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" value="invoice" v-model="payment" /> По счёту (юр.
        лица)
      </label>
    </div>

    <div v-if="payment === 'invoice'" class="mt-2">
      <label class="block">
        Загрузите реквизиты:
        <input
          type="file"
          @change="handleInvoiceFile"
          class="border px-2 py-1 w-full rounded mt-1"
        />
      </label>
      <div class="text-red-600 text-sm">{{ invoiceError }}</div>
    </div>

    <label class="block mt-4">
      Комментарий к заказу:
      <textarea
        v-model="orderComment"
        placeholder="Пожелания к заказу: например, срок, упаковка, детали доставки"
        class="mt-1 border px-2 py-1 w-full rounded"
        rows="3"
      ></textarea>
    </label>

    <label class="flex items-center gap-2 mt-4">
      <input type="checkbox" v-model="agree" />
      Я согласен с
      <a href="/privacy" class="underline hover:text-danger"
        >политикой конфиденциальности</a
      >
    </label>
    <div class="text-red-600 text-sm">{{ agreeError }}</div>

    <div
      v-if="message"
      :class="[submitted ? 'text-green-600' : 'text-red-600']"
      class="italic"
    >
      {{ message }}
    </div>

    <button
      @click="submitOrder"
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow w-full"
    >
      Отправить заказ
    </button>
  </div>
</template>
