<template>
  <div class="relative">
    <div
      contenteditable="true"
      ref="inputArea"
      :class="['bg-transparent outline-none', inputAreaClass]"
      @input="handleInput"
      @keyup="handleKeyUp"
      @blur="handleInput"
      @cut="handleInput"
      @paste.prevent="handlePaste"
    ></div>
    <span
      :class="[
        'pointer-events-none absolute left-0 top-0 inline',
        {
          invisible: inputText.length > 0,
        },
        placeholderClass,
      ]"
      style="line-height: inherit"
    >
      {{ props.placeholder }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'placeholder',
  },
  inputAreaClass: {
    type: [String, Object, Array],
    default: '',
  },
  placeholderClass: {
    type: [String, Object, Array],
    default: '',
  },
});

const inputArea = ref<HTMLDivElement | null>(null);
const inputText = ref('');

const updateInputText = () => {
  if (!inputArea.value) return;
  let text = inputArea.value.innerText?.trim() || '';
  inputText.value = text;
};

const handleInput = () => {
  updateInputText();
};

const handleKeyUp = (e: KeyboardEvent) => {
  const keyCodes = ['Backspace', 'Delete'];
  if (keyCodes.includes(e.key) || (e.ctrlKey && e.key === 'a')) {
    setTimeout(updateInputText, 0);
  }
};

const handlePaste = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData('text/plain') || '';
  document.execCommand('insertText', false, text);
  updateInputText();
};

const clear = () => {
  if (inputArea.value) {
    inputArea.value.textContent = '';
    inputText.value = '';
  }
};

defineExpose({
  data: () => inputText.value,
  clear,
});
</script>
