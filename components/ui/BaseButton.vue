<template>
  <button
    :class="[
      'inline-block font-semibold rounded-full transition-colors duration-200',
      sizeClass,
      variantClass,
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: "md", // md / sm / lg
  },
  variant: {
    type: String,
    default: "primary", // primary / outline / danger / etc
  },
});

const sizeClass = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm-fluid",
  lg: "px-5 py-3 text-md-fluid",
}[props.size];

const variantClass = {
  primary: "bg-text text-primary hover:bg-link cursor-pointer",
  outline: "border border-text text-text hover:bg-text hover:text-primary",
  danger: "bg-danger text-white hover:bg-red-600",
}[props.variant];
</script>
