<template>
  <media-radio class="radio">
    <div class="check" />
    <span class="label" data-part="label" />
  </media-radio>
</template>

<style scoped>
.radio {
  align-items: center;
  appearance: none;
  border-radius: 2px;
  contain: content;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  padding: 12px;
  position: relative;
  width: 100%;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.radio[data-focus] {
  background-color: rgb(245 245 245 / 0.08);
}

@media (hover: hover) and (pointer: fine) {
  .radio:hover {
    cursor: pointer;
    background-color: rgb(245 245 245 / 0.08);
  }
}

.check {
  align-items: center;
  border-radius: 9999px;
  display: flex;
  width: 9px;
  height: 9px;
  border: 2px solid rgb(245 245 245 / 0.5);
  justify-content: center;
  margin-right: 8px;
}

.radio[data-checked] .check {
  border: 2px solid var(--media-brand);
}

.radio[data-checked] .check::after {
  content: '';
  border-color: #f5f5f5;
  background-color: #f5f5f5;
  border-radius: 9999px;
  height: 4px;
  width: 4px;
}
</style>
