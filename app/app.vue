<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useApp } from '~/scripts/app.js'

useApp()
</script>

<style scoped>
/* Global scoped styles for layout root */
</style>
