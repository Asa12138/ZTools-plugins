<script setup lang="ts">
import { ref } from 'vue';
import Icon from './Icon.vue';
import { useSourceStore } from '@/stores/sources';

const emit = defineEmits<{ (e: 'close'): void; (e: 'done'): void }>();

const store = useSourceStore();

const tab = ref<'url' | 'sub' | 'file' | 'code'>('url');
const url = ref('');
const subUrl = ref('');
const code = ref('');
const agreed = ref(false);
const error = ref('');

async function submit() {
  error.value = '';
  try {
    if (tab.value === 'url') {
      if (!url.value.trim()) return (error.value = '请输入音源链接');
      await store.installFromUrl(url.value.trim());
    } else if (tab.value === 'sub') {
      if (!subUrl.value.trim()) return (error.value = '请输入订阅链接');
      await store.installFromJsonUrl(subUrl.value.trim());
    } else if (tab.value === 'file') {
      const res = await store.installFromFile();
      if (!res) return;
    } else if (tab.value === 'code') {
      if (!code.value.trim()) return (error.value = '请粘贴音源代码');
      if (!agreed.value) return (error.value = '请先确认音源安全须知');
      await store.installFromCode(code.value);
    }
    emit('done');
    emit('close');
  } catch (e: any) {
    error.value = e?.message || '安装失败';
  }
}
</script>

<template>
  <div class="mask" @click.self="emit('close')">
    <div class="modal card">
      <div class="head">
        <div>
          <h3>添加音源</h3>
          <p class="text-2">兼容 MusicFree 协议的音源插件（.js 单文件）</p>
        </div>
        <button class="icon-btn" @click="emit('close')"><Icon name="close" :size="18" /></button>
      </div>

      <div class="tabs">
        <button :class="{ on: tab === 'url' }" @click="tab = 'url'"><Icon name="link" :size="15" />链接安装</button>
        <button :class="{ on: tab === 'sub' }" @click="tab = 'sub'"><Icon name="cloud" :size="15" />订阅导入</button>
        <button :class="{ on: tab === 'file' }" @click="tab = 'file'"><Icon name="folder" :size="15" />本地文件</button>
        <button :class="{ on: tab === 'code' }" @click="tab = 'code'"><Icon name="code" :size="15" />粘贴代码</button>
      </div>

      <div class="body">
        <template v-if="tab === 'url'">
          <input v-model="url" class="field" placeholder="https://example.com/plugin.js" spellcheck="false" />
          <p class="hint">支持以 <code>.js</code> 结尾的音源直链。</p>
        </template>

        <template v-else-if="tab === 'sub'">
          <input v-model="subUrl" class="field" placeholder="https://example.com/plugins.json" spellcheck="false" />
          <p class="hint">订阅文件格式：<code>{ "plugins": [{ "name": "...", "url": "....js" }] }</code></p>
        </template>

        <template v-else-if="tab === 'file'">
          <button class="file-drop card" @click="submit">
            <Icon name="upload" :size="28" />
            <span>点击选择本地音源文件</span>
            <small class="text-3">支持 .js 与 .json 订阅</small>
          </button>
        </template>

        <template v-else>
          <textarea v-model="code" class="field code" rows="8" placeholder="// 粘贴 MusicFree 音源代码" spellcheck="false"></textarea>
          <label class="agree">
            <input v-model="agreed" type="checkbox" />
            <span>我了解音源为第三方代码，将以本地权限运行，仅加载可信来源</span>
          </label>
        </template>

        <div v-if="error" class="err"><Icon name="info" :size="15" />{{ error }}</div>
      </div>

      <div class="foot">
        <button class="btn ghost" @click="emit('close')">取消</button>
        <button v-if="tab !== 'file'" class="btn primary" :disabled="store.installing" @click="submit">
          <Icon v-if="store.installing" name="refresh" :size="15" class="spin" />
          {{ store.installing ? '安装中…' : '安装' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: fadeIn 0.2s ease;
}
.modal {
  width: min(560px, 92vw);
  padding: 22px;
  box-shadow: var(--shadow);
  animation: floatUp 0.22s ease;
}
.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}
.head h3 {
  margin: 0 0 4px;
  font-size: 18px;
}
.head p {
  margin: 0;
  font-size: 12px;
}
.tabs {
  display: flex;
  gap: 6px;
  padding: 4px;
  background: var(--panel-hover);
  border-radius: 12px;
  margin-bottom: 16px;
}
.tabs button {
  flex: 1;
  height: 34px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
  transition: all 0.16s ease;
}
.tabs button.on {
  background: var(--panel-solid);
  color: var(--text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.body {
  min-height: 120px;
}
.field {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  background: var(--panel-hover);
  border: 1px solid var(--border);
  font-size: 14px;
  transition: border-color 0.16s ease;
}
.field:focus {
  border-color: var(--accent-1);
}
textarea.field {
  height: auto;
  padding: 12px 14px;
  resize: vertical;
  line-height: 1.5;
  font-family: 'Consolas', 'Menlo', monospace;
  font-size: 12.5px;
}
.hint {
  font-size: 12px;
  color: var(--text-3);
  margin: 10px 2px 0;
}
.hint code,
code {
  background: var(--panel-hover);
  padding: 1px 5px;
  border-radius: 5px;
}
.agree {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  font-size: 12.5px;
  color: var(--text-2);
  cursor: pointer;
}
.agree input {
  margin-top: 2px;
}
.file-drop {
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-2);
  transition: all 0.16s ease;
}
.file-drop:hover {
  border-color: var(--accent-1);
  color: var(--text);
}
.err {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #f87171;
  font-size: 12.5px;
}
.foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.spin {
  animation: spin 0.8s linear infinite;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
}
</style>
