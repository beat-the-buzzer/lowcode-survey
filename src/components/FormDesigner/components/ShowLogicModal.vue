<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="">
      <div>
        当前题目：
        <div class="curr-ques" v-html=" props.config.title">
        </div>
      </div>

      <div>
        <el-select v-model="gltj.gltm_id" class="m-2" placeholder="请选择关联题目">
          <el-option
            v-for="item in avaliableOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select v-model="gltj.gllx" class="m-2" placeholder="请选择关联类型">
          <el-option
            label="选中某一个"
            value="1"
          />
          <el-option
            label="同时选中"
            value="2"
          />
        </el-select>

        <el-select multiple v-model="gltj.glxx" class="m-2" placeholder="请选择关联选项">
          <el-option
            v-for="item in currItemOpt"
            :key="item.id"
            :label="rexFilter(item.title)"
            :value="item.id"
          />
        </el-select>
      </div>

      <!-- <div v-if="gltj.gltm_id">
        应用至其他题目：
        <el-checkbox-group v-model="checkedQues" >
          <el-checkbox :label="item.id" v-for="item in others">{{ rexFilter(item.title) }}</el-checkbox>
        </el-checkbox-group>
      </div> -->

      <div class="btn-group">
        <el-button type="danger" @click="clearAll">清除关联</el-button>
        <el-button type="primary" @click="doSave">保存</el-button>
      </div>
      
      
    </div>
    
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, computed, onMounted } from "vue";
import { rexFilter } from "@/utils/transform";
import { useDesignFormStore } from "@/stores/modules/design";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";

const store = useDesignFormStore();

const gltj = ref({
  gltm_id: '',
  gllx: '', // 1-选择一个 2-同时选择
  glxx: [], // 关联选项id
})

const checkedQues = ref([])

const emit = defineEmits(["close"]);

const props = withDefaults(
  defineProps<{
    config: any;
    formData: any;
  }>(),
  {
    config: () => {},
    formData: () => [],
  }
);

const { config, formData } = toRefs(props);

// 可选的题目 排除了当前题目
const avaliableOpt = computed(() => {
  const allQues = props.formData.filter(v => v.id != props.config.id && (v.type == 'single_choice' || v.type == 'mult_choice')).map(v => {
    return {
      value: v.id,
      label: rexFilter(v.title)
    }
  })
  return allQues
})

// 选中的题目的选项
const currItemOpt = computed(() => {
  if(gltj.value.gltm_id) {
    let currItem = props.formData.find(v => v.id == gltj.value.gltm_id)
    return currItem.children || []
  } else {
    return []
  }
})

// 排除了当前题目和上方的条件
const others = computed(() => {
  return props.formData.filter(v => v.id != gltj.value.gltm_id && v.id != props.config.id)
})

onMounted(() => {
  console.log(props.config, props.formData) // 先把所有题目都拿到
  // props.formData就是现有的题目
  // props.config.id // 就是当前的题目id

  if(props.config?.attribute?.gltj) {
    gltj.value = props.config?.attribute?.gltj
  } else {
    clearAll()
  }
});

const clearAll = () => {
  gltj.value = {
    gltm_id: '',
    gllx: '', // 1-选择一个 2-同时选择
    glxx: [], // 关联选项id
  }
  checkedQues.value = []
}

const doSave = () => {
  if(checkedQues.value.length > 0) {
    // 遍历所有题目，如果找到在checkedQues里面的，就赋值
    for(let i = 0; i < formData.value.length; i++) {
      let id = formData.value[i].id
      if(checkedQues.value.includes(id)) {
        formData.value[i].attribute.gltj = gltj.value;
      } 
    }
  }
  // 当前题目的数据改一下
  if(gltj.value.gltm_id) {
    config.value.attribute.gltj = gltj.value;
  } else {
    config.value.attribute.gltj = null
  }

  ElMessage.success("设置成功！");
  emit('close')
}

</script>

<style lang="less" scoped>
.table {
  min-width: 400px;
  width: 100%;
  display: table;
  border-collapse: collapse;
}

.table-th {
  display: table-header-group;
  table-layout: fixed;
  font-size: 16px;
  color: #000000;
  background-color: #f1f1f1;
  border: 1px solid #f0f0f0;
}

.table-tr {
  display: table-row;
}

.table-td {
  display: table-cell;
  text-align: center;
  border: 1px solid #f0f0f0;
  padding: 5px;
  vertical-align: middle;
}

.curr-ques {
  display: inline-block;
  font-weight: bold;
}

.btn-group{
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

</style>
