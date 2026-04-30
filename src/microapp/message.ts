import hostMap from "./hostMap";

const service = "survey";

// 广播：问卷答题完成
export const answerComplete = (id: string) => {
  if (window.parent.length) {
    // 微服务
    window.parent.postMessage(
      { type: "survey_answer_complete", service, id },
      hostMap("yx")
    );
  }
};

export const calcHeight = (height: number | undefined) => {
  if (window.parent.length) {
    // 微服务
    window.parent.postMessage(
      { type: "survey_height", service, height },
      hostMap("yx")
    );
  }
};
