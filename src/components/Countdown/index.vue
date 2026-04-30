<template>
  <div class="countdown flex items-center">
    <div v-if="durationFormatter.dd">{{ durationFormatter.dd }}</div>
    <span v-if="durationFormatter.dd">:</span>
    <div v-if="durationFormatter.hh">{{ durationFormatter.hh }}</div>
    <span v-if="durationFormatter.hh">:</span>
    <div v-if="durationFormatter.mm">{{ durationFormatter.mm }}</div>
    <span v-if="durationFormatter.mm">:</span>
    <div>{{ durationFormatter.ss }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from "vue";

const props = defineProps({
  autoStart: {
    type: Boolean,
    default: true,
  },
  endTime: {
    type: Number,
    default: 1000,
  },
  config: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["finish"]);
const interval = 1000;

let timer: any = null;

const timeLeft = ref(0);

const durationFormatter = computed(() => {
  const time = timeLeft.value;
  if (!time) return { ss: 0 };
  let t = time;
  const ss = t % 60;
  t = (t - ss) / 60;
  if (t < 1)
    return {
      ss: ss.toString().padStart(2, "0"),
    };
  const mm = t % 60;
  t = (t - mm) / 60;
  if (t < 1)
    return {
      mm: mm.toString().padStart(2, "0"),
      ss: ss.toString().padStart(2, "0"),
    };
  const hh = t % 24;
  t = (t - hh) / 24;
  if (t < 1)
    return {
      hh: hh.toString().padStart(2, "0"),
      mm: mm.toString().padStart(2, "0"),
      ss: ss.toString().padStart(2, "0"),
    };
  const dd = t;
  return {
    dd: dd.toString().padStart(2, "0"),
    hh: hh.toString().padStart(2, "0"),
    mm: mm.toString().padStart(2, "0"),
    ss: ss.toString().padStart(2, "0"),
  };
});

const start = () => {
  if (!timer && timeLeft.value > 0) {
    timer = setInterval(() => {
      --timeLeft.value;
      if (timeLeft.value <= 0) {
        timeLeft.value = 0;
        clearInterval(timer);
        emit("finish");
      }
    }, interval);
  }
};

// 暂停
const stop = () => {
  clearInterval(timer);
  timer = null;
};

// 重启
const restart = () => {
  stop();
  initLeftTime();
  start();
};

const initLeftTime = () => {
  const { timeLength, timeUnit } = props.config;
  if (timeUnit === "1") {
    // 分钟
    timeLeft.value = timeLength * 60;
  } else if (timeUnit === "2") {
    // 小时
    timeLeft.value = timeLength * 60 * 60;
  } else {
    // 秒
    timeLeft.value = timeLength;
  }
};

onMounted(() => {
  initLeftTime();
  props.autoStart && start();
});

onBeforeUnmount(() => {
  stop();
});

defineExpose({
  stop,
  restart,
});
</script>

<style lang="less" scoped>
.countdown div {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #333;
  color: #fff;
  margin: 0 5px;
  font-size: 18px;
  font-weight: 500;
}
.countdown span {
  font-size: 18px;
  line-height: 30px;
  font-weight: 500;
}
</style>
