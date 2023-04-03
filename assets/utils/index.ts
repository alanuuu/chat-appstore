export const qs = (data: Record<string, any>) => {
  const formData = new FormData();
  for (const key in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(key)) {
      if (data[key]) {
        if (data[key].constructor === Array) {
          if (data[key][0]) {
            if (data[key][0].constructor === Object) {
              formData.append(key, JSON.stringify(data[key]));
            } else {
              data[key].forEach((item: string, index: number) => {
                formData.append(key + `[${index}]`, item);
              });
            }
          } else {
            formData.append(key + "[]", "");
          }
        } else if (data[key].constructor === Object) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      } else {
        if (data[key] === 0) {
          formData.append(key, 0);
        } else {
          formData.append(key, "");
        }
      }
    }
  }
  return formData;
};

export const getTimeFromNow = (dateString: string) => {
  const now = new Date(); // 获取当前时间
  const date = new Date(dateString); // 根据传入的日期字符串创建一个Date对象
  const timeDiff = date.getTime() - now.getTime(); // 计算时间差，单位为毫秒

  // 计算相差的天数、小时数和分钟数
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  // 根据时间差的不同部分，生成对应的时间差字符串
  let timeStr = "";
  if (daysDiff > 0) {
    timeStr += `${daysDiff}天`;
  }
  if (hoursDiff > 0) {
    timeStr += `${hoursDiff}小时`;
  }
  if (minutesDiff > 0) {
    timeStr += `${minutesDiff}分钟`;
  }

  return timeStr; // 返回距离当前时间的天数、小时数和分钟数
};

export const copyToClipboard = (text: string) => {
  // 创建一个新的textarea元素
  var textarea = document.createElement("textarea");
  // 设置textarea的值为需要复制到剪切板的文本
  textarea.value = text;

  // 确保textarea不显示在屏幕上
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";

  // 将textarea添加到文档中
  document.body.appendChild(textarea);

  // 选中textarea中的文本
  textarea.select();

  // 将文本复制到剪切板
  document.execCommand("copy");

  // 删除textarea元素
  document.body.removeChild(textarea);
};

export const formatDateTime = (dateString: string) => {
  // 将传入的字符串转换为日期对象
  var date = new Date(dateString);

  // 从日期对象中获取年、月、日、小时、分钟和秒
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var day = date.getDate().toString().padStart(2, "0");
  var hours = date.getHours().toString().padStart(2, "0");
  var minutes = date.getMinutes().toString().padStart(2, "0");
  var seconds = date.getSeconds().toString().padStart(2, "0");

  // 返回格式化的日期字符串
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
};

export const imageToBase64 = (file: File, callback: (url: string) => void) => {
  var reader = new FileReader();
  reader.onload = function (event) {
    callback(event.target!.result as string);
  };
  reader.readAsDataURL(file);
};
