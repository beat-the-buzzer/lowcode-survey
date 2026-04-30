import { onMounted, ref } from "vue";
export function useReview(survey: any, answer: any[]) {
  const questions = ref<any>([]);
  const formModel = ref<any>(answer);

  const createSurvey = () => {
    // 分页融合，去除段落说明
    // const list = survey.list.filter(
    //   (item) => !["pagination", "paragraph"].includes(item.type)
    // );
    const list = survey.list
    console.log(survey.list)
    console.log(list)
    // 添加题号
    list.map((item: any, index: number) => (item.index = index + 1));
    // 过滤作答题
    // const answerKeys = Object.keys(answer);
    // questions.value = list.filter((item) => answerKeys.includes(item.id));
    questions.value = list
  };

  onMounted(() => {
    createSurvey();
  });

  return {
    questions,
    formModel,
  };
}
