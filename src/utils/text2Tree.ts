interface TreeNode {
  label: string;
  value: string;
  children?: TreeNode[];
}

// 循环构建子节点
const buildChildrenNode = (children: TreeNode[], nodeArray: string[]) => {
  for (let i = 0; i < nodeArray.length; i++) {
    const node: TreeNode = {
      label: nodeArray[i],
      value: nodeArray[i],
    };
    // if (i != nodeArray.length) {
    //   node.children = [];
    // }
    if (children.length === 0) {
      children.push(node);
    }
    let isExist = false;
    for (let j = 0; j < children.length; j++) {
      if (children[j].label == node.label) {
        if (i != nodeArray.length - 1 && !children[j].children) {
          children[j].children = [];
        }
        children = i == nodeArray.length - 1 ? children : children[j].children;
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      children.push(node);
      if (
        i != nodeArray.length - 1 &&
        !children[children.length - 1].children
      ) {
        children[children.length - 1].children = [];
      }
      children =
        i == nodeArray.length - 1
          ? children
          : children[children.length - 1].children;
    }
  }
};
/**
 * @description: string[] ->  treeNode[]
 * @param multStr 多行文本
 * @param flag 字符串分割符号
 * @return { treeNode[] }
 */
export const multText2Tree = (multStr: string, flag: string): TreeNode[] => {
  const list: string[] = Array.from(new Set(multStr.split("\n")));
  const targetList: TreeNode[] = [];
  list
    .filter((item) => !!item)
    .map((item) => {
      const nodeArray: string[] = item.split(flag).filter((str) => str != "");
      // 递归
      const children: TreeNode[] = targetList;
      // 构建根节点
      if (children.length == 0) {
        const root: TreeNode = {
          label: nodeArray[0],
          value: nodeArray[0],
        };

        children.push(root);
        buildChildrenNode(children, nodeArray);
      } else {
        buildChildrenNode(children, nodeArray);
      }
    });

  return targetList;
};
