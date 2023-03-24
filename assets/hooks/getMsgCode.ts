import api from "@/api";

const useMsg = () => {
  const btnText = ref("获取验证码");
  const btnTime = ref(60);
  const btnDisabled = ref(false);
  const getMsgCode = (telNumber: string | number) => {
    if (btnDisabled.value) return;
    api.sendMsg({ telNumber }).then(({ data: res }) => {
      console.log(res);
      btnDisabled.value = true;
      btnText.value = btnTime.value + "s后重试";
      let timer = setInterval(() => {
        btnText.value = --btnTime.value + "s后重试";
        if (btnTime.value <= 0) {
          clearInterval(timer);
          btnText.value = "获取验证码";
          btnDisabled.value = false;
          btnTime.value = 60;
        }
      }, 1000);
    });
  };
  return {
    btnText,
    btnDisabled,
    getMsgCode
  };
};

export default useMsg;
