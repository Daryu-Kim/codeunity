/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

clientsClaim(); // 새로운 서비스 워커가 활성화되면 즉시 클라이언트를 제어하도록 설정

precacheAndRoute(self.__WB_MANIFEST); // 웹팩 빌드에서 생성된 precache manifest를 사용하여 캐시를 미리 로드하고 라우팅

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  ({ request, url }: { request: Request; url: URL }) =>
    request.mode === "navigate" && // 네비게이션 요청
    !url.pathname.startsWith("/_") && // 특정 경로 제외
    !url.pathname.match(fileExtensionRegexp), // 파일 확장자 제외
  createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`) // 네비게이션 요청에 대한 응답으로 index.html을 반환
);

registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"), // png 파일 요청
  new StaleWhileRevalidate({
    cacheName: "images", // 캐시 이름
    plugins: [new ExpirationPlugin({ maxEntries: 50 })], // 캐시 만료 기간 설정
  })
);

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    // 새로운 서비스 워커가 설치되었지만 활성화되지 않은 경우, 활성화되도록 지시
    self.skipWaiting();
  }
});
