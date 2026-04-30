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
  atMost: {
    type: Number,
    default: 2,
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
        name: item.name,
        emphasis: {
          focus: "series",
        },
        barGap: 0,
        data: Object.keys(item)
          .filter((key: string) => key.includes("sort"))
          .map((key: string) => item[key]),
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
        data: props.dataSource.map((item: any) => item.name),
      },
      xAxis: {
        type: "category",
        axisTick: { show: false },
        data: [...new Array(props.atMost)].map(
          (item: any, index: number) => `排序${index + 1}`
        ),
      },
      yAxis: {
        type: "value",
      },
      series: _series,
    });
  } else if (props.chartType === "radar") {
    setOptions({
      toolbox: {
        feature: {
          saveAsImage: {
            title: "保存图片",
            type: "png",
          },
        },
      },
      legend: {
        show: true,
        right: "20%",
        top: "center",
        orient: "vertical",
        data: props.dataSource.map((item: any) => item.name),
      },
      tooltip: {
        show: true,
        trigger: "item",
      },
      radar: {
        indicator: [...new Array(props.atMost)].map(
          (item: any, index: number) => {
            return {
              name: `排序${index + 1}`,
            };
          }
        ),
        splitArea: {
          show: true,
        },
      },
      series: [
        {
          type: "radar",
          data: props.dataSource.map((item: any) => {
            return {
              name: item.name,
              value: Object.keys(item)
                .filter((key: string) => key.includes("sort"))
                .map((key: string) => item[key]),
            };
          }),
        },
      ],
    });
  }
};

onMounted(() => {
  initChart();
});
</script>
