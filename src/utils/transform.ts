import { htmlToText } from "html-to-text";
export const rexFilter = (originString: string) => {
  return htmlToText(originString, {
    selectors: [
      {
        selector: "img",
        format: "anchor",
        options: { linkBrackets: false },
      },
      {
        selector: "a",
        options: { linkBrackets: false },
      },
    ],
  });
};
