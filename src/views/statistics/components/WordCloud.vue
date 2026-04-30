<template>
  <div ref="chartRef" class="w-full h-300px"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type { Ref } from "vue";
import { useECharts } from "@/hooks/useEcharts";

const props = defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
});

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

const initChart = () => {
  setOptions({
    tooltip: {
      show: true,
      borderColor: "#fe9a8bb3",
      borderWidth: 1,
      padding: [10, 15, 10, 15],
      confine: true,
      backgroundColor: "rgba(255, 255, 255, .9)",
      textStyle: {
        color: "hotpink",
        lineHeight: 22,
      },
      extraCssText:
        "box-shadow: 0 4px 20px -4px rgba(199, 206, 215, .7);border-radius: 4px;",
    },
    series: [
      {
        type: "wordCloud",
        shape: "pentagon",
        left: "center",
        top: "center",
        width: "100%",
        height: "100%",
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [0, 0],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,

        textStyle: {
          fontWeight: 600,
          color: function () {
            let colors = [
              "#fe9a8bb3",
              "#fe9a8bb3",
              "#fe9a8b03",
              "#9E87FFb3",
              "#9E87FFb3",
              "#9E87FFb3",
              "#fe9a8bb3",
              "#fe9a8bb3",
              "#fe9a8bb3",
              "#73DDFF",
              "#58D5FF",
            ];
            return colors[Math.floor(Math.random() * colors.length)];
          },
        },
        emphasis: {
          focus: "none",
        },

        // Data is an array. Each array item must have name and value property.
        data: props.dataSource,
      },
    ],
  });
};

onMounted(() => {
  initChart();
});
</script>
