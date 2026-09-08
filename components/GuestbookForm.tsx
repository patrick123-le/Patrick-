"use client";

import { useState } from "react";

const feedbackTypes = ["内容有帮助", "答案纠错", "选题建议", "网站体验建议", "其他"];

export function GuestbookForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { message?: string; referenceId?: string };
      if (!response.ok) throw new Error(result.message || "提交失败，请稍后重试。");
      if (result.referenceId) window.localStorage.setItem("last-guestbook-reference", result.referenceId);
      event.currentTarget.reset();
      setStatus("success");
      setMessage(result.message || "留言已提交，审核后会公开显示。感谢你的反馈。 ");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "提交失败，请稍后重试。");
    }
  }

  return (
    <form className="guestbook-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label><span>昵称 <em>必填</em></span><input name="displayName" minLength={2} maxLength={24} required placeholder="怎么称呼你" /></label>
        <label><span>反馈类型</span><select name="feedbackType" defaultValue="内容有帮助">{feedbackTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      </div>
      <label><span>留言内容 <em>必填</em></span><textarea name="message" minLength={5} maxLength={800} required placeholder="欢迎留下建议、纠错或想看的选题……" rows={7} /></label>
      <div className="form-grid">
        <label><span>评分</span><select name="rating" defaultValue=""><option value="">暂不评分</option>{[5,4,3,2,1].map((score) => <option key={score} value={score}>{score} 分</option>)}</select></label>
        <label><span>联系邮箱 <small>不会公开</small></span><input type="email" name="email" maxLength={120} placeholder="用于必要时回复（选填）" /></label>
      </div>
      <label className="honeypot" aria-hidden="true">请勿填写<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="form-submit"><p>留言将先进入待审核状态。请勿提交敏感信息或具体案件材料。</p><button className="button button-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "正在提交…" : "提交留言"}</button></div>
      {message && <p className={`form-status ${status}`} role="status">{message}</p>}
    </form>
  );
}
