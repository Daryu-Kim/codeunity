import { toast } from "react-toastify";

export const toastError = (msg: string) => {
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

export const resolvePromise = (promise: Promise<any>) => {
  Promise.resolve(promise)
  .then((value) => {
    return value;
  });
}
