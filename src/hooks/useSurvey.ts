import { ref, onMounted, computed } from "vue";
import type { Ref } from "vue";
import { last, uniq } from "lodash-es";

/**
 * 生成问卷
 * @param survey 问卷JSON数据
 * @param formModel 问卷答案
 * @param surveyRef 问卷dom
 * @param emit
 */
export function useSurvey(
  survey: any,
  formModel: Ref,
  surveyRef: Ref,
  emit: Function
) {
  // 问卷所有题目
  let questionList: any = [];
  // 问卷分页对象
  const pageList: any[] = [];
  // 跳题后的分页问卷
  const skipPageList = ref<any[]>([]);
  // 当前页数
  const currentPage = ref(1);
  // 总页数
  const totalPage = ref(1);
  // 跳题页码记录
  let skipedPageIndexArr = [1];

  const isLastPage = computed(() => {
    return (
      currentPage.value === totalPage.value ||
      currentPage.value === last(skipPageList.value).pageIndex
    );
  });

  // 处理问卷分页
  const createSurvey = () => {
    const list = [...survey.list];
    let questionIndex = 1;
    // 是否存在分页
    const isPagination =
      list.findIndex((item: any) => item.type === "pagination") > -1;
    if (isPagination) {
      list.map((item: any) => {
        if (item.type === "pagination") {
          pageList.push({
            pageIndex: item.attribute.current,
            questions: [],
          });
        } else {
          // 段落说明不添加题号
          if (item.type === "paragraph") {
            last(pageList).questions.push({
              ...item,
            });
          } else {
            last(pageList).questions.push({
              ...item,
              index: questionIndex,
            });
            questionIndex += 1;
          }
        }
      });
      // 处理无效分页
      pageList
        .filter((item: any) => item.questions.length !== 0)
        .map((item: any, index: number) => (item.pageIndex = index + 1));
    } else {
      let index = 1;
      // 单页
      list.map((item: any) => {
        if (!["pagination", "paragraph"].includes(item.type)) {
          item.index = index;
          index++;
        }
      });
      pageList.push({
        pageIndex: 1,
        questions: list,
      });
    }
    skipPageList.value = JSON.parse(JSON.stringify(pageList));
    totalPage.value = pageList.length;
  };

  /**
   * 触发跳题
   * @param isTrigger 是否触发
   * @param val 题目答案
   * @param config 题目配置
   */
  const triggerSkip = (isTrigger: boolean, val: any, config: any) => {
    const { attribute, children, index } = config;
    // 是否触发跳题，除单选题外其他题型答题内容有值才触发
    if (isTrigger) {
      // 是否存在跳题标记
      if (attribute.skip) {
        let skipPath: string;
        // 按选项跳题
        if (attribute.skip === "byOption") {
          const child = children.find(
            (item: any) => item.id === Object.keys(val)[0]
          );
          skipPath = child?.attribute?.skipPath;
        }
        // 无条件跳题
        else {
          skipPath = attribute.skipPath;
        }
        // 选项存在跳题
        if (skipPath) {
          if (skipPath !== "end") {
            const skipIndex = questionIndex(skipPath);
            skipLogic(true, index, ~~skipIndex);
          } else {
            // 跳到问卷末尾结束作答
            skipLogic(true, index, "end");
          }
        }
        // 选项不存在跳题
        else {
          skipLogic(false, index, 0);
        }
      } else {
        // skipLogic(false, index, 0);
      }
    } else {
      if (attribute.skip) {
        skipLogic(false, index, 0);
      }
    }
  };

  /**
   * @description: 跳题逻辑
   * @param {boolean} skip 是否跳题
   * @param {number} currentIndex 当前题号
   * @param {number|string} skipIndex 目标题号
   * @param {boolean} noNextPage 是否未生成下一页页码
   * @return
   */
  const skipLogic = (
    skip: boolean,
    currentIndex: number,
    skipIndex: number | string,
    noNextPage?: boolean
  ) => {
    const _pageList = JSON.parse(JSON.stringify(pageList));

    // 当前页跳题
    const _index = skipedPageIndexArr.findIndex(
      (item) => item === currentPage.value
    );
    if (!noNextPage) {
      const left = skipPageList.value[_index].questions.slice(
        0,
        skipPageList.value[_index].questions.findIndex(
          (item: any) => item.index === currentIndex
        ) + 1
      );
      const right = _pageList[currentPage.value - 1].questions.slice(
        _pageList[currentPage.value - 1].questions.findIndex(
          (item: any) => item.index === currentIndex
        ) + 1
      );

      if (skip) {
        if (skipIndex !== "end") {
          // 过滤跳过的题目
          skipPageList.value[_index].questions = [...left, ...right].filter(
            (item: any) => {
              if (item.index > currentIndex && item.index < skipIndex) {
                handleClearAnswer(item);
                return false;
              } else {
                return true;
              }
            }
          );
        } else {
          // 单页跳到问卷末尾结束作答
          if (_pageList.length === 1) {
            skipPageList.value[_index].questions = [...left];
            right.map((item: any) => {
              handleClearAnswer(item);
            });
          }
        }
      } else {
        // 选择不跳转项，还原当前题目后过滤的题目
        skipPageList.value[_index].questions = [...left, ...right];
      }
    }

    // 存在分页，目标页题目过滤
    if (_pageList.length > 1) {
      const _left = skipPageList.value.filter(
        (item: any) => item.pageIndex <= currentPage.value
      );
      if (skip) {
        // 已经作答的页数
        if (skipIndex === "end") {
          if (currentPage.value < totalPage.value) {
            const lastPageContent: any = last(_pageList);
            lastPageContent.questions = [];

            // skipPageList.value = [..._left, lastPageContent];
            skipPageList.value = [..._left];
            const skipedPageNums = skipedPageIndexArr.filter(
              (item) => item <= currentPage.value
            );
            skipedPageIndexArr = uniq([
              ...skipedPageNums,
              // lastPageContent.pageIndex,
            ]);
          } else {
            const lastPageContent: any = last(skipPageList.value);
            skipPageList.value[skipPageList.value.length - 1].questions =
              lastPageContent.questions.filter(
                (item: any) => item.index <= currentIndex
              );
          }
          return;
        }
        // 查找跳转目标题所在页
        let target: any;
        for (let p = 0; p < _pageList.length; p++) {
          let isEnd = false;
          const _questions = _pageList[p].questions;
          for (let q = 0; q < _questions.length; q++) {
            const item = _questions[q];
            if (item.index === skipIndex) {
              isEnd = true;
              break;
            }
          }
          if (isEnd) {
            target = _pageList[p];
            break;
          }
        }
        const { pageIndex: skipTargetPage, questions } = target;
        if (currentPage.value !== skipTargetPage) {
          const arr = questions.filter((item: any) => item.index >= skipIndex);
          skipPageList.value.map((item: any) => {
            if (item.pageIndex === skipTargetPage) {
              item.questions = arr;
            }
          });
        }
        let _right: any[];
        // 选项改变后重新生成页码记录
        const skipedPageNums = skipedPageIndexArr.filter(
          (item) => item <= currentPage.value
        );
        // 过滤跳过的页
        if (currentPage.value !== skipTargetPage) {
          // 跨页跳题
          _right = _pageList.filter((item: any) => {
            if (item.pageIndex >= skipTargetPage) {
              // 跳题选择后清除当前题目后的已选答案
              item.questions.map((e: any) => {
                if (formModel.value[e.id]) {
                  handleClearAnswer(e);
                }
              });
              return true;
            } else {
              return false;
            }
          });
          skipedPageIndexArr = uniq([...skipedPageNums, skipTargetPage]);
        } else {
          // 当前页跳题
          _right = _pageList.filter((item: any) => {
            if (item.pageIndex > skipTargetPage) {
              // 跳题选择后清除当前题目后的已选答案
              item.questions.map((e: any) => {
                if (formModel.value[e.id]) {
                  handleClearAnswer(e);
                }
              });
              return true;
            } else {
              return false;
            }
          });
          skipedPageIndexArr = uniq([...skipedPageNums, currentPage.value + 1]);
        }

        skipPageList.value = [..._left, ..._right];
      } else {
        if (currentPage.value !== totalPage.value) {
          const _right = _pageList.filter(
            (item: any) => item.pageIndex > currentPage.value
          );
          skipPageList.value = [..._left, ..._right];
          // 选项改变后还原后面的题目
          const skipedPageNums = skipedPageIndexArr.filter(
            (item) => item <= currentPage.value
          );
          skipedPageIndexArr = uniq([...skipedPageNums, currentPage.value + 1]);
        } else {
          // 最后一页选项改变还原跳题
          skipPageList.value[skipPageList.value.length - 1].questions =
            _pageList[currentPage.value - 1].questions;
          // 清除原有答案
          _pageList[currentPage.value - 1].questions.map((item: any) => {
            if (item.index > currentIndex) {
              handleClearAnswer(item);
            }
          });
        }
      }
    }
  };

  // 上一页
  const prePage = () => {
    const prePageIndex = skipedPageIndexArr.findIndex(
      (item) => item === currentPage.value
    );
    currentPage.value = skipedPageIndexArr[prePageIndex - 1];
    emit("pageChange", currentPage.value);
  };

  const nextPage = () => {
    const _currentContent = skipPageList.value.find(
      (item: any) => item.pageIndex === currentPage.value
    );
    const fields = _currentContent.questions.map((item: any) => item.id);
    // 当前页答题校验
    surveyRef.value.validateField(fields, (valid: any) => {
      if (valid) {
        const _index = skipedPageIndexArr.findIndex(
          (item) => item === currentPage.value
        );

        if (_index < skipedPageIndexArr.length - 1) {
          currentPage.value = skipedPageIndexArr[_index + 1];
          emit("pageChange", currentPage.value);
        } else {
          if (currentPage.value === totalPage.value) {
            // 最后一页页码变更
            const nextPageContent = skipPageList.value.find(
              (item: any) => item.pageIndex === currentPage.value
            );
            if (nextPageContent?.questions.length === 0) {
              emit("pageChange", currentPage.value);
            }
          } else {
            skipedPageIndexArr.push(currentPage.value + 1);
            currentPage.value = skipedPageIndexArr[_index + 1];
            emit("pageChange", currentPage.value);
          }
        }

        // 滚动条重置
        document.documentElement.scrollTop = 0;
      } else {
        return false;
      }
    });
  };

  // 获取当前题目题号
  const questionIndex = (id: string) => {
    return questionList.findIndex((item: any) => item["id"] === id) + 1;
  };

  // 清除问题答案
  const handleClearAnswer = (question: any) => {
    formModel.value[question.id] = undefined;

    setTimeout(() => {
      surveyRef.value.clearValidate(question.id);
    }, 30);
  };

  onMounted(() => {
    questionList = survey.list.filter(
      (item: any) => !["pagination", "paragraph"].includes(item.type)
    );
    createSurvey();
  });

  return {
    skipPageList,
    currentPage,
    totalPage,
    triggerSkip,
    prePage,
    nextPage,
    isLastPage,
  };
}
