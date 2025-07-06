import { buildShortUUID } from "@/utils/uuid";
import { useDesignFormStore } from "@/stores/modules/design";

const store = useDesignFormStore();

export const questionAddOptions = (orign: any) => {
  if (!orign) {
    return;
  }
  delete orign.icon;
  let children: any;
  switch (orign.type) {
    case "mult_text":
      children = [
        {
          attribute: {
            inputType: "string",
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "single_choice":
      children = [
        {
          title: "可在右侧选择选项模板快速输入",
          attribute: {
            skipPath: "",
          },
          id: buildShortUUID(),
        },
        {
          title: "选项2",
          attribute: {
            skipPath: "",
          },
          id: buildShortUUID(),
        },
      ];
      // children = []
      // for (let i = 0; i < store.singleChioceList.length; i++) {
      //   children.push({
      //     attribute: { skipPath: "" },
      //     id: buildShortUUID(),
      //     oid: store.singleChioceList[i].id,
      //     title: store.singleChioceList[i].label,
      //     value: store.singleChioceList[i].value,
      //   })
      // }
      break;
    case "mult_choice":
      children = [
        {
          title: "可在右侧选择选项模板快速输入",
          attribute: {
            skipPath: "",
          },
          id: buildShortUUID(),
        },
        {
          title: "选项2",
          attribute: {
            skipPath: "",
          },
          id: buildShortUUID(),
        },
        // {
        //   title: "选项2",
        //   attribute: {
        //     skipPath: "",
        //   },
        //   id: buildShortUUID(),
        // },
      ];
      // children = []
      // for (let i = 0; i < store.multiChioceList.length; i++) {
      //   children.push({
      //     attribute: { skipPath: "" },
      //     id: buildShortUUID(),
      //     oid: store.multiChioceList[i].id,
      //     title: store.multiChioceList[i].label,
      //     value: store.multiChioceList[i].value,
      //   })
      // }
      break;
    case "score":
      children = [
        {
          attribute: {
            maxScore: 5,
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "time":
      children = [
        {
          attribute: {
            type: "date",
            format: "YYYY-MM-DD",
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "fill_blanks":
      orign.title = "请填写以下信息";
      children = [
        {
          attribute: {
            content:
              "<p><br></p><p>    姓名___年龄___岁</p><p><br></p><p>  联系方式___联系人___</p><p>    </p>",
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "nps":
      orign.title = "您向朋友或同事推荐我们的可能性有多大？";
      children = [
        {
          attribute: {
            startTip: "不可能",
            endTip: "极有可能",
            maxScore: 10,
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "sort":
      orign.attribute.atLeast = 1;
      children = [
        {
          title: "选项1",
          attribute: {
            skipPath: "",
          },
          id: buildShortUUID(),
        },
        {
          title: "选项2",
          attribute: {
            skipPath: "",
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "paragraph":
      orign.title = "";
      break;
    case "matrix_radio":
    case "matrix_check":
      orign.row = [
        {
          title: "矩阵行1",
          id: buildShortUUID(),
        },
        {
          title: "矩阵行2",
          id: buildShortUUID(),
        },
      ];
      children = [
        {
          title: "选项1",
          attribute: {},
          id: buildShortUUID(),
        },
        {
          title: "选项2",
          attribute: {},
          id: buildShortUUID(),
        },
      ];
      break;

    case "matrix_blanks":
      orign.row = [
        {
          title: "矩阵行1",
          id: buildShortUUID(),
        },
        {
          title: "矩阵行2",
          id: buildShortUUID(),
        },
      ];
      children = [
        {
          title: "选项1",
          attribute: {
            inputType: "string",
          },
          id: buildShortUUID(),
        },
        {
          title: "选项2",
          attribute: {
            inputType: "string",
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "matrix_scores":
      orign.row = [
        {
          title: "矩阵行1",
          id: buildShortUUID(),
        },
        {
          title: "矩阵行2",
          id: buildShortUUID(),
        },
      ];
      children = [
        {
          title: "选项1",
          attribute: {},
          id: buildShortUUID(),
        },
        {
          title: "选项2",
          attribute: {},
          id: buildShortUUID(),
        },
      ];
      break;
    case "increase_table":
      orign.attribute.defaultRows = 2;
      children = [
        {
          title: "选项1",
          attribute: {
            dataType: "text",
            inputType: "string",
          },
          id: buildShortUUID(),
        },
        {
          title: "选项2",
          attribute: {
            dataType: "text",
            inputType: "string",
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "select":
      children = [
        {
          title: "选项1",
          id: buildShortUUID(),
        },
        {
          title: "选项2",
          id: buildShortUUID(),
        },
      ];
      break;
    case "cascader":
      orign.textSource = "";
      children = [];
      break;
    case "upload":
      children = [
        {
          attribute: {
            accept: ["*"],
            limit: 1,
            size: 20,
          },
          id: buildShortUUID(),
        },
      ];
      break;
    case "score_text":
      children = [
        {
          attribute: {
            inputType: "number",
          },
          id: buildShortUUID(),
        },
      ];
      // orign.scoreConfig = store.scoreConfig
      break;
    default:
      break;
  }

  return {
    id: buildShortUUID(),
    ...orign,
    children,
  };
};

// 添加分页组件
export const handleAddPagination = (list: any[]) => {
  // 第一次添加分页组件
  if (list.length === 1) {
    // 未添加问题
    list.unshift({
      type: "pagination",
      title: "分页",
      id: buildShortUUID(),
    });
  } else {
    if (list[0].type !== "pagination") {
      list.unshift({
        type: "pagination",
        title: "分页",
        id: buildShortUUID(),
      });
    }
  }
  // 总页数
  const paginationArr = list.filter((item) => item.type === "pagination");
  list.map((item) => {
    if (item.type === "pagination") {
      item.attribute = {
        current: paginationArr.findIndex((e) => e.id === item.id) + 1,
        total: paginationArr.length,
      };
    }
  });
};

export const forcePagination = (formList: any[]) => {
  const list = formList.filter((item: any) => item.type !== "pagination");
  return list.reduce(
    (acc: any[], cur: any, index: number) => {
      if (index < list.length - 1) {
        return acc.concat(cur, {
          type: "pagination",
          title: "分页",
          id: buildShortUUID(),
          attribute: {
            current: index + 2,
            total: list.length,
          },
        });
      } else {
        return acc.concat(cur);
      }
    },
    [
      {
        type: "pagination",
        title: "分页",
        id: buildShortUUID(),
        attribute: {
          current: 1,
          total: list.length,
        },
      },
    ]
  );
};

export const questionSortIndex = (list: any[], current: any) => {
  const questionList = list.filter(
    (item) => !["pagination", "paragraph"].includes(item.type)
  );

  const index = questionList.findIndex((item) => item.id === current.id);

  return index + 1;
};
