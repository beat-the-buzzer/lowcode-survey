export const clearAnswer = (question: any, formModel: any) => {
  const { id, type } = question;
  switch (type) {
    case "single_choice":
    case "mult_choice":
    case "fill_blanks":
      formModel[id] = {};
      break;
    case "mult_text":
      formModel[id] = "";
      break;
    case "sort":
    case "increase_table":
    case "cascader":
      formModel[id] = [];
      break;
    case "matrix_radio":
      formModel[id] = resetMatrixRadio(question);
      break;
    case "matrix_blanks":
      formModel[id] = resetMatrixBlanks(question);
      break;
    case "matrix_check":
      formModel[id] = resetMatrixCheck(question);
      break;
    case "select":
      formModel[id] = "";
      break;
    case "score":
    case "nps":
      formModel[id] = 0;
      break;
    default:
      formModel[id] = undefined;
      break;
  }
};

// 初始化数据结构
const resetMatrixBlanks = (question: any) => {
  const inputMap: any = {};
  question.row.map((item: any) => {
    question.children.map((c: any) => {
      inputMap[item.id] = { [c.id]: "" };
    });
  });

  return inputMap;
};

const resetMatrixCheck = (question: any) => {
  const checkedMap: any = {};
  question.row.map((item: any) => {
    checkedMap[item.id] = {};
    question.children.map((c: any) => {
      checkedMap[item.id][c.id] = { checked: false, input: "" };
    });
  });

  return checkedMap;
};

const resetMatrixRadio = (question: any) => {
  const checkedMap: any = {};
  question.row.map((item: any) => {
    checkedMap[item.id] = { checked: undefined, input: undefined };
  });

  return checkedMap;
};
