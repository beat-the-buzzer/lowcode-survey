export default [
  {
    title: "辅助布局",
    children: [
      // {
      //   type: "pagination",
      //   title: "分页",
      //   icon: "fenye",
      //   attribute: {
      //     current: 1,
      //     total: 1,
      //   },
      // },
      {
        type: "paragraph",
        title: "段落说明",
        icon: "text",
      },
    ],
  },
  {
    title: "选择题",
    children: [
      {
        type: "single_choice",
        title: "单选题",
        icon: "danxuanti",
        attribute: {
          required: true,
          // optionSpan: 1,
          qzz: 1,
          zblx: "1",
          sfkqtmdf: "1", //是否开启题目得分开关  '1':开启  '0':关闭
          tmzf: 0, //题目总分
          // pfdjdmb_id: '',
          skipPath: "",
        },
      },
      {
        type: "mult_choice",
        title: "多选题",
        icon: "duoxuanti",
        attribute: {
          required: true,
          qzz: 1,
          zblx: "1",
          optionSpan: 1,
          sfkqtmdf: "1", //是否开启题目得分开关  '1':开启  '0':关闭
          sxdf: "0", //是否开启少选得分开关 '1':开启  '0':关闭
          sxdfgz: "0", //少选得分规则  '1':得固定分   '0':得部分分
          tmzf: 0, //题目总分
          gddf: 0, //得固定分分数
          atLeast: 1,
          skipPath: "",
        },
      },
      // {
      //   type: "mult_text",
      //   title: "单行文本",
      //   icon: "tiankongti",
      //   attribute: {
      //     required: true,
      //     qzz: 1,
      //     zblx: '1',
      //     skipPath: "",
      //   },
      // },
      // {
      //   type: "mult_text",
      //   title: "多行文本",
      //   icon: "tiankongti",
      //   attribute: {
      //     required: true,
      //     qzz: 1,
      //     zblx: '',
      //     skipPath: "",
      //   },
      // },
      // {
      //   type: "score_text",
      //   title: "评分题",
      //   icon: "tiankongti",
      //   attribute: {
      //     required: true,
      //     qzz: 1,
      //     zblx: '1',
      //     skipPath: "",
      //   },
      // },

      // {
      //   type: "select",
      //   title: "下拉题",
      //   icon: "xialati",
      //   attribute: {
      //     required: true,
      //     skipPath: "",
      //   },
      // },
      // {
      //   type: "cascader",
      //   title: "级联题",
      //   icon: "xialati",
      //   attribute: {
      //     required: true,
      //     skipPath: "",
      //   },
      // },
      // {
      //   type: "sort",
      //   title: "排序题",
      //   icon: "paixuti",
      //   attribute: {
      //     required: true,
      //     optionSpan: 1,
      //     skipPath: "",
      //   },
      // },
      {
        type: "time",
        title: "时间选择",
        icon: "shijian",
        attribute: {
          required: true,
          skipPath: "",
        },
      },
    ],
  },
  {
    title: "填空题",
    children: [
      {
        type: "mult_text",
        title: "文本题",
        icon: "tiankongti",
        attribute: {
          required: true,
          skipPath: "",
        },
      },
      // {
      //   type: "fill_blanks",
      //   title: "多项填空",
      //   icon: "hengxiangtiankong",
      //   attribute: {
      //     required: true,
      //     skipPath: "",
      //   },
      // },
    ],
  },
  // {
  //   title: "打分题",
  //   children: [
  //     {
  //       type: "score",
  //       title: "打分题",
  //       icon: "dafenti",
  //       attribute: {
  //         required: true,
  //         skipPath: "",
  //       },
  //     },
  //     // {
  //     //   type: "nps",
  //     //   title: "NPS量表",
  //     //   icon: "nps",
  //     //   attribute: {
  //     //     required: true,
  //     //     skipPath: "",
  //     //   },
  //     // },
  //   ],
  // },

  {
    title: "量表题",
    children: [
      // {
      //   type: "matrix_radio",
      //   title: "矩阵单选",
      //   icon: "juzhenxuanze",
      //   attribute: {
      //     required: true,
      //     skipPath: "",
      //   },
      // },
      // {
      //   type: "matrix_check",
      //   title: "矩阵多选",
      //   icon: "juzhendafen",
      //   attribute: {
      //     required: true,
      //     skipPath: "",
      //   },
      // },
      // {
      //   type: "matrix_blanks",
      //   title: "矩阵填空",
      //   icon: "juzhentiankong",
      //   attribute: {
      //     required: true,
      //     skipPath: "",
      //   },
      // },
      // {
      //   type: "matrix_scores",
      //   title: "打分",
      //   icon: "juzhenliangbiao",
      //   attribute: {
      //     required: true,
      //     skipPath: "",
      //     maxScore: 5,
      //   },
      // },
      {
        type: "increase_table",
        title: "自增表格",
        icon: "zizengbiaoge",
        attribute: {
          required: true,
          defaultRows: 2,
          minRows: 1,
          skipPath: "",
        },
      },
    ],
  },
  {
    title: "文件上传",
    children: [
      {
        type: "upload",
        title: "上传",
        icon: "wenjianshangchuan",
        attribute: {
          required: true,
          skipPath: "",
        },
      },
      {
        type: "signature",
        title: "签名",
        icon: "lujing103",
        attribute: {
          required: true,
          skipPath: "",
        },
      },
    ],
  },
];
