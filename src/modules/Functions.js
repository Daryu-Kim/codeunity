import { toast } from "react-toastify";

export const toastError = (msg) => {
  if (localStorage.getItem("isDarkMode") == "dark") {
    toast.error(msg, {
      theme: "dark",
    });
  } else {
    toast.error(msg, {
      theme: "light",
    });
  }
};

export const resolvePromise = (promise) => {
  Promise.resolve(promise).then((value) => {
    return value;
  });
};
