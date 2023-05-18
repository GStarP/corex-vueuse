import { beforeEach } from "vitest";
import "./polyfillPointerEvents";

beforeEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
});
