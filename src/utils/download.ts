import { getToken } from "@/utils/cookies";
import { addTask } from "@/api";
import { ElMessage } from "element-plus";

// export const downloadXlsx = async (
//   type: string,
//   id: string,
//   fileName: string
// ) => {
//   await fetch(`/zfsoft-api/wjdc/djda/download/${type}/${id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       zfsoftToken: getToken(),
//     },
//   })
//     .then((response) => {
//       return response.blob();
//     })
//     .then((data) => download(data, fileName))
//     .catch(function (error) {
//       console.log(error);
//     });
// };

// 异步下载
export const downloadXlsx = async (
  type: string,
  id: string,
  fileName: string
) => {
  await addTask({ type, id });
  ElMessage.success(
    "下载任务已提交，请点击【右上角头像-下载管理】，查看任务情况。"
  );
};

export const downloadDoc = async (id: string, fileName: string) => {
  await fetch(`/zfsoft-api/wjdc/wjxx/dc/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      zfsoftToken: getToken(),
    },
  })
    .then((response) => {
      return response.blob();
    })
    .then((data) => download(data, fileName))
    .catch(function (error) {
      console.log(error);
    });
};

export const downloadByTask = async (filename: string, fileType: string) => {
  const arr = filename.split("-");
  arr.pop();
  await fetch("/zfsoft-api/wjdc/djda/download/file", {
    method: "POST",
    headers: {
      zfsoftToken: getToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename: arr.join("-") }),
  })
    .then((response) => {
      return response.blob();
    })
    .then((data) => download(data, filename, fileType))
    .catch(function (error) {
      console.log(error);
    });
};

const download = (data: Blob, fileName: string, fileType = "xlsx") => {
  const objectURL = URL.createObjectURL(data);
  const downloadElement = document.createElement("a");
  downloadElement.href = objectURL;
  downloadElement.download = `${fileName}.${fileType}`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(objectURL);
};

export const downloadZip = async (xm: string, path: string) => {
  const body = [{ xm, path }];
  await fetch(`/zfsoft-api/wjdc/file/downloadZipFile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      zfsoftToken: getToken(),
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.blob();
    })
    .then((data) => download(data, xm, "zip"))
    .catch(function (error) {
      console.log(error);
    });
};
