export const identity_list: any = [
  {
    label: "教师",
    value: "teacher",
  },
  {
    label: "预录取生",
    value: "recruit",
  },
  {
    label: "新生",
    value: "newcomer",
  },
  {
    label: "正式生",
    value: "student",
  },
  {
    label: "校友",
    value: "alumni",
  },
  {
    label: "单位",
    value: "company",
  },
  {
    label: "学生家长",
    value: "parent",
  },
  {
    label: "管理员",
    value: "manager",
  },
  {
    label: "游客",
    value: "visitor",
  },
];

export const triggerMethods: any = [
  {
    label: "登录",
    value: "login",
  },
  {
    label: "校友申请",
    value: "apply",
  },
];

export const userGroups: any = [
  {
    id: "1648596174409392129",
    pid: "teacher",
    name: "校友老师",
    sl: 19,
    sfid: "teacher",
    child: [
      {
        id: "1659019211092893697",
        pid: "1648596174409392129",
        name: "校友老师2-2",
        sl: 2,
        sfid: "teacher",
        child: [
          {
            id: "1659019362196889601",
            pid: "1659019211092893697",
            name: "校友老师2-2-1",
            sl: 1,
            sfid: "teacher",
            child: [],
          },
        ],
      },
      {
        id: "1658272916380147713",
        pid: "1648596174409392129",
        name: "校友老师二级",
        sl: 1,
        sfid: "teacher",
        child: [],
      },
      {
        id: "1663815833098199042",
        pid: "1648596174409392129",
        name: "111",
        sl: 0,
        sfid: "teacher",
        child: [],
      },
    ],
  },
  {
    id: "1660746652364840961",
    pid: "teacher",
    name: "迎新老师",
    sl: 3,
    sfid: "teacher",
    child: [
      {
        id: "1663797552454914050",
        pid: "1660746652364840961",
        name: "迎新老师1-1",
        sl: 0,
        sfid: "teacher",
        child: [],
      },
    ],
  },
  {
    id: "1660746713601679361",
    pid: "teacher",
    name: "就业老师",
    sl: 0,
    sfid: "teacher",
    child: [
      {
        id: "1660746789485027330",
        pid: "1660746713601679361",
        name: "院系管理员",
        sl: 0,
        sfid: "teacher",
        child: [],
      },
      {
        id: "1660746754135433218",
        pid: "1660746713601679361",
        name: "就业咨询师",
        sl: 0,
        sfid: "teacher",
        child: [],
      },
    ],
  },
];
