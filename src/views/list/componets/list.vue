<template>
  <div>
    <div class="min-w-1280px max-w-1440px mx-auto">
      <div class="mt-20px" v-if="dataSource.length > 0">
        <div v-for="item in dataSource" :key="item.wjid" class="survey-item">
          <div class="flex items-center justify-between m-20px">
            <div
              class="title truncate max-w-700px"
              @click="handlePreview(item)"
              :title="item['wjmc']"
            >
              {{ item.wjmc }}
            </div>
            <el-space :size="50">
              <el-tag
                :type="
                  item.wjzt === '0'
                    ? 'info'
                    : item.wjzt === '1'
                    ? 'success'
                    : 'warning'
                "
              >
                {{ item.wjztmc }}</el-tag
              >
              <span> {{ `问题数：${item.wtsl}` }} </span>
              <el-progress
                v-if="item.dtr === 'user'"
                :percentage="(parseInt(item.djsl) / parseInt(item.ffsl)) * 100"
                class="w-200px"
              >
                {{ `${parseInt(item.djsl)}/${parseInt(item.ffsl)}` }}
              </el-progress>
              <span v-else>
                {{ `答卷数量：${item.djsl}` }}
              </span>
              <span class="text-slate-500">{{ `最近更新于${item.xgsj}` }}</span>
            </el-space>
          </div>
          <div class="flex items-center justify-between m-20px">
            <el-space :size="50">
              <el-dropdown v-permission="'edit'">
                <span class="dropdown-link">
                  <el-icon size="20" color="#4b97ce"><EditPen /></el-icon>
                  设计问卷
                  <el-icon><CaretBottom /></el-icon>
                </span>
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
              <!-- <el-dropdown> -->

              <el-dropdown v-if="item.wjzt === '1'" v-permission="'publish'">
                <span class="dropdown-link">
                  <el-icon size="20" color="#f59917"><Position /></el-icon>
                  分发
                  <el-icon><CaretBottom /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handlePublish(item)"
                      >问卷分发</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleGoPoster(item)"
                      >问卷海报</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="item['dtr'] === 'user'"
                      @click="handleGoMonitor(item)"
                      >回收监测</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-dropdown v-permission="'statistics'" v-if="~~item.djsl > 0">
                <span class="dropdown-link">
                  <el-icon size="20" color="#627ce5"><DataAnalysis /></el-icon>
                  分析&下载
                  <el-icon><CaretBottom /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
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
            </el-space>
            <el-space :size="20">
              <el-button
                v-permission="'publish'"
                text
                size="large"
                style="font-size: 14px"
                @click="handleRun(item)"
              >
                <el-icon size="26" color="#333">
                  <VideoPlay v-if="item.wjzt !== '1'" />
                  <VideoPause v-else />
                </el-icon>
                {{ item.wjzt === "1" ? "停止" : "运行" }}
              </el-button>
              <el-button
                v-permission="'edit'"
                text
                size="small"
                @click="handleCopy(item)"
              >
                <el-icon><DocumentCopy /></el-icon>
                复制
              </el-button>
              <el-button
                v-permission="'edit'"
                text
                size="small"
                @click="handleDelete(item)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </el-space>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CaretBottom,
  DataAnalysis,
  Delete,
  DocumentCopy,
  EditPen,
  Position,
  VideoPause,
  VideoPlay,
} from "@element-plus/icons-vue";

withDefaults(
  defineProps<{
    dataSource: any[];
  }>(),
  {
    dataSource: () => [],
  }
);

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

const handleCopy = (item: any) => {
  emit("copy", item);
};

const handleDownload = (item: any, type: string) => {
  emit("download", item, type);
};

const handleSetting = (item: any) => {
  emit("setting", item);
};
</script>
<style lang="less" scoped>
.title {
  line-height: 36px;
  color: #000;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
}
.survey-item {
  background: #fff;
  border-radius: 2px;
  margin-bottom: 20px;
  box-shadow: 0 0 4px 0 #f0f0f0;
  border: 1px solid #e6e6e6;
}
.dropdown-link {
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
}

:deep(.el-menu-item.is-active) {
  background-color: #f3f3f3;
}

:deep(.el-menu) {
  border: none;
}

:deep(.el-menu-item) {
  border-bottom: 1px solid #f3f3f3;
}
</style>
