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
  chartType: {
    type: String,
    default: "bar",
  },
});

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

watch(
  () => props.chartType,
  () => {
    initChart();
  }
);

watch(
  () => props.dataSource,
  () => {
    initChart();
  },
  { deep: true }
);

const initChart = () => {
  if (["line", "bar"].includes(props.chartType)) {
    setOptions({
      toolbox: {
        feature: {
          saveAsImage: {
            title: "保存图片",
            type: "png",
          },
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: props.dataSource.map((item: any) => item.name),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: props.dataSource.map((item: any) => item.value),
          type: props.chartType as "bar" | "line",
        },
      ],
    });
  } else if (props.chartType === "pie") {
    setOptions({
      toolbox: {
        feature: {
          saveAsImage: {
            title: "保存图片",
            type: "png",
          },
        },
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          type: "pie",
          radius: "50%",
          data: props.dataSource as any[],
          label: {
            show: true,
            formatter: "{b}\n{d}%",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
  }
};

onMounted(() => {
  initChart();
});
</script>
