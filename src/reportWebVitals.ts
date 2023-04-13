import {
  ReportHandler,
  getCLS,
  getFID,
  getFCP,
  getLCP,
  getTTFB,
} from "web-vitals";

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) { // 만약 onPerfEntry가 존재하고 함수인 경우
    getCLS(onPerfEntry); // getCLS 함수 실행
    getFID(onPerfEntry); // getFID 함수 실행
    getFCP(onPerfEntry); // getFCP 함수 실행
    getLCP(onPerfEntry); // getLCP 함수 실행
    getTTFB(onPerfEntry); // getTTFB 함수 실행
  }
};

export default reportWebVitals;
