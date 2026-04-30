import { nextTick } from "vue";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import { ElLoading } from "element-plus";

export const outputPDF = (
  targetId: string,
  childClass: string,
  pdfName: string
) => {
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  nextTick(() => {
    const target = document.getElementById(targetId);
    if (target) {
      const pageHeight = (target.scrollWidth / A4_WIDTH) * A4_HEIGHT;
      // 获取分割dom，此处为class类名为item的dom
      const lableListID = document.getElementsByClassName(childClass);
      // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
      for (let i = 0; i < lableListID.length; i++) {
        const multiple = Math.ceil(
          (lableListID[i]["offsetTop"] +
            lableListID[i]["offsetHeight"] -
            target.offsetTop) /
            pageHeight
        );
        if (isSplit(lableListID, i, multiple * pageHeight, target.offsetTop)) {
          const divParent = lableListID[i].parentNode; // 获取该div的父节点
          const newNode = document.createElement("div");
          newNode.className = "emptyDiv";
          // newNode.style.background = "#01195e";
          const _H =
            multiple * pageHeight -
            (lableListID[i]["offsetTop"] +
              lableListID[i]["offsetHeight"] -
              target.offsetTop);
          newNode.style.height = _H + 30 + "px";
          newNode.style.width = "100%";
          const next = lableListID[i].nextSibling; // 获取div的下一个兄弟节点
          // 判断兄弟节点是否存在
          if (next) {
            // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
            divParent?.insertBefore(newNode, next);
          } else {
            // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
            divParent?.appendChild(newNode);
          }
        }
      }
      pdf(targetId, pdfName);
    }
  });
};

// 判断是否需要添加空白div
const isSplit = (nodes, index, pageHeight, top) => {
  // 计算当前这块dom是否跨越了a4大小，以此分割
  return !!(
    nodes[index].offsetTop + nodes[index].offsetHeight - top < pageHeight &&
    nodes[index + 1] &&
    nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight - top >
      pageHeight
  );
};

const pdf = (targetId: string, pdfName: string) => {
  // 避免出现浏览器滚动条导致的内容不全处理
  document.body.scrollTop = 0;
  //div内部滚动导致内容不全处理
  // @ts-ignore
  document.getElementById("app").style.height = "auto";
  const loading = ElLoading.service({
    lock: true,
    text: "正在生成pdf，请稍等...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(async () => {
    // @ts-ignore
    html2canvas(document.getElementById(targetId), {
      background: "#01195e",
      // height: document.getElementById('upload').scrollHeight,
      // windowHeight: document.getElementById('upload').scrollHeight
    }).then((canvas) => {
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;

      //一页pdf显示html页面生成的canvas高度;
      const pageHeight = (contentWidth / 595.28) * 841.89;
      //未生成pdf的html页面高度
      let leftHeight = contentHeight;
      //页面偏移
      let position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      const imgWidth = 595.28;
      const imgHeight = (595.28 / contentWidth) * contentHeight;

      const pageData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new JsPDF("p", "pt", "a4");

      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save(`${pdfName}.pdf`);
      // @ts-ignore
      document.getElementById("app").style.height = "100%";
      // @ts-ignore
      document
        .getElementsByClassName("emptyDiv")[0]
        .parentNode.removeChild(document.getElementsByClassName("emptyDiv")[0]);
    });
  }, 300);

  loading.close();
};
