import { defineStore } from "pinia";
const initSurvey = (name: string) => {
  return {
    list: [],
    config: {
      title: `${name}`,
    },
  };
};

export const useDesignFormStore = defineStore("design", {
  state: () => {
    return {
      formData: initSurvey("问卷") as any,
      activeItem: {} as any,
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
  },
});
