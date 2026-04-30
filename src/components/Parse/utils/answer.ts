/**
 * 问卷提交答案生成，过滤未答题目
 * @param pages 问卷分页内容
 * @param formModel 表单数据
 */
export const generateAnswer = (pages: any[], formModel: any) => {
  const result: any = {};
  const questions = pages.reduce((acc: any[], cur: any) => {
    const pageQuestions = cur.questions.filter(
      (item: any) => item.type !== "paragraph"
    );
    return acc.concat(pageQuestions);
  }, []);
  questions.map((item: any) => {
    result[item.id] = formModel[item.id];
  });

  return result;
};
