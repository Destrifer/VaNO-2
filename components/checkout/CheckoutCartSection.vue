<script setup>
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";

const cart = useCartStore();

const removeItem = (index) => {
  cart.items.splice(index, 1);
};

const removeFile = (itemIndex, fileIndex) => {
  cart.items[itemIndex].files.splice(fileIndex, 1);
};

const onFilesChange = (e, itemIndex) => {
  const files = Array.from(e.target.files);
  const allowedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "tiff",
    "svg",
    "pdf",
    "ai",
    "psd",
    "rar",
    "zip",
  ];

  const validFiles = files.filter((file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.includes(ext);
  });

  if (!cart.items[itemIndex].files) {
    cart.items[itemIndex].files = [];
  }

  cart.items[itemIndex].files = [
    ...cart.items[itemIndex].files,
    ...validFiles,
  ].slice(0, 3);
};

const cartTotal = computed(() => {
  return cart.items.reduce((sum, item) => {
    let extraPrice = 0;
    if (item.simpleDesign) extraPrice += 900;
    if (item.photoRedraw) extraPrice += 500;
    return sum + item.price + extraPrice;
  }, 0);
});
</script>

<template>
  <div class="space-y-6 w-full">
    <h2 class="text-2xl font-bold">Ваш заказ</h2>

    <div v-if="cart.items.length === 0" class="text-gray-600">
      Ваша корзина пуста.
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="(item, index) in cart.items"
        :key="index"
        class="border p-4 rounded relative flex gap-4"
      >
        <button
          @click="removeItem(index)"
          class="absolute top-0 right-2 text-3xl text-red-500 hover:text-red-700 hover:cursor-pointer"
        >
          ×
        </button>

        <!-- Иконка -->
        <div class="self-start">
          <img
            :src="item.icon || '/icons/default.svg'"
            alt="Иконка"
            class="w-full h-full object-contain rounded"
          />
        </div>

        <!-- Информация -->
        <div class="flex-1 space-y-2">
          <div class="font-semibold text-2xl">{{ item.title }}</div>

          <ul v-if="item.options" class="text-sm text-gray-700 space-y-1">
            <li v-for="(val, key) in item.options" :key="key">
              <template v-if="key.toLowerCase() === 'тираж'">
                <template v-if="Array.isArray(val)">
                  <div class="flex justify-between">
                    <strong>Тираж:</strong>
                    {{ val.reduce((sum, qty) => sum + qty, 0) }} шт
                  </div>
                  <ul class="pl-4 list-disc">
                    <li v-for="(qty, i) in val" :key="i">
                      Вид {{ i + 1 }}: {{ qty }} шт
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <div class="flex justify-between">
                    <strong>Тираж:</strong> {{ val }} шт
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="flex justify-between text-right">
                  <strong class="text-left">{{ key }}:</strong> {{ val }}
                </div>
              </template>
            </li>
          </ul>

          <div class="flex justify-between">
            Базовая цена: <strong>{{ item.price }} ₽</strong>
          </div>

          <div class="space-y-1">
            <label class="flex items-center gap-2 justify-between">
              <span
                ><input type="checkbox" v-model="item.simpleDesign" /> Простой
                дизайн</span
              >
              +900 ₽
            </label>
            <label class="flex items-center gap-2 justify-between">
              <span>
                <input type="checkbox" v-model="item.photoRedraw" />
                Отрисовка по фото</span
              >
              +500 ₽
            </label>
          </div>

          <div class="space-y-2">
            <label class="block text-sm text-gray-600 font-medium">
              Выберите файлы макета:
            </label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.tiff,.svg,.pdf,.ai,.psd,.rar,.zip"
              @change="onFilesChange($event, index)"
              class="border p-2 rounded w-full"
            />
            <div v-if="item.files?.length" class="mt-2 space-y-1">
              <div
                v-for="(file, fileIndex) in item.files"
                :key="fileIndex"
                class="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span class="text-sm truncate">{{ file.name }}</span>
                <button
                  @click="removeFile(index, fileIndex)"
                  class="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div v-if="item.files?.length">
            <textarea
              v-model="item.comment"
              placeholder="Комментарий к макету..."
              class="border p-2 rounded w-full mt-2"
              rows="2"
            ></textarea>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="cart.items.length > 0" class="text-right text-xl font-bold">
      Общая сумма:
      <span class="text-green-600">{{ cartTotal }} ₽</span>
    </div>
  </div>
</template>
