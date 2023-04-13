import React from "react";
import ReactDOM from "react-dom";
import "./styles/reset.scss";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

// React DOM 라이브러리에서 render 함수를 불러온다.
// React.StrictMode를 사용하여 엄격한 모드로 앱을 렌더링한다.
// App 컴포넌트를 렌더링하고, root element에 추가한다.
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// serviceWorkerRegistration 모듈에서 register 함수를 불러온다.
// service worker를 등록한다.
serviceWorkerRegistration.register();

// reportWebVitals 모듈에서 reportWebVitals 함수를 불러온다.
// 웹 페이지의 성능을 측정하고, 결과를 출력한다.
reportWebVitals();
