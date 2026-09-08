"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "patrick-recall-mode";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("recall-mode-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("recall-mode-change", callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function RecallToggle() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggle() {
    const next = !enabled;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    window.dispatchEvent(new CustomEvent("recall-mode-change", { detail: next }));
  }

  return (
    <button className={`recall-toggle${enabled ? " is-on" : ""}`} type="button" role="switch" aria-checked={enabled} onClick={toggle}>
      <span className="toggle-track"><span /></span>
      <span><strong>回想模式</strong><small>{enabled ? "已开启，默认隐藏答案" : "开启后先独立作答"}</small></span>
    </button>
  );
}
