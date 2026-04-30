<template>
  <div class="w-full">
    <van-field
      v-model="result"
      class="border-b"
      :is-link="!readOnly"
      readonly
      name="datePicker"
      placeholder="点击选择时间"
      @click="!readOnly && (showPicker = true)"
    />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker-group
        title="预约日期"
        :tabs="tabs"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      >
        <van-date-picker
          v-if="attribute.type !== 'time'"
          v-model="currentDate"
          :min-date="range.minDate"
        />
        <van-time-picker
          v-if="attribute.type !== 'date'"
          v-model="currentTime"
        />
      </van-picker-group>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useFormItem } from "element-plus";
import dayjs from "dayjs";

const { formItem } = useFormItem();

const props = withDefaults(
  defineProps<{
    config: any;
    value: any;
    readOnly: boolean;
  }>(),
  {
    config: () => {},
    value: undefined,
    readOnly: false,
  }
);

const attribute = computed(() => props.config.children[0].attribute);

const range = {
  minDate: new Date(1970, 0, 1),
};

const tabs = computed(() => {
  let result: string[] = [];
  switch (attribute.value["type"]) {
    case "date":
      result = ["选择日期"];
      break;
    case "time":
      result = ["选择时间"];
      break;
    case "datetime":
      result = ["选择日期", "选择时间"];
      break;
    default:
      break;
  }
  return result;
});

const emit = defineEmits(["update:value", "triggerSkip"]);

const result = ref("");
const showPicker = ref(false);
const currentDate = ref<string[]>([]);
const currentTime = ref<string[]>([]);

const isEmpty = ref(true);
watch(
  () => isEmpty.value,
  () => {
    emit("triggerSkip", !isEmpty.value, result.value, props.config);
  }
);

const getDateFormat = () => {
  const { type, format } = attribute.value;
  if (format) return format;
  if (type === "datetime") return "YYYY-MM-DD HH:mm";
  if (type === "date") return "YYYY-MM-DD";
  if (type === "time") return "HH:mm";
};

const transformDateTime = (value: any) => {
  const { date, time } = value;
  const dateFormat = getDateFormat();
  const dateStr = `${date.join("-")} ${time.join(":")}`;
  return dayjs(dateStr, "YYYY-MM-DD HH:mm").format(dateFormat);
};

watch(
  () => props.value,
  (val: string | undefined) => {
    if (val) {
      const dateFormat = getDateFormat();
      const dateTime = dayjs(val, dateFormat).format("YYYY-MM-DD HH:mm");
      const arr = dateTime.split(" ");
      currentDate.value = arr[0].split("-");
      currentTime.value = arr[1]?.split(":") ?? ["00", "00"];
      result.value = val;
    } else {
      const currentDay = dayjs(new Date()).format("YYYY-MM-DD");
      currentDate.value = currentDay.split("-");
      currentTime.value = ["00", "00"];
      result.value = "";
    }
  },
  { immediate: true }
);

const onConfirm = () => {
  result.value = transformDateTime({
    date: currentDate.value,
    time: currentTime.value,
  });
  emit("update:value", result.value);
  formItem?.validate("change");
  isEmpty.value = !result.value;
  showPicker.value = false;
};
</script>

<style></style>
