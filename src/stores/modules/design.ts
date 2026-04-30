import { defineStore } from "pinia";
import { initSurvey } from "@/components/FormDesigner/const";

export const useDesignFormStore = defineStore("design", {
  state: () => {
    return {
      formData: initSurvey("问卷") as any,
      activeItem: {} as any,
      surveyCofig: {} as any,
      singleChioceList: [] as any,
      multiChioceList: [] as any,
      scoreConfig: {} as any,
    };
  },
  actions: {
    setActiveItem(item: any) {
      this.activeItem = item;
    },
    setFormData(item: any) {
      this.formData = item;
    },
    setFormList(list: any) {
      this.formData.list = list;
    },
    setSingleChioceList(list: any) {
      this.singleChioceList = list;
    },
    setMultiChioceList(list: any) {
      this.multiChioceList = list;
    },
    setScoreConfig(item: any) {
      this.scoreConfig = item;
    },
  },
});
