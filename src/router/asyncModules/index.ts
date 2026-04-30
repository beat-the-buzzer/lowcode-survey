// generate components map
export const constantRouterComponents = {};

// auto load
const modulesFiles: Record<string, any> = import.meta.glob("./**/*.ts", {
  eager: true,
});

Object.keys(modulesFiles).forEach((path) => {
  if (path.startsWith("./index.")) return;
  const value = modulesFiles[path].default;

  // mouted
  Object.entries(value).forEach(([path, comp]) => {
    constantRouterComponents[path] = comp;
  });
});
