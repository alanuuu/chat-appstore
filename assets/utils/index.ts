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
