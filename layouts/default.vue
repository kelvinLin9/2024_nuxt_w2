<template>
  <div>
    <LayoutHeader />
    <slot />
    <LayoutFooter />
  </div>
</template>

<script setup>
import LayoutHeader from '~/components/layout/Header.vue'
import LayoutFooter from '~/components/layout/Footer.vue'
</script>

<style scoped></style>
