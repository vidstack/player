<template>
  <div class="group">
    <media-time class="vds-time" type="current" />
    <div class="divider">/</div>
    <media-time class="vds-time" type="duration" />
  </div>
</template>

<style scoped>
.group {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.divider {
  margin: 0 2.5px;
  color: #e0e0e0;
}
</style>
