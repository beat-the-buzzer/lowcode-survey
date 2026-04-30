export const getLevel = (tree: any, childKey: string) => {
  let maxLevel = 0;
  (function multiArr(arr, level) {
    ++level;
    maxLevel = Math.max(level, maxLevel);
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      item.level = level;
      if (item[childKey] && item[childKey].length > 0) {
        multiArr(item[childKey], level);
      } else {
        delete item[childKey];
      }
    }
  })(tree, 0);
  return maxLevel;
};

export const findNode = (
  tree,
  id,
  targetKey = "id",
  childKey = "children",
  arr: any = []
) => {
  for (const i in tree) {
    if (tree[i][targetKey] === id) {
      arr.push(tree[i]);
      if (tree[i][childKey]?.length > 0) {
        getChild(tree[i][childKey], childKey, arr);
      }
    } else {
      if (tree[i][childKey]?.length > 0) {
        findNode(tree[i][childKey], id, targetKey, childKey, arr);
      }
    }
  }
  return arr.filter((v) => v[targetKey] !== id);
};

export const findNodeByLevel = (
  tree,
  id,
  targetKey = "id",
  childKey = "children",
  arr: any = []
) => {};

const getChild = (list, childKey, arr) => {
  list.forEach((v) => {
    arr.push(v);
    // if (v[childKey]) {
    //   getChild(v[childKey], childKey, arr);
    // }
  });
};
