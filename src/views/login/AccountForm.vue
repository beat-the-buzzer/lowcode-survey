<template>
  <div class="w-full mt-24px">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      @keypress.enter="handleLogin"
    >
      <el-form-item prop="username" class="enter-x">
        <el-input
          size="large"
          v-model="formData.username"
          placeholder="账号"
          class="fix-auto-fill"
        />
      </el-form-item>
      <el-form-item prop="password" class="enter-x">
        <el-input
          size="large"
          type="password"
          show-password
          v-model="formData.password"
          placeholder="密码"
        />
      </el-form-item>

      <el-form-item class="enter-x">
        <el-button
          class="w-full"
          type="primary"
          size="large"
          @click="handleLogin"
          :loading="loading"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, unref, computed } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { ElNotification } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { getPubKey } from "@/api/user";
import { encryptByMd5 } from "@/utils/cipher";
import { sm2 } from "sm-crypto";
import type { FormInstance, FormRules } from "element-plus";

const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = reactive({
  username: "",
  password: "",
});

const rules = reactive<FormRules>({
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

async function handleLogin() {
  let isValid = false;
  await formRef.value?.validate((valid) => {
    if (valid) {
      isValid = true;
    }
  });
  if (!isValid) return;
  try {
    loading.value = true;
    const encryptPwd = await encryptPassword(formData.password);
    const userInfo: any = await useUserStore().Login({
      password: encryptPwd,
      username: formData.username,
    });
    if (userInfo) {
      ElNotification.success({
        title: "登陆成功",
        message: `欢迎回来`,
      });
      setTimeout(() =>
        router.push((route.query.redirect as string) ?? "/list/xg")
      );
    }
  } catch (error) {
    // createErrorModal({
    //   title: t('sys.api.errorTip'),
    //   content: (error as unknown as Error).message || '网络异常',
    //   getContainer: () =>
    //     document.body.querySelector(`.${prefixCls}`) || document.body
    // })
  } finally {
    loading.value = false;
  }
}

const encryptPassword = async (password: string) => {
  const { data } = (await getPubKey()) as any;
  const cipherMode = 1;
  const pwd = sm2.doEncrypt(password, data.pubkey, cipherMode);
  return data.keyid + "04" + pwd;
};
</script>
