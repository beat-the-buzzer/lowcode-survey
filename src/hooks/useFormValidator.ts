import {
  isBoolean,
  isUndefined,
  isObject,
  isArray,
  isString,
  intersection,
  isNumber,
} from "lodash-es";
import validate from "@/utils/validate";
import { rexFilter } from "@/utils/transform";
import { isEmpty } from "@/utils/is";

export function useValidator(question: any, emit: Function) {
  const loadValidator = () => {
    let temp: any = {};
    const { type } = question;
    switch (type) {
      case "single_choice":
        temp.validator = validateSingleChoice;
        temp.trigger = "change";
        break;
      case "mult_text":
        temp.validator = validateMultText;
        temp.trigger = "change";
        break;
      case "mult_choice":
        temp.validator = validateMultChoice;
        temp.trigger = "change";
        break;
      case "fill_blanks":
        temp.validator = validateFillBlanks;
        temp.trigger = "change";
        break;
      case "sort":
        temp.validator = validateSort;
        temp.trigger = "change";
        break;
      case "matrix_radio":
        temp.validator = validateMatrixRadio;
        temp.trigger = "change";
        break;
      case "matrix_blanks":
        temp.validator = validateMatrixBlanks;
        temp.trigger = "change";
        break;
      case "matrix_check":
        temp.validator = validateMatrixCheck;
        temp.trigger = "change";
        break;
      case "matrix_scores":
        temp.validator = validateMatrixScores;
        temp.trigger = "change";
        break;
      case "increase_table":
        temp.validator = validateIncreaseTable;
        temp.trigger = "change";
        break;
      case "select":
        temp.validator = validateSelect;
        temp.trigger = "change";
        break;
      case "score":
        temp.validator = validateScore;
        temp.trigger = "change";
        break;
      case "nps":
        temp.validator = validateNps;
        temp.trigger = "change";
        break;
      case "cascader":
        temp.validator = validateCascader;
        temp.trigger = "change";
        break;
      case "time":
        temp.validator = validateTime;
        temp.trigger = "change";
        break;
      case "upload":
        temp.validator = validateUpload;
        temp.trigger = "change";
        break;
      case "score_text":
        temp.validator = validateScoreText;
        temp.trigger = "change";
          break; 
      case "signature":
        temp.validator = validateSignature
        temp.trigger = "change";
          break; 
      default:
        temp = undefined;
        break;
    }

    return temp;
  };

  // 文本题验证
  const validateMultText = (rule: any, value: any, callback: any) => {
    const { id, attribute, children } = question;
    const child: any = children[0];
    if (attribute.required) {
      if (isEmpty(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        const { inputType, regType } = child.attribute;
        if (inputType == "string" && regType) {
          const validateItem = validate.find(
            (item: any) => item.type === regType
          );
          if (validateItem) {
            const bol = validateItem.regExp.test(value);
            if (!bol) {
              callback(new Error(validateItem?.message));
              emit("answerError", id);
              return;
            }
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };
  

  //评分题验证
  const validateScoreText = (rule: any, value: any, callback: any) => {
    const { id, attribute, children } = question;
    const child: any = children[0];
    if (attribute.required) {
      if (isEmpty(value)) {
        console.log(222222222222)
        console.log(value)
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        const { inputType, regType } = child.attribute;
        if (inputType == "string" && regType) {
          const validateItem = validate.find(
            (item: any) => item.type === regType
          );
          if (validateItem) {
            const bol = validateItem.regExp.test(value);
            if (!bol) {
              callback(new Error(validateItem?.message));
              emit("answerError", id);
              return;
            }
          }
        } else if (inputType === 'number') {
          if (question.hasOwnProperty('scoreConfig')) {
            if (Number(value) > Number(question.scoreConfig.max)) {
              callback(new Error("超出最大范围！"));
              return
            } else if (Number(value) < Number(question.scoreConfig.min)) {
              callback(new Error("超出最小范围！"));
              return
            }
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };


  // 签名验证
  const validateSignature = (rule: any, value: any, callback: any) => {
    const { id, attribute, children } = question;
    const child: any = children[0];
    if (attribute.required) {
      if (isEmpty(value)) {
        callback(new Error("签名未填写（需要点击确认按钮）"));
        emit("answerError", id);
        return;
      } 
    }
    emit("answerSuccess", id);
    callback();
  };

  // 时间选择校验
  const validateTime = (rule: any, value: any, callback: any) => {
    const { id, attribute } = question;
    if (attribute.required) {
      if (!value) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 单选题校验
  const validateSingleChoice = (rule: any, value: any, callback: any) => {
    const { id, attribute, children } = question;
    if (attribute?.required) {
      if (isUndefined(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        const key = Object.keys(value)[0];
        const child = children.find((item: any) => item.id === key);
        if (
          child &&
          child.attribute?.addInput &&
          child.attribute?.inputRequired
        ) {
          if (isBoolean(value[key]) || value[key] === "") {
            callback(new Error("这个选项未作答"));
            emit("answerError", id);
            return;
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 多选题校验
  const validateMultChoice = (rule: any, value: any, callback: any) => {
    const { id, attribute, children } = question;
    if (attribute.required) {
      if (
        isUndefined(value) ||
        (isObject(value) && Object.keys(value).length === 0)
      ) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        const exclusionItems = children
          .filter((item: any) => item.attribute.exclusion)
          .map((item: any) => item.id);
        const keys = Object.keys(value);
        const _intersection = intersection(exclusionItems, keys);
        if (_intersection.length === 0) {
          if (attribute.atLeast && attribute.atLeast > keys.length) {
            callback(new Error(`最少选择${attribute.atLeast}项`));
            emit("answerError", id);
            return;
          } else if (attribute.atMost && attribute.atMost < keys.length) {
            callback(new Error(`最多选择${attribute.atMost}项`));
            emit("answerError", id);
            return;
          }
        }
        // 校验输入框
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index];
          const child = children.find((item: any) => item.id === key);
          if (child.attribute.addInput && child.attribute.inputRequired) {
            if (isBoolean(value[key]) || value[key] === "") {
              callback(new Error(`选项未作答`));
              emit("answerError", id);
              return;
            }
          }
        }
      }
    }

    emit("answerSuccess", id);
    callback();
  };

  // 填空题验证
  const validateFillBlanks = (rule: any, value: any, callback: any) => {
    const { id, attribute, children } = question;
    const child = children[0];
    const blanks = child.children;

    if (attribute.required) {
      if (objectIsEmpty(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        for (let index = 0; index < blanks.length; index++) {
          const item = blanks[index];
          const { required, regType, inputType } = item.attribute;
          // 必填
          if (required && isEmpty(value[item.id])) {
            callback(new Error("填空未作答！"));
            emit("answerError", id);
            return;
          }
          // 文本类型正则校验
          if (inputType === "string" && regType && value[item.id]) {
            const validateItem = validate.find(
              (item: any) => item.type === regType
            );
            const bol = validateItem?.regExp.test(value[item.id]);
            if (!bol) {
              callback(
                new Error(`第${index + 1}个填空${validateItem?.message}`)
              );
              emit("answerError", id);
              return;
            }
          }
        }
      }
    } else {
      if (value) {
        for (let index = 0; index < blanks.length; index++) {
          const item = blanks[index];
          const { required, regType, inputType } = item.attribute;
          // 文本类型正则校验
          console.log(value[item.id], isEmpty(value[item.id]));
          if (inputType === "string" && regType && !isEmpty(value[item.id])) {
            const validateItem = validate.find(
              (item: any) => item.type === regType
            );
            const bol =
              isEmpty(value[item.id]) ||
              validateItem?.regExp.test(value[item.id]);
            if (!bol) {
              callback(
                new Error(`第${index + 1}个填空${validateItem?.message}`)
              );
              emit("answerError", id);
              return;
            }
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 排序题校验
  const validateSort = (rule: any, value: any, callback: any) => {
    const { id, attribute, children } = question;
    if (attribute.required) {
      if (isUndefined(value) || (isArray(value) && value.length === 0)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        const exclusionItems = children
          .filter((item: any) => item.attribute.exclusion)
          .map((item: any) => item.id);
        const selectedKeys = value.map((item: any) => item.value);
        const _intersection = intersection(exclusionItems, selectedKeys);
        if (_intersection.length === 0) {
          if (attribute.atLeast && value.length < attribute.atLeast) {
            callback(new Error(`最少选择${attribute.atLeast}项`));
            emit("answerError", id);
            return;
          } else if (attribute.atMost && value.length > attribute.atMost) {
            callback(new Error(`最多选择${attribute.atMost}项`));
            emit("answerError", id);
            return;
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 矩阵单选题校验
  const validateMatrixRadio = (rule: any, value: any, callback: any) => {
    const { id, attribute, row, children } = question;
    if (attribute.required) {
      if (
        isUndefined(value) ||
        (isObject(value) && Object.keys(value).length === 0)
      ) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        if (Object.keys(value).length !== row.length) {
          callback(new Error("存在未答行！"));
          emit("answerError", id);
          return;
        } else {
          const _values: any[] = Object.values(value);
          const requiredInputKeys = children
            .filter((item: any) => item.attribute.inputRequired)
            .map((item: any) => item.id);
          for (let index = 0; index < _values.length; index++) {
            const choose = _values[index];
            const chooseValues = Object.values(choose);
            if (isEmpty(choose) || chooseValues.some((item) => !item)) {
              callback(new Error("存在未答行！"));
              emit("answerError", id);
              return;
            }
            // 选择结果是否存在必填输入框
            const arr = intersection(Object.keys(choose), requiredInputKeys);
            if (arr.length > 0) {
              for (let i = 0; i < arr.length; i++) {
                const requiredKey = arr[i];
                if (!(isString(choose[requiredKey]) && choose[requiredKey])) {
                  callback(new Error(`请填写输入框`));
                  emit("answerError", id);
                  return;
                }
              }
            }
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 矩阵填空题校验
  const validateMatrixBlanks = (rule: any, value: any, callback: any) => {
    const { id, attribute, row, children } = question;
    if (attribute.required) {
      if (isUndefined(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        for (let index = 0; index < row.length; index++) {
          const _row = row[index];
          const rowValue = value[_row.id];
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const inputValue = rowValue[child.id];
            if (isEmpty(inputValue)) {
              callback(
                new Error(
                  `${rexFilter(_row.title)}-${rexFilter(child.title)}：未作答`
                )
              );
              emit("answerError", id);
              return;
            } else {
              const { regType, inputType } = child.attribute;
              if (inputType === "string" && regType) {
                const validateItem = validate.find(
                  (item: any) => item.type === regType
                );
                const bol = validateItem?.regExp.test(inputValue);
                if (!bol) {
                  callback(
                    new Error(
                      `${rexFilter(_row.title)}-${rexFilter(child.title)}：${
                        validateItem?.message
                      }`
                    )
                  );
                  emit("answerError", id);
                  return;
                }
              }
            }
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 矩阵多选校验
  const validateMatrixCheck = (rule: any, value: any, callback: any) => {
    const { id, attribute, row, children } = question;
    if (attribute.required) {
      if (isUndefined(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        for (let index = 0; index < row.length; index++) {
          const _row = row[index];
          const rowValue = value[_row.id];
          const chooseNum = Object.keys(rowValue).length;
          if (chooseNum === 0) {
            callback(new Error(`${rexFilter(_row.title)}:未作答！`));
            emit("answerError", id);
            return;
          }
          if (attribute.atLeast && chooseNum < attribute.atLeast) {
            callback(new Error(`最少选择${attribute.atLeast}项！`));
            emit("answerError", id);
            return;
          }
          if (attribute.atMost && chooseNum > attribute.atMost) {
            callback(new Error(`最多选择${attribute.atMost}项！`));
            emit("answerError", id);
            return;
          } else {
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              const checkedValue = rowValue[child.id];
              if (!isUndefined(checkedValue) && child.attribute.addInput) {
                if (!(isString(checkedValue) && checkedValue)) {
                  callback(new Error(`${rexFilter(_row.title)}:请作答完整！`));
                  emit("answerError", id);
                  return;
                } else {
                  const regType = child.attribute.regType;
                  if (regType) {
                    const validateItem = validate.find(
                      (item: any) => item.type === regType
                    );
                    const bol = validateItem?.regExp.test(checkedValue);
                    if (!bol) {
                      callback(
                        new Error(
                          `${rexFilter(_row.title)}-${rexFilter(
                            child.title
                          )}：${validateItem?.message}`
                        )
                      );
                      emit("answerError", id);

                      return;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    emit("answerSuccess", id);
    callback();
  };

  // 矩阵打分题校验
  const validateMatrixScores = (rule: any, value: any, callback: any) => {
    const { id, attribute, row, children } = question;
    if (attribute.required) {
      if (isUndefined(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        for (let index = 0; index < row.length; index++) {
          const _row = row[index];
          for (let i = 0; i < children.length; i++) {
            const _children = children[i];
            const score = value[_row.id][_children.id];
            if (!isNumber(score)) {
              callback(
                new Error(
                  `${rexFilter(_row.title)}:请对${rexFilter(
                    _children.title
                  )}打分！`
                )
              );
              emit("answerError", id);
              return;
            }
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 自增表格校验
  const validateIncreaseTable = (rule: any, value: any, callback: any) => {
    const { id, attribute, children } = question;
    if (attribute.required) {
      if (arrayIsEmpty(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      } else {
        // 表格行数限制
        if (value.length > attribute.maxRows) {
          callback(new Error(`最多填写${attribute.maxRows}项！`));
          emit("answerError", id);
          return;
        }
        if (value.length < attribute.minRows) {
          callback(new Error(`最少填写${attribute.minRows}项！`));
          emit("answerError", id);
          return;
        }
        for (let index = 0; index < value.length; index++) {
          const v = value[index];
          for (let i = 0; i < children.length; i++) {
            const { id, title, attribute } = children[i];
            if (isEmpty(v[id]) && attribute.required) {
              callback(
                new Error(`第${index + 1}项中${rexFilter(title)}未填写！`)
              );
              emit("answerError", id);
              return;
            }
          }
        }
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 下拉题
  const validateSelect = (rule: any, value: any, callback: any) => {
    const { id, attribute } = question;
    if (attribute.required) {
      if (!value) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 打分题
  const validateScore = (rule: any, value: any, callback: any) => {
    const { id, attribute } = question;
    if (attribute.required) {
      if (!value) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 量表题
  const validateNps = (rule: any, value: any, callback: any) => {
    const { id, attribute } = question;
    if (attribute.required) {
      if (!isNumber(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 级联题
  const validateCascader = (rule: any, value: any, callback: any) => {
    const { id, attribute } = question;
    if (attribute.required) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  // 文件上传题
  const validateUpload = (rule: any, value: any, callback: any) => {
    const { id, attribute } = question;
    if (attribute.required) {
      if (!Array.isArray(value) || isEmpty(value)) {
        callback(new Error("这道题未作答！"));
        emit("answerError", id);
        return;
      }
    }
    emit("answerSuccess", id);
    callback();
  };

  return { loadValidator };
}

/**
 * @description: 对象是否为空
 * @param {*} value
 * @return {*}
 */
const objectIsEmpty = (value: any) => {
  let bol = true;
  if (!isUndefined(value)) {
    if (Object.keys(value).length !== 0) {
      Object.values(value).map((item) => {
        if (!isEmpty(item)) {
          bol = false;
        }
      });
    }
  }
  return bol;
};

/**
 * @description: 数组是否为空
 * @return {*}
 */
const arrayIsEmpty = (value: any) => {
  let bol = true;
  if (isArray(value)) {
    value.map((item: any) => {
      if (Object.keys(item).length !== 0) {
        Object.values(item).map((v) => {
          if (v) {
            bol = false;
          }
        });
      }
    });
  }
  return bol;
};
