export const emptySurvey = (name: string) => {
  return {
    list: [],
    config: {
      title: `<p style="text-align: center;"><span style="font-size: 32px;">${name}</span></p>`,
      // desc: "<p style='text-align:center'>感谢您能抽出几分钟时间来参加本次答题，现在我们就马上开始吧！</p>",
      // suffix:
      //   "<p style='text-align:center'>您已完成本次问卷，感谢您的帮助与支持。</p>",
      indexColumn: true,
      // 答题人
      limitRange: "open",
      // 答题倒计时
      countdown: false,
      // 倒计时类型
      timeType: "1",
      // 倒计时计时单位
      timeUnit: "1",
      // 答题进度条
      progress: "",
      // 答题提交方式
      submitMethod: "1",
      afterSubmit: {
        conditionsGroup: [],
        action: [],
        method: "",
      },
    },
  };
};
