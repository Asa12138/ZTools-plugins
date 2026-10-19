<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/Icon.vue';
import { useSettingsStore } from '@/stores/settings';
import { services } from '@/api/services';
import { QUALITY_LABELS } from '@/utils/format';

const settings = useSettingsStore();

const themes = [
  { value: 'auto', label: '跟随系统' },
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
];
const qualities = ['low', 'standard', 'high', 'super'];

const storageLabel = computed(() => {
  let kind = '';
  try {
    kind = services().storage.kind();
  } catch (e) {
    kind = '';
  }
  if (kind === 'ztools') return 'ZTools 数据库（支持官方数据同步）';
  if (kind === 'local') return '浏览器本地存储（开发预览）';
  return '临时内存存储（开发预览）';
});

const appVersion = computed(() => (window as any).services?.version || '0.1.0');
</script>

<template>
  <div class="view">
    <div class="head">
      <h2>设置</h2>
      <p class="text-2">个性化你的播放体验</p>
    </div>

    <section class="card group">
      <h3><Icon name="sparkles" :size="17" />外观</h3>
      <div class="row">
        <span>主题模式</span>
        <div class="seg">
          <button
            v-for="t in themes"
            :key="t.value"
            :class="{ on: settings.theme === t.value }"
            @click="settings.patch({ theme: t.value as any })"
          >
            {{ t.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="card group">
      <h3><Icon name="music" :size="17" />播放</h3>
      <div class="row">
        <span>默认音质</span>
        <div class="seg">
          <button
            v-for="q in qualities"
            :key="q"
            :class="{ on: settings.quality === q }"
            @click="settings.patch({ quality: q as any })"
          >
            {{ QUALITY_LABELS[q] }}
          </button>
        </div>
      </div>
      <div class="row">
        <span>自动播放下一首</span>
        <button class="switch" :class="{ on: settings.autoNext }" @click="settings.patch({ autoNext: !settings.autoNext })">
          <span></span>
        </button>
      </div>
      <div class="row">
        <span>歌词显示翻译</span>
        <button
          class="switch"
          :class="{ on: settings.showTranslation }"
          @click="settings.patch({ showTranslation: !settings.showTranslation })"
        >
          <span></span>
        </button>
      </div>
    </section>

    <section class="card group">
      <h3><Icon name="folder" :size="17" />数据</h3>
      <div class="row">
        <span>数据存储</span>
        <span class="text-3 path ellipsis">{{ storageLabel }}</span>
      </div>
    </section>

    <section class="card group about">
      <div class="logo"><Icon name="music" :size="26" /></div>
      <div>
        <h4>Worldme 音乐 <span class="tag">v{{ appVersion }}</span></h4>
        <p class="text-2">
          兼容 MusicFree 协议的插件化音乐播放器。播放器不内置任何音源，所有内容均来自用户自行加载的第三方音源。
        </p>
        <p class="text-3 small">请仅加载可信音源，遵守相关法律法规，勿用于商业用途。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.view {
  height: 100%;
  overflow-y: auto;
  padding: 4px 26px 30px;
}
.head {
  margin: 6px 0 18px;
}
.head h2 {
  margin: 0 0 6px;
  font-size: 24px;
}
.head p {
  margin: 0;
  font-size: 13px;
}
.group {
  padding: 18px 22px;
  margin-bottom: 14px;
}
.group h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  font-size: 15px;
  color: var(--accent-2);
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  font-size: 13.5px;
  border-top: 1px solid var(--border);
}
.row:first-of-type {
  border-top: none;
}
.seg {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--panel-hover);
  border-radius: 11px;
}
.seg button {
  height: 30px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 12.5px;
  color: var(--text-2);
  transition: all 0.16s ease;
}
.seg button.on {
  background: var(--accent-grad);
  color: #fff;
}
.switch {
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: var(--border-strong);
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;
}
.switch span {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}
.switch.on {
  background: var(--accent-grad);
}
.switch.on span {
  transform: translateX(18px);
}
.path {
  max-width: 46%;
  font-size: 12px;
}
.about {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.about .logo {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--accent-grad);
  flex-shrink: 0;
}
.about h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 16px;
}
.about p {
  margin: 0 0 6px;
  font-size: 12.5px;
  line-height: 1.65;
}
.small {
  font-size: 11.5px;
}
</style>
