<template>
  <el-scrollbar class="control-list">
    <!-- 问卷设置 -->
    <div v-if="!controlItem?.type">
      <div class="control-attr">
        <span>系统题号</span>
        <el-switch v-model="formConfig.indexColumn"></el-switch>
      </div>
      <div class="control-attr">
        <span>一页一题</span>
        <el-switch
          v-model="formConfig.forcePagination"
          @change="handleForcePagination"
        ></el-switch>
      </div>
      <el-collapse>
        <el-collapse-item title="背景（只在PC端生效）" name="1">
          <el-row>
            <el-col :span="8" v-for="item in 2" :key="item" class="bg-setting">
              <span class="clicked" v-if="formConfig.localBg === `bg${item}`"
                >使用中</span
              >
              <img
                class="bg-preview"
                :src="getImg('background', `bg${item}`)"
                alt=""
                @click="
                  handleBackgroundSet(
                    `bg${item}`,
                    getImg('background', `bg${item}`)
                  )
                "
              />
            </el-col>
            <el-col
              :span="8"
              class="bg-setting flex items-center justify-center px-10px py-5px cursor-pointer"
              @click="formConfig.localBg = formConfig.bgUrl = ''"
            >
              <span class="clicked" v-if="!formConfig.localBg">使用中</span>
              <span>无背景</span>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="页眉" name="2">
          <el-row>
            <el-col :span="8" v-for="item in 2" :key="item" class="ph-setting">
              <span class="clicked" v-if="formConfig.localPh === `ph${item}`"
                >使用中</span
              >
              <img
                class="ph-preview"
                :src="getImg('page-header', `ph${item}`)"
                alt=""
                @click="
                  handlePageHeaderSet(
                    `ph${item}`,
                    getImg('page-header', `ph${item}`)
                  )
                "
              />
            </el-col>
            <el-col
              :span="8"
              class="ph-setting flex items-center justify-center px-10px py-5px cursor-pointer"
              @click="formConfig.localPh = formConfig.phUrl = ''"
            >
              <span class="clicked" v-if="!formConfig.localPh">使用中</span>
              <span>无页眉</span>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-if="controlItem?.type">
      <div class="component-title">{{ controlItem.name }}</div>
      <!-- 通用配置 -->
      <template v-for="(item, index) in attrList" :key="index">
        <div class="control-attr">
          <span>{{ item.label }}</span>
          <el-switch
            v-if="item.type === 'switch'"
            v-model="item.value"
            @change="controlChange(item, $event)"
          />
          <el-input
            v-else-if="item.type === 'input'"
            v-model="item.value"
            :placeholder="item.placeholder"
            @input="controlChange(item, $event)"
            size="small"
            class="!w-150px"
          />
          <el-select
            v-else-if="item.type === 'select'"
            :placeholder="item.placeholder"
            v-model="item.value"
            clearable
            size="small"
            :class="`!w-150px`"
            @change="controlChange(item, $event)"
          >
            <el-option
              v-for="opt in item.dict"
              :key="opt.value"
              :value="opt.value"
              :label="opt.label"
            />
          </el-select>
          <el-input-number
            v-else-if="item.type === 'inputNum'"
            v-model="item.value"
            :min="item.min || 1"
            :max="item.max"
            size="small"
            @change="controlChange(item, $event)"
          />
        </div>
      </template>

      <!-- 问题设置 -->
      <!--   【文本题、矩阵填空、自增表格】输入框配置   -->
      <div
        v-if="
          showHide(['input', 'matrix_blanks_input'], true) ||
          (showHide(['table_column'], true) &&
            controlItem.attribute.dataType === 'text')
        "
      >
        <InputAttrs v-model:value="controlItem.attribute" />
      </div>
      <!-- 时间选择     -->
      <div v-if="showHide(['timepicker'], true)">
        <TimeAttrs v-model:value="controlItem.attribute" />
      </div>
      <!-- 文件上传     -->
      <!--  上传属性配置    -->
      <div v-if="showHide(['upload_action'], true)">
        <UploadAttrs v-model:value="controlItem.attribute" />
      </div>
      <!-- 多项填空题空格配置 -->
      <div v-if="showHide(['blanks'], true)">
        <div
          v-for="(item, index) in controlItem.children"
          :key="item.id"
          class="py-20px"
          style="border-bottom: 1px solid #f3f3f3"
        >
          <div class="font-bold">
            {{ `填空${index + 1}` }}
          </div>
          <div class="flex justify-between items-center p-5px">
            <span>必填</span>
            <el-switch v-model="item.attribute.required"></el-switch>
          </div>
          <div class="flex justify-between items-center p-5px">
            <span>宽度(px)</span>
            <el-input-number
              v-model="item.attribute.width"
              :min="100"
              :max="500"
              size="small"
              controls-position="right"
            />
          </div>
          <InputAttrs v-model:value="item.attribute" />
        </div>
      </div>
      <!--  选择类最少选择  -->
      <div
        class="control-attr"
        v-if="showHide(['sort', 'mult_choice', 'matrix_check'], true)"
      >
        <span>最少选择</span>
        <el-input-number
          v-model="controlItem.attribute.atLeast"
          :min="1"
          :max="controlItem.children.length"
          size="small"
          @change="handleAtLeastChange"
        />
      </div>
      <!--  选择类最多选择  -->
      <div
        class="control-attr"
        v-if="showHide(['sort', 'mult_choice', 'matrix_check'], true)"
      >
        <span>最多选择</span>
        <el-input-number
          v-model="controlItem.attribute.atMost"
          :min="controlItem.attribute.atLeast"
          :max="controlItem.children.length"
          size="small"
        />
      </div>
      <!--   跳题逻辑   -->
      <!-- <div class="control-attr" v-if="showHide(questionArr, true)">
        <span>跳题逻辑</span>
        <el-button size="small" @click="skipLogicVisible = true"
          >编辑</el-button
        >
      </div> -->
      <!-- 显示条件 -->
      <div class="control-attr" v-if="showHide(questionArr, true)">
        <span>题目显示条件</span>
        <el-button size="small" @click="showLogicVisible = true"
          >添加</el-button
        >
      </div>
      <div
        class="control-attr"
        v-if="showHide(['single_choice', 'mult_choice'], true)"
      >
        <span>选项模板</span>
        <el-select
          placeholder="请选择选项模板"
          v-model="controlItem.attribute.xxmb_id"
          @change="doSelectMb"
          size="small"
          :class="`!w-150px`"
        >
          <el-option
            v-for="opt in optionList"
            :key="opt.xxmb_id"
            :value="opt.xxmb_id"
            :label="opt.mbmc"
          />
        </el-select>
      </div>
      <div
        class="control-attr"
        v-if="showHide(['single_choice', 'mult_choice'], true)"
      >
        <span>题目得分</span>
        <el-switch
          v-model="controlItem.attribute.sfkqtmdf"
          active-value="1"
          inactive-value="0"
        ></el-switch>
      </div>
      <div
        class="control-attr"
        v-if="
          showHide(['single_choice', 'mult_choice'], true) &&
          controlItem.attribute.sfkqtmdf === '1'
        "
      >
        <span>题目分值配置</span>
        <el-button size="small" @click="showScoreCofingVisible = true"
          >配置</el-button
        >
      </div>
      <!--  绑定题型    -->
      <div v-if="showHide(['upload'], true)">
        <div class="px-5px py-10px">
          <div class="mb-5px">下载文件命名为</div>
          <el-select
            v-model="controlItem.attribute['bindQuestion']"
            clearable
            size="small"
            class="!w-full"
            placeholder="不设置，自动关联答题人id"
          >
            <el-option
              v-for="opt in textQuestion"
              :title="rexFilter(opt.title)"
              :key="opt.id"
              :value="opt.id"
              :label="rexFilter(opt.title)"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div
      class="control-attr"
      v-if="
        showHide(['table_column'], true) &&
        controlItem.attribute.dataType === 'select'
      "
    >
      <span>选项编辑</span>
      <el-button size="small" @click="batchAddOptionsVisible = true"
        >编辑</el-button
      >
    </div>

    <el-dialog
      v-model="skipLogicVisible"
      title="跳题逻辑编辑"
      width="600px"
      destroy-on-close
    >
      <SkipLogic
        v-if="skipLogicVisible"
        :config="controlItem"
        :formData="formData"
      />
    </el-dialog>

    <el-dialog
      v-model="showLogicVisible"
      title="题目关联逻辑编辑"
      width="800px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <ShowLogic
        v-if="showLogicVisible"
        :config="controlItem"
        :formData="formData"
        @close="() => (showLogicVisible = false)"
      />
    </el-dialog>

    <el-dialog
      v-model="batchAddOptionsVisible"
      title="批量添加选项"
      width="800px"
    >
      <BatchAddOptions
        v-if="batchAddOptionsVisible"
        class="w-full"
        type="select"
        :options="controlItem.attribute.options || []"
        @cancel="batchAddOptionsVisible = false"
        @set-options="handleSetOptions"
      />
    </el-dialog>
    <el-dialog
      v-model="showScoreCofingVisible"
      title="题目得分配置"
      width="800px"
      destroy-on-close
    >
      <ShowScoreConfigModal
        v-if="showScoreCofingVisible"
        :config="controlItem"
        :formData="formData"
        @close="handleCloseScore"
      />
    </el-dialog>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { watch, computed, toRefs, ref } from "vue";
import { useDesignFormStore } from "@/stores/modules/design";
import { buildShortUUID } from "@/utils/uuid";
import SkipLogic from "./SkipLogicModal.vue";
import ShowLogic from "./ShowLogicModal.vue";
import ShowScoreConfigModal from "./ShowScoreConfigModal.vue";
import attrDict from "./attrDict";
import validateConfig from "@/utils/validate";
import BatchAddOptions from "./BatchAddOptions.vue";
import { getBase64Image } from "@/utils/base64";
import { InputAttrs, TimeAttrs, UploadAttrs } from "@/components/ControlAttrs";
import { rexFilter } from "@/utils/transform";

import { getOptMb } from "@/api";

import bg1 from "@/assets/background/bg1.png";
import bg2 from "@/assets/background/bg2.png";
import ph1 from "@/assets/page-header/ph1.png";
import ph2 from "@/assets/page-header/ph2.png";

const imgObj = {
  "page-header": {
    ph1,
    ph2,
  },

  background: {
    bg1,
    bg2,
  },
};

const getImg = (type: string, name: string) => {
  return imgObj[type][name];
  // return new URL(`../../../assets/${type}/${name}.png`, import.meta.url).href;
};

const optionList = ref<any[]>([]);

getOptionList();

async function getOptionList() {
  const res = await getOptMb({
    qyzt: "1",
    page_size: "1000",
  });
  optionList.value = res?.data?.list || [];
}

const handleCloseScore = (config, batchEdit) => {
  showScoreCofingVisible.value = false;
};

function doSelectMb(val) {
  var selectedItem = optionList.value.find((v) => v.xxmb_id == val);
  if (selectedItem && selectedItem.xx_list) {
    setOpts(selectedItem.xx_list);
  } else {
    setOpts([]);
  }
}

const questionArr = [
  "mult_text",
  "single_choice",
  "mult_choice",
  "score",
  "fill_blanks",
  "nps",
  "sort",
  "matrix_radio",
  "matrix_blanks",
  "matrix_check",
  "matrix_scores",
  "increase_table",
  "select",
  "cascader",
  "upload",
  "time",
  "signature",
];

const props = withDefaults(
  defineProps<{
    formData: any;
    formConfig: any;
  }>(),
  {
    formData: () => {},
    formConfig: () => {
      return {};
    },
  }
);
const emits = defineEmits<{
  (e: "update:formData", data: any): void;
}>();

const { formConfig, formData } = toRefs(props);
const store = useDesignFormStore();
const skipLogicVisible = ref(false);
const showLogicVisible = ref(false);
const showScoreCofingVisible = ref(false);
const batchAddOptionsVisible = ref(false);

const controlItem: any = computed(() => {
  return store.activeItem;
});

// 问题配置
const attrList = computed(() => {
  if (Object.keys(controlItem.value).length) {
    const { attribute, type } = controlItem.value;
    if (attribute) {
      const temp: any[] = [
        {
          label: "必填",
          value: attribute.required,
          path: "attribute.required",
          type: "switch",
          vShow: [...questionArr, "table_column"],
        },
        {
          label: "题干说明",
          value: attribute.desc,
          path: "attribute.desc",
          type: "switch",
          vShow: questionArr,
        },
        // {
        //   label: "添加视频",
        //   value: attribute.addVideo,
        //   path: "attribute.addVideo",
        //   type: "switch",
        //   vShow: questionArr,
        // },
        // {
        //   label: "输入类型",
        //   value: attribute.inputType,
        //   path: "attribute.inputType",
        //   type: "select",
        //   vShow: ["input", "matrix_blanks_input"],
        //   dict: attrDict.inputType,
        // },
        {
          label: "选项布局",
          value: attribute.optionSpan,
          path: "attribute.optionSpan",
          type: "select",
          vShow: ["single_choice", "mult_choice"],
          dict: attrDict.spanOptions,
        },
        {
          label: "选项布局(移动端)",
          value: attribute.optionSpanMobile,
          path: "attribute.optionSpanMobile",
          type: "select",
          vShow: ["single_choice"],
          dict: attrDict.spanOptionsMobile,
        },
        {
          label: "增加填空",
          value: attribute.addInput,
          path: "attribute.addInput",
          type: "switch",
          vShow: ["radio", "checkbox", "sort_item", "matrix_radio_column"],
        },
        {
          label: "填空必填",
          value: attribute.inputRequired,
          path: "attribute.inputRequired",
          type: "switch",
          vShow: ["radio", "checkbox", "matrix_radio_column"],
          vIf: !attribute.addInput,
        },
        // {
        //   label: "最多填写",
        //   value: attribute.maxLength,
        //   path: "attribute.maxLength",
        //   type: "inputNum",
        //   vShow: ["input", "matrix_blanks_input"],
        // },
        {
          label: "最高分",
          value: attribute.maxScore,
          path: "attribute.maxScore",
          type: "inputNum",
          max: 100,
          vShow: ["rate", "nps-option", "matrix_scores"],
        },
        {
          label: "起始文字",
          value: attribute.startTip,
          path: "attribute.startTip",
          type: "input",
          vShow: ["rate", "nps-option"],
        },
        {
          label: "结束文字",
          value: attribute.endTip,
          path: "attribute.endTip",
          type: "input",
          vShow: ["rate", "nps-option"],
        },
        {
          label: "竖向选择",
          value: attribute.vertical,
          path: "attribute.vertical",
          type: "switch",
          vShow: ["matrix_radio", "matrix_check"],
        },
        {
          label: "互斥",
          value: attribute.exclusion,
          path: "attribute.exclusion",
          type: "switch",
          vShow: ["checkbox", "sort_item"],
        },
        {
          label: "默认显示行数",
          value: attribute.defaultRows,
          path: "attribute.defaultRows",
          type: "inputNum",
          vShow: ["increase_table"],
        },
        {
          label: "最少填写行数",
          value: attribute.minRows,
          path: "attribute.minRows",
          type: "inputNum",
          vShow: ["increase_table"],
        },
        {
          label: "最大填写行数",
          value: attribute.maxRows,
          path: "attribute.maxRows",
          type: "inputNum",
          vShow: ["increase_table"],
        },
        {
          label: "组件类型",
          value: attribute.dataType,
          path: "attribute.dataType",
          type: "select",
          vShow: ["table_column"],
          dict: attrDict.dataType,
        },
        {
          label: "多选",
          value: attribute.multiple,
          path: "attribute.multiple",
          type: "switch",
          vShow: ["select"],
        },
      ];
      // 过滤显示对应的值
      return temp.filter((item: any) => {
        let hasFilter = true;
        if (item.vShow) {
          hasFilter = item.vShow.includes(type);
        }
        if (item.vHide) {
          hasFilter = !item.vHide.includes(type);
        }
        if (item.vIf) {
          // 不显示vif＝true的
          hasFilter = false;
        }
        return hasFilter;
      });
    } else {
      return [];
    }
  } else {
    return [];
  }
});

const textQuestion = computed(() =>
  formData.value.filter((item: any) => item.type === "mult_text")
);

// 属性修改
const controlChange = (obj: any, val: any) => {
  obj.path && getPropByPath(controlItem.value, obj.path, val);
};

// 修改指定路径下的值
const getPropByPath = (obj: any, path: string, val: any) => {
  let tempObj = obj;
  const keyArr = path.split(".");
  let i = 0;
  for (i; i < keyArr.length - 1; i++) {
    const key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      throw new Error(`${key} is undefined`);
      // break
    }
  }
  const key = keyArr[i];
  const value = tempObj[keyArr[i]];
  // 检查最后一级是否存在
  /*if (!(key in tempObj)) {
    throw new Error(`${key} is undefined`)
  }*/
  if (val !== undefined) {
    tempObj[key] = val;
  }
  return {
    obj: tempObj,
    key: key,
    value: value,
  };
};

// 根据不同类型判断是否显示当前属性
const showHide = (type: string[], show?: boolean) => {
  // show=true 条件成立显示，false符合条件隐藏
  if (type && type.length === 0) {
    return false;
  }
  const index = type.indexOf(controlItem.value?.type);
  return show ? index !== -1 : index === -1;
};

// 设置背景
const handleBackgroundSet = (flag: string, url: string) => {
  const image = new Image();
  image.src = url;
  image.onload = () => {
    formConfig.value.bgUrl = url; // getBase64Image(image);
    formConfig.value.localBg = flag;
  };
};

// 设置页眉
const handlePageHeaderSet = (flag: string, url: string) => {
  const image = new Image();
  image.src = url;
  image.onload = () => {
    formConfig.value.phUrl = url; // getBase64Image(image);
    formConfig.value.localPh = flag;
  };
};

// 强制分页
const handleForcePagination = (val: string | number | boolean) => {
  const list = formData.value.filter((item: any) => item.type !== "pagination");
  if (val) {
    const result = list.reduce(
      (acc: any[], cur: any, index: number) => {
        if (index < list.length - 1) {
          return acc.concat(cur, {
            type: "pagination",
            title: "分页",
            id: buildShortUUID(),
            attribute: {
              current: index + 2,
              total: list.length,
            },
          });
        } else {
          return acc.concat(cur);
        }
      },
      [
        {
          type: "pagination",
          title: "分页",
          id: buildShortUUID(),
          attribute: {
            current: 1,
            total: list.length,
          },
        },
      ]
    );
    emits("update:formData", result);
  } else {
    emits("update:formData", list);
  }
};

// 矩阵交换行与列
const handleChangeRowColumn = () => {
  const { id } = controlItem.value;
  const origin = formData.value.find((item: any) => (item.id = id));
  const { row, children } = origin;
  formData.value.map((item: any) => {
    if (item.id === id) {
      item.row = children;
      item.children = row;
    }
  });
  emits("update:formData", formData.value);
};

const handleAtLeastChange = (val: any) => {
  if (controlItem.value.attribute.atMost) {
    if (val > controlItem.value.attribute.atMost) {
      Reflect.deleteProperty(controlItem.value.attribute, "atMost");
    }
  }
};

const setOpts = (arr: any) => {
  batchAddOptionsVisible.value = false;
  let list: any = [];
  arr.map((item: any) => {
    list.push({
      title: item,
      id: buildShortUUID(),
      attribute: { skipPath: "" },
    });
    // console.log("🚀 ~ file: formControlAttr.vue:548 ~ arr.map ~ list", list);
  });

  // 暂时先这样写
  window[`setOpt${controlItem.value.id}`] &&
    window[`setOpt${controlItem.value.id}`](list);
};

const handleSetOptions = (arr: any) => {
  batchAddOptionsVisible.value = false;
  let list: any = [];
  arr.map((item: any) => {
    list.push({
      title: item,
      id: buildShortUUID(),
    });
    // console.log("🚀 ~ file: formControlAttr.vue:548 ~ arr.map ~ list", list);
  });

  controlItem.value.attribute.options = list;
};
</script>
<style lang="less" scoped>
.control-list {
  width: 250px;
  min-width: 250px;
  padding: 30px 10px 0 10px;
  height: calc(100vh - 130px);
  overflow-y: auto;
}
.component-title {
  display: inline-block;
  color: #fff;
  font-size: 14px;
  padding: 5px 12px;
  border-radius: 2px;
  background-color: #495165;
  margin-left: 20px;
  margin-bottom: 20px;
}
.control-attr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
}

.bg-setting {
  position: relative;
  .bg-preview {
    width: 100%;
    height: 100px;
    object-fit: fill;
    padding: 5px 10px;
    cursor: pointer;
  }

  .clicked {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 0 0px 2px 0px;
    background: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    padding: 1px 2px;
    line-height: 18px;
  }
}

.ph-setting {
  position: relative;
  .ph-preview {
    width: 100%;
    height: 40px;
    object-fit: fill;
    padding: 5px 10px;
    cursor: pointer;
  }

  .clicked {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 0 0px 2px 0px;
    background: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    padding: 1px 2px;
    line-height: 18px;
  }
}
</style>
