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
  xLabels: {
    type: Array,
    default: () => [],
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

const initChart = () => {
  if (["line", "bar"].includes(props.chartType)) {
    const _series: any[] = props.dataSource.map((item: any) => {
      return {
        name: item.title,
        emphasis: {
          focus: "series",
        },
        barGap: 0,
        data: item.list.map((i: any) => i.value),
        type: props.chartType as "bar" | "line",
      };
    });
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
      legend: {
        data: props.dataSource.map((item: any) => item.title),
      },
      xAxis: {
        type: "category",
        axisTick: { show: false },
        data: props.xLabels as any,
      },
      yAxis: {
        type: "value",
      },
      series: _series,
    });
  } else if (props.chartType === "pie") {
    const _series: any[] = props.dataSource.map((item: any, index: number) => {
      return {
        type: "pie",
        radius: "50%",
        center: [
          `${
            100 / props.dataSource.length / 2 +
            (100 / props.dataSource.length) * index
          }%`,
          "50%",
        ],
        data: item.list as any[],
        label: {
          show: true,
          position: "inner",
          formatter: "{b}\n{d}%",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      };
    });
    setOptions({
      title: props.dataSource.map((item: any, index: number) => {
        return {
          subtext: item.title,
          left: `${
            100 / props.dataSource.length / 2 +
            (100 / props.dataSource.length) * index
          }%`,
          bottom: "0%",
          textAlign: "center",
        };
      }),
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
      series: _series as any,
    });
  }
};

onMounted(() => {
  initChart();
});
</script>
