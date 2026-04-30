export interface Options {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface FormItem {
  label?: string;
  labelWidth?: string;
  required?: boolean;
  rules?: any;
  error?: string;
  showMessage?: boolean;
  inlineMessage?: boolean;
  size?: string;
  showLabel?: boolean;
}

export interface FormList {
  title: string;
  type: string;
  name: string;
  customRules?: any; // 自定义检验规则,这个规则会合并进item.rules
  children: any[];
  options?: Options[]; // radio,checkbox,select选项
}

export interface FormData {
  list: FormList[];
  form: any; // form所有props
  config?: {
    style?: string; // 表单css样式，相当于scope
    hideField?: string[]; // 使用v-if隐藏的字段，用于交互
    confirm?: string; // 用于内部提交的表单按钮
    cancel?: string; // 用于内部提交的表单按钮
    addLoad?: boolean;
    expand?: boolean; // 用于设置筛选条件默认展开/收起状态
  };
  events?: {
    beforeRequest?: Function;
    afterResponse?: Function;
    beforeSubmit?: Function;
    afterSubmit?: Function;
  };
}

export interface TableData {
  tableProps?: any;
  columns: any;
  controlBtn?: any;
  events?: any;
  tree?: {
    show: boolean;
    beforeRequest?: Function;
    afterResponse?: Function;
    request: string;
    sourceFun: string;
    name: string;
  };
}
