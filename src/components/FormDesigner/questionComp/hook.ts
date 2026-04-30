export default function useHook() {
  const props = withDefaults(
    defineProps<{
      data: any;
      questionList: any[];
    }>(),
    {
      data: () => {},
      questionList: () => [],
    }
  );

  const questionIndex = (id: string) => {
    return props.questionList.findIndex((item: any) => item.id === id) + 1;
  };

  return {
    _props: props,
    questionIndex,
  };
}
