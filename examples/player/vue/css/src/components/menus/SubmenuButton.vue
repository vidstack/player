<script setup lang="ts">
const { label } = defineProps<{
  label: string;
}>();
</script>

<template>
  <media-menu-button class="button">
    <media-icon class="close-icon" type="chevron-left" />
    <div class="icon">
      <slot name="icon" />
    </div>
    <span class="label">{{ label }}</span>
    <span class="hint" data-part="hint"></span>
    <media-icon class="open-icon" type="chevron-right" />
  </media-menu-button>
</template>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  appearance: none;
  padding: 10px;
  border-radius: 2px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.button[data-open] {
  position: sticky;
  top: calc(-1 * 10px);
  left: 0;
  width: 100%;
  z-index: 10;
  backdrop-filter: blur(4px);
  border-radius: 0;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom: 1px solid rgb(245 245 245 /0.15);
  background-color: rgb(10 10 10 / 0.6);
}

.button[data-focus] {
  background-color: rgb(245 245 245 / 0.08);
}

.button[aria-disabled='true'],
.button[aria-hidden='true'] {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .button:hover {
    cursor: pointer;
    background-color: rgb(245 245 245 / 0.08);
  }
}

.button:not([data-open]) .label {
  margin-left: 6px;
}

.close-icon {
  margin-right: 6px;
}

.open-icon,
.close-icon {
  width: 18px;
  height: 18px;
  display: none;
}

.hint,
.open-icon {
  margin-left: auto;
  color: rgb(245 245 245 / 0.5);
  font-size: 14px;
}

.hint:not(:empty) + .open-icon,
.hint:not(:empty) + media-icon .open-icon {
  margin-left: 2px;
}

.button:not([data-open]) .open-icon {
  display: inline-block;
}

.button[data-open] .close-icon {
  display: inline-block;
}

.icon {
  display: contents;
}

.button[data-open] .icon {
  display: none;
}
</style>
