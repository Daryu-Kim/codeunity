import { toast } from "react-toastify";

export const toastError = (msg) => {
  if (isDarkMode()) {
    toast.error(msg, {
      theme: "dark",
    });
  } else {
    toast.error(msg, {
      theme: "light",
    });
  }
};

export const toastSuccess = (msg) => {
  if (isDarkMode()) {
    toast.success(msg, {
      theme: "dark",
    });
  } else {
    toast.success(msg, {
      theme: "light",
    });
  }
}

export const toastLoading = (msg) => {
  if (isDarkMode()) {
    toast.loading(msg, {
      theme: "dark",
    });
  } else {
    toast.loading(msg, {
      theme: "light",
    });
  }
};

export const toastClear = () => {
  toast.dismiss();
};

export const isDarkMode = () => {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}