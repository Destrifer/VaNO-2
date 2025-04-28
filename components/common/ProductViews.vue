<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const recomputeViews = (totalQty, viewsCount) => {
  const baseQty = Math.floor(totalQty / viewsCount);
  const views = Array(viewsCount)
    .fill()
    .map(() => ({ qty: baseQty }));

  let remaining = totalQty - baseQty * viewsCount;
  for (let i = 0; i < views.length && remaining > 0; i++, remaining--) {
    views[i].qty += 1;
  }

  return views;
};

const addView = () => {
  if (props.modelValue.length < 5) {
    const totalQty = props.modelValue.reduce(
      (sum, view) => sum + (Number(view.qty) || 0),
      0
    );
    const newViews = recomputeViews(totalQty, props.modelValue.length + 1);
    emit("update:modelValue", newViews);
  }
};

const removeView = (index) => {
  if (props.modelValue.length > 1) {
    const totalQty = props.modelValue.reduce(
      (sum, view) => sum + (Number(view.qty) || 0),
      0
    );
    const updatedViews = [...props.modelValue];
    updatedViews.splice(index, 1);

    const newViews = recomputeViews(totalQty, updatedViews.length);

    emit("update:modelValue", newViews);
  }
};

const updateQty = (index, value) => {
  const updated = [...props.modelValue];
  updated[index].qty = Number(value);
  emit("update:modelValue", updated);
};

const colors = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
];
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Виды продукции:</h2>

    <div
      v-for="(view, index) in modelValue"
      :key="index"
      :class="[
        'flex items-center gap-2 mb-2 p-2 rounded',
        colors[index % colors.length],
      ]"
    >
      <input
        type="number"
        min="1"
        class="border px-2 py-1 w-24"
        v-model.number="modelValue[index].qty"
        @input="updateQty(index, modelValue[index].qty)"
      />
      <button
        v-if="modelValue.length > 1"
        @click="removeView(index)"
        class="text-red-500 hover:underline text-sm"
      >
        Удалить
      </button>
    </div>

    <button
      v-if="modelValue.length < 5"
      @click="addView"
      class="text-blue-600 hover:underline text-sm mt-2"
    >
      + Добавить вид
    </button>

    <div class="text-gray-600 mt-2">
      Суммарный тираж:
      <strong>{{
        modelValue.reduce((sum, v) => sum + (Number(v.qty) || 0), 0)
      }}</strong>
    </div>
  </div>
</template>
