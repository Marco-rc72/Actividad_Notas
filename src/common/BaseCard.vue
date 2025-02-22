<template>
  <div
    :class="[
      'bg-white rounded-xl border border-gray-100 shadow-sm transition-all',
      'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      className,
    ]"
    role="region"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: '',
})
</script>
