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

export const convertTimestamp = (current, created) => {
  const tempTime = current - created;
  if (tempTime < 60) {
    return "방금 전";
  } else if (tempTime < 3600) {
    return `${(tempTime / 60).toFixed()}분 전`;
  } else if (tempTime < 86400) {
    return `${(tempTime / 3600).toFixed()}시간 전`;
  } else if (tempTime < 604800) {
    return `${(tempTime / 86400).toFixed()}일 전`;
  } else if (tempTime < 2592000) {
    return `${(tempTime / 604800).toFixed()}주 전`;
  } else if (tempTime < 31556952) {
    return `${(tempTime / 2592000).toFixed()}달 전`;
  } else if (tempTime < 157784760) {
    return `${(tempTime / 31556952).toFixed()}년 전`;
  } else {
    return "오래 전";
  }
};