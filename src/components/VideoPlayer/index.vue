<template>
  <div
    :id="`mse-${videoId}-${preview ? 'design' : ''}`"
    class="h-full bg-black"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import type { IPlayerOptions } from "xgplayer";
import Player, { Events, Sniffer } from "xgplayer";
import HlsPlugin from "xgplayer-hls";
import "xgplayer/dist/index.min.css";
import { useThrottleFn } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    videoId: any;
    preview?: boolean;
  }>(),
  {
    videoId: () => {},
    preview: false,
  }
);

let player: any = null;

const initPlayerOptions = () => {
  const isDev = import.meta.env.DEV;
  const { videoId, preview } = props;
  const { isPc } = Sniffer.os;
  const videoUrl = isDev
    ? `http://10.71.29.43:8000/zfsoft-api/zhfw/spfw/preview/${videoId}/${videoId}.m3u8`
    : `${location.origin}/zfsoft-api/zhfw/spfw/preview/${videoId}/${videoId}.m3u8`;
  const posterUrl = isDev
    ? `http://10.71.29.43:8000/zfsoft-api/zhfw/spfw/poster/${videoId}`
    : `${location.origin}/zfsoft-api/zhfw/spfw/poster/${videoId}`;
  const config: IPlayerOptions = {
    id: `mse-${videoId}-${preview ? "design" : ""}`,
    url: videoUrl,
    width: "100%",
    height: "100%",
    lang: "zh-cn",
    plugins: [HlsPlugin],
    playsinline: !isPc,
    poster: posterUrl,
    videoInit: true,
    autoplay: false,
    autoplayMuted: !isPc,
    // 默认音量，取值范围0-1
    volume: 0.5,
    // 是否循环播放
    loop: false,
    // 起播时间
    startTime: 0,
  };

  return config;
};

const initPlayer = () => {
  const options = initPlayerOptions();
  player = new Player(options);
  playerEventRegister();
};

/**
 * 播放器事件注册
 */
const playerEventRegister = () => {
  player.on(Events.AUTOPLAY_PREVENTED, () => {
    console.log("autoplay was prevented!!");
  });
  player.on(Events.AUTOPLAY_STARTED, () => {
    console.log("autoplay success!!");
  });
  player.on(Events.PLAY, () => {
    console.log("开始播放");
  });
  player.on(Events.ERROR, (error: any) => {
    console.log("播放错误", error);
    if (error.src) {
      errorReload();
    }
  });
};

watch(
  () => props.videoId,
  (newValue, oldValue) => {
    if (newValue === oldValue) return;
    if (player) {
      const config = initPlayerOptions();
      player.playNext(config);
    } else {
      initPlayer();
    }
  },
  { deep: true }
);

const errorReload = useThrottleFn(() => {
  player.reload();
}, 5000);

onMounted(() => {
  initPlayer();
});
</script>

<style lang="less" scoped></style>
