<template>
  <div class="w-full" ref="elRef">
    <el-row v-if="dataSource.length > 0">
      <el-col
        v-for="(item, index) in dataSource"
        :key="item.wjid"
        :span="span"
        class="flex justify-center"
      >
        <div class="survey-item" ref="itemRef">
          <div class="content" @mouseover="hoverIndex = index">
            <div class="flex justify-end" v-if="hoverIndex === index">
              <el-button
                v-permission="'edit'"
                size="small"
                @click="handleCopy(item)"
              >
                <el-icon><copyDocument /></el-icon>
                复制
              </el-button>
              <el-button
                v-permission="'edit'"
                size="small"
                @click="handleDelete(item)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
            <div class="body" :class="{ active: hoverIndex === index }">
              <div
                class="title"
                :class="{ active: hoverIndex === index }"
                :title="item['wjmc']"
                @click="handlePreview(item)"
              >
                {{ item.wjmc }}
              </div>
              <div>
                <div class="flex items-center justify-center">
                  <el-tag
                    class="cursor-default"
                    :type="
                      item.wjzt === '0'
                        ? 'info'
                        : item.wjzt === '1'
                        ? 'success'
                        : ''
                    "
                    effect="dark"
                    >{{ item.wjztmc }}</el-tag
                  >
                  <el-button
                    v-permission="'publish'"
                    style="font-size: 14px"
                    link
                    :type="
                      item.wjzt === '0'
                        ? 'info'
                        : item.wjzt === '1'
                        ? 'success'
                        : 'primary'
                    "
                    @click="handleRun(item)"
                  >
                    <el-icon class="el-icon--right" size="22">
                      <VideoPlay v-if="item.wjzt !== '1'" />
                      <VideoPause v-else />
                    </el-icon>
                  </el-button>
                </div>

                <div v-if="item.dtr === 'user'">
                  <el-progress
                    class="mt-10px"
                    v-if="item.ffsl && parseInt(item.ffsl) > 0"
                    :show-text="false"
                    :percentage="
                      (parseInt(item.djsl) / parseInt(item.ffsl)) * 100
                    "
                  >
                  </el-progress>
                  <div
                    class="progress flex justify-between text-xs"
                    :class="{ active: hoverIndex === index }"
                    v-if="item.ffsl && parseInt(item.ffsl) > 0"
                  >
                    <span>
                      {{
                        `${(
                          (parseInt(item.djsl) / parseInt(item.ffsl)) *
                          100
                        ).toFixed(2)}%`
                      }}
                    </span>
                    <span>{{
                      `${parseInt(item.djsl)}/${parseInt(item.ffsl)}`
                    }}</span>
                  </div>
                </div>
                <div
                  v-else
                  class="time text-center mt-8px"
                  :class="{ active: hoverIndex === index }"
                >
                  {{ `答卷数：${item.djsl}` }}
                </div>
                <div
                  class="time text-xs text-center mt-8px"
                  :class="{ active: hoverIndex === index }"
                >
                  {{ `问题数：${item.wtsl}` }}
                </div>
                <div
                  class="time text-xs text-center mt-8px"
                  :class="{ active: hoverIndex === index }"
                  v-if="item.xgsj"
                >
                  最近更新于{{ item.xgsj }}
                </div>
                <div
                  class="time text-xs text-center mt-8px truncate"
                  :class="{ active: hoverIndex === index }"
                  v-if="item.cjrxm"
                  :title="item.cjrxm"
                >
                  {{
                    `创建人:${item.cjrxm}${
                      item.cjryhm ? `[${item.cjryhm}]` : ""
                    }`
                  }}
                </div>
              </div>
            </div>
            <div class="flex justify-around" v-if="hoverIndex === index">
              <el-dropdown
                :teleported="false"
                placement="top"
                v-permission="'edit'"
              >
                <div class="dropdown-tag">
                  <el-icon><Edit /></el-icon>
                  设计
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDesign(item)"
                      >编辑问卷</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleSetting(item)"
                      >问卷设置</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-dropdown
                :teleported="false"
                placement="top"
                v-if="item.wjzt === '1'"
                v-permission="'publish'"
              >
                <div class="dropdown-tag">
                  <el-icon><Position /></el-icon>
                  分发
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handlePublish(item)"
                      >问卷分发</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleGoPoster(item)"
                      >海报设计</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="item['dtr'] === 'user'"
                      @click="handleGoMonitor(item)"
                      >回收监测</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-dropdown
                :teleported="false"
                placement="top"
                v-if="~~item.djsl > 0"
                v-permission="'statistics'"
              >
                <div class="dropdown-tag">
                  <el-icon><DataLine /></el-icon>
                  统计
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <!--                    <el-dropdown-item disabled>来源分析</el-dropdown-item>-->
                    <el-dropdown-item @click="handleStatistic(item)"
                      >答题统计</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleDownload(item, '1')"
                      >下载答卷</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleDownload(item, '2')"
                      >下载附件</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useWindowSize } from "@vueuse/core";
import {
  CopyDocument,
  DataLine,
  Delete,
  Edit,
  Position,
  VideoPause,
  VideoPlay,
} from "@element-plus/icons-vue";

const { width } = useWindowSize();

withDefaults(
  defineProps<{
    dataSource: any[];
  }>(),
  {
    dataSource: () => [],
  }
);

const elRef = ref<any>();
const itemRef = ref<any>();

// onClickOutside(elRef, () => {
//   hoverIndex.value = -1;
// });

const span = computed(() => {
  return width.value >= 1440 ? 4 : 6;
});

const hoverIndex = ref(-1);

const emit = defineEmits([
  "delete",
  "design",
  "run",
  "preview",
  "publish",
  "statistics",
  "setting",
  "copy",
  "download",
  "poster",
  "monitor",
]);

const handleCopy = (item: any) => {
  emit("copy", item);
};

const handleDelete = async (item: any) => {
  emit("delete", item);
};

const handleDesign = (item: any) => {
  emit("design", item);
};

const handleRun = async (item: any) => {
  emit("run", item);
};

const handlePreview = (item: any) => {
  emit("preview", item);
};

const handlePublish = (item: any) => {
  emit("publish", item);
};

const handleGoPoster = (item: any) => {
  emit("poster", item);
};

const handleGoMonitor = (item: any) => {
  emit("monitor", item);
};

const handleStatistic = (item: any) => {
  emit("statistics", item);
};

const handleSetting = (item: any) => {
  emit("setting", item);
};

const handleDownload = (item: any, type: string) => {
  emit("download", item, type);
};

const clickListener = (e) => {
  if (!e.path) return;
  const paths = e.path.map((el) => el.className);
  if (!paths.includes("survey-item") && !paths.includes("el-dropdown-menu")) {
    hoverIndex.value = -1;
  }
};

onMounted(() => {
  window.addEventListener("mouseover", clickListener);
});
onBeforeUnmount(() => {
  window.removeEventListener("mouseover", clickListener);
});
</script>
<style lang="less" scoped>
.survey-item {
  width: 230px;
  height: 310px;
  background-image: url("@/assets/images/card.png");
  background-position: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  padding: 3px 12px 12px 3px;
  cursor: pointer;
}
.content {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/fengmian.png");
  background-position: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.body {
  width: 100%;
  height: 220px;
  background-color: #ffffff;
  opacity: 70%;
  border-radius: 3px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.body.active {
  background-color: #000000;
}

.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.title.active {
  color: #ffffff;
}
.title:hover {
  color: #006ce7;
  text-decoration: underline;
  text-underline-position: under;
}

.progress.active {
  color: #ffffff;
}

.time.active {
  color: #ffffff;
}

.dropdown-tag {
  display: flex;
  align-items: center;
  background-color: #fff;
  font-size: 12px;
  padding: 5px 11px;
  border: var(--el-border);
  border-radius: calc(var(--el-border-radius-base) - 1px);
}
</style>
