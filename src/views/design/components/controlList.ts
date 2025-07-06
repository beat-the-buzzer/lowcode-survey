export default [
  {
    title: "选择题",
    children: [
      {
        type: "single_choice",
        title: "单选题",
        icon: "danxuanti",
        attribute: {
          required: true,
        },
      },
      {
        type: "mult_choice",
        title: "多选题",
        icon: "duoxuanti",
        attribute: {
          required: true,
          optionSpan: 1,
          atLeast: 1,

        },
      },

    ],
  },
  {
    title: "填空题",
    children: [
      {
        type: "mult_text",
        title: "填空题",
        icon: "tiankongti",
        attribute: {
          required: true,
        },
      },
    ],
  },
];
