import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

// 에러 메시지를 토스트로 띄우는 함수
export const toastError = (msg) => {
  // toast.error 함수를 호출하며, 에러 메시지와 함께 옵션 객체를 전달한다.
  toast.error(msg, {
    // isDarkMode 함수가 true를 반환하면 "dark", false를 반환하면 "light"를 테마로 설정한다.
    theme: isDarkMode() ? "dark" : "light",
  });
};

// 성공 토스트 메시지를 띄우는 함수
export const toastSuccess = (msg) => {
  // toast.success 함수를 호출하면서 메시지와 함께 옵션 객체를 전달한다.
  toast.success(msg, {
    // isDarkMode 함수를 호출하여 현재 다크 모드인지 라이트 모드인지 확인하고, 그에 맞는 테마를 설정한다.
    theme: isDarkMode() ? "dark" : "light",
  });
};

export const toastLoading = (msg) => {
  // 메시지를 인자로 받아 로딩 토스트를 띄우는 함수
  toast.loading(msg, {
    // 다크 모드인지 라이트 모드인지에 따라 테마 설정
    theme: isDarkMode() ? "dark" : "light",
  });
};

// toastClear 함수를 export
export const toastClear = () => {
  // toast.dismiss() 함수를 호출하여 토스트 메시지를 닫음
  toast.dismiss();
};

// 윈도우 객체가 존재하고, 미디어 쿼리를 지원하는 경우
export const isDarkMode = () => {
  // "(prefers-color-scheme: dark)" 미디어 쿼리를 사용하여 다크 모드 여부를 확인하고 반환
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// 현재 시간과 작성 시간을 받아와서 시간 차이를 계산하는 함수
export const convertTimestamp = (current, created) => {
  // 현재 시간과 작성 시간의 차이를 계산하여 tempTime 변수에 저장
  const tempTime = current - created;
  // 시간 단위와 해당 시간 단위의 범위를 객체로 저장한 배열
  const timeUnits = [
    { unit: "방금 전", time: 60 },
    { unit: "분 전", time: 3600 },
    { unit: "시간 전", time: 86400 },
    { unit: "일 전", time: 604800 },
    { unit: "주 전", time: 2592000 },
    { unit: "달 전", time: 31556952 },
    { unit: "년 전", time: 157784760 },
    { unit: "오래 전", time: Infinity },
  ];
  // 시간 단위 배열을 순회하며 현재 시간과 작성 시간의 차이(tempTime)가 해당 시간 단위의 범위보다 작은 경우
  for (let i = 0; i < timeUnits.length; i++) {
    if (tempTime < timeUnits[i].time) {
      // 해당 시간 단위로 시간 차이를 계산하여 문자열로 반환
      return `${Math.floor(tempTime / (timeUnits[i - 1]?.time ?? 1))}${timeUnits[i - 1]?.unit ?? ""}`;
    }
  }
};

// 파일 크기가 1000000보다 작거나 같으면 그대로 반환
export const zipImage = async (file) => {
  if (file.size <= 1000000) {
    return file;
  }
  try {
    // 옵션 설정
    const options = {
      maxSizeMB: 1, // 최대 파일 크기
      useWebWorker: true, // 웹 워커 사용 여부
    };
    // 이미지 압축
    return await imageCompression(file, options);
  } catch (error) {
    console.log(error);
  }
};