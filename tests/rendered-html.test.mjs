import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const works = JSON.parse(await readFile(new URL("../content/works.json", import.meta.url), "utf8"));
const glossary = JSON.parse(await readFile(new URL("../content/legal-glossary.json", import.meta.url), "utf8"));

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function submitGuestbook(payload) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-guestbook`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/api/guestbook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the public Chinese homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Patrick的实务学习手册<\/title>/i);
  assert.match(html, /把法务面试经验/);
  assert.match(html, /精选练习/);
  assert.match(html, /关于 Patrick/);
  assert.match(html, /查看详细教程/);
  assert.match(html, /观看置顶 🔝 视频/);
  assert.match(html, /xiaohongshu\.com\/user\/profile\/63de93c30000000026010a3f/);
  assert.match(html, /小红书ID：5082698158/);
  assert.doesNotMatch(html, /二维码/);
});

test("renders the searchable question library", async () => {
  const response = await render("/works");
  assert.equal(response.status, 200);

  const html = await response.text();
  const visibleHtml = html.replaceAll("<!-- -->", "");
  assert.match(html, /<title>法务题库｜Patrick的实务学习手册<\/title>/);
  assert.match(html, /找到 <strong>54<\/strong> 道题/);
  assert.match(html, /回想模式/);
  assert.match(html, /法务实务专业词表/);
  assert.match(html, /\/resources\/legal-glossary/);
  assert.match(visibleHtml, /第 1 题/);
  assert.match(visibleHtml, /第 54 题/);
  assert.doesNotMatch(html, /扩展题/);
  assert.equal(works[42].title.startsWith("法律对比："), true);
  assert.equal(works[43].title.startsWith("国际结算："), true);
  assert.equal(works[44].title.startsWith("DSA法案："), true);
  assert.equal(works[45].title.startsWith("GDPR数据跨境传输："), true);
  assert.equal(works[46].title.startsWith("我国数据出境："), true);
  assert.equal(works[47].title.startsWith("我国TIA概述："), true);
  assert.equal(works[48].title.startsWith("数据概念辨析："), true);
  assert.equal(works[49].title.startsWith("我国PIA概述："), true);
  assert.equal(works[50].title.startsWith("合同审查2："), true);
  assert.equal(works[51].title.startsWith("合同审查3："), true);
  assert.equal(works[52].title.startsWith("合同审查4："), true);
  assert.equal(works[53].title.startsWith("合同审查5："), true);
  assert.doesNotMatch(works[52].title, /by Patrick/i);
  assert.ok(html.includes(works[0].title));
});

test("renders the redesigned about page without private QR content", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /patricklee2026@163\.com/);
  assert.match(html, /patrick-mountain\.jpg/);
  assert.match(html, /Last Day/);
  assert.match(html, /一个法学生的疯言疯语/);
  assert.match(html, /八千位读者/);
  assert.match(html, /期待知识库可以实现的目的/);
  assert.match(html, /履历树，一些过往/);
  assert.match(html, /第 19—21 届/);
  assert.doesNotMatch(html, /个月字节实习|个月积累八千读者|篇离职 landing 文档/);
  assert.match(html, /国际经济法/);
  assert.doesNotMatch(html, /参与 RFP 解读|开展涉外投资检索|驻场参与政府采购投诉案件/);
  assert.doesNotMatch(html, /patrick-portrait\.jpg|魏积宇|二维码|旅行经历/);
  assert.doesNotMatch(html, /2025\.08|2026\.04|2024\.12/);
});

test("renders the standalone legal glossary", async () => {
  const response = await render("/resources/legal-glossary");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /法务实务专业词表/);
  assert.match(html, /数据合规与AI治理类/);
  assert.equal(glossary.sections.length, 7);
  assert.equal(glossary.sections.reduce((total, section) => total + section.items.length, 0), 62);
});

test("renders a question detail with progressively revealed content", async () => {
  const response = await render(`/works/${works[0].slug}`);
  assert.equal(response.status, 200);

  const html = await response.text();
  const visibleHtml = html.replaceAll("<!-- -->", "");
  assert.ok(html.includes(works[0].title));
  assert.match(visibleHtml, /第 1 题/);
  assert.match(html, /显示分析思路/);
  assert.match(html, /显示参考答案/);
});

test("renders external feedback channels and rejects local guestbook submissions", async () => {
  const page = await render("/guestbook");
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /小红书反馈板/);
  assert.match(html, /patricklee2026@163\.com/);
  assert.doesNotMatch(html, /<form|提交留言|待审核状态/);

  const rejected = await submitGuestbook({
    displayName: "测试访客",
    feedbackType: "网站体验建议",
    message: "这是一条仅用于自动化测试的本地留言。",
  });
  assert.equal(rejected.status, 410);
  const body = await rejected.json();
  assert.match(body.message, /不接收或存储留言/);
  assert.equal(body.referenceId, undefined);
});

test("keeps answers complete, removes empty quote rows, and links every extracted mind map", async () => {
  const designContract = works.find((work) => work.id === "s10");
  const fitOutContract = works.find((work) => work.id === "s11");
  const damagesContract = works.find((work) => work.id === "s12");
  assert.ok(designContract.answer.length > 5000);
  assert.match(designContract.answer, /适用法律、争议解决/);
  assert.ok(fitOutContract.answer.length > 3500);
  assert.match(fitOutContract.answer, /合同文件之间的优先顺序/);
  assert.doesNotMatch(damagesContract.answer, /四、专业词表|法律基础类/);

  for (const work of works) {
    assert.ok(work.analysis.trim(), `${work.id} should have analysis content`);
    assert.doesNotMatch(work.answer, /^\s*>\s*$/m);
    assert.doesNotMatch([work.analysis, work.answer, work.pitfall, work.tips].join("\n"), /\]\([^\n)]*\.pdf\)/i);
    for (const mindMap of work.mindMaps ?? []) {
      await access(new URL(`../public${mindMap.src}`, import.meta.url));
    }
  }

  for (const work of works.filter((item) => /^s\d+/.test(item.id))) {
    const analysisBody = work.analysis.replace(/^##[^\n]*\n/, "").trim();
    assert.ok(analysisBody.length <= 300, `${work.id} analysis should stay within 300 characters`);
  }

  const mappedWorks = works.filter((work) => work.mindMaps?.length);
  const mapCount = mappedWorks.reduce((total, work) => total + work.mindMaps.length, 0);
  assert.equal(mappedWorks.length, 53);
  assert.equal(mapCount, 66);

  const q3 = works.find((work) => work.id === "q3");
  assert.deepEqual(q3.mindMaps.map(({ src }) => src), ["/mindmaps/q3-03.png", "/mindmaps/q3-04.jpeg"]);
  assert.match(q3.answer, /选择建议：中小企业、低频或集团外数据传输/);

  const q5 = works.find((work) => work.id === "q5");
  assert.match(q5.answer, /PDF原文不上传，读者可自行检索、溯源出处/);

  const q7 = works.find((work) => work.id === "q7");
  assert.equal(q7.supplementalResources[0].title, "《互联网平台反垄断合规指引》批注版");
  assert.match(q7.supplementalResources[0].description, /图文解析/);

  const q9 = works.find((work) => work.id === "q9");
  assert.match(q9.mindMapCorrection.content, /第1196条是反通知原则/);

  const q11 = works.find((work) => work.id === "q11");
  assert.doesNotMatch(q11.answer, /推荐阅读|mp\.weixin\.qq\.com/);
  assert.doesNotMatch(q11.title, /交易-玩家自己行为|公司bug/);
  assert.match(q11.analysis, /审题中的思考路径/);

  const q17 = works.find((work) => work.id === "q17");
  assert.doesNotMatch(q17.answer, /算法专项治理清单指引\.xlsx/);
  assert.match(q17.answer, /关注时效以及是否有新发布的官方指引/);

  const q19 = works.find((work) => work.id === "q19");
  assert.doesNotMatch(q19.answer, /客户身份资料至少保存5年/);
  assert.match(q19.answer, /客户身份资料至少保存10年/);
  assert.match(q19.answer, /思维导图为旧版本需要修改/);

  const q21 = works.find((work) => work.id === "q21");
  assert.match(q21.answer, /1）公有领域数据[^\n]+\n\n2）需获授权的数据/);
  assert.doesNotMatch(q21.tips, /feishu\.cn\/wiki/);
  assert.match(q21.tips, /本题仅作抛砖引玉/);

  const q26 = works.find((work) => work.id === "q26");
  assert.match(q26.analysis, /本题核心是考察候选人对欧盟最新数字与数据立法的敏感度/);
  assert.match(q26.analysis, /建立法规联动视角/);
  assert.doesNotMatch(q26.analysis, /低分选手|高阶选手/);

  const q33 = works.find((work) => work.id === "q33");
  assert.match(q33.answer, /【一句话总结】：产品设计—评估备案—持续审核监控/);

  const q38 = works.find((work) => work.id === "q38");
  assert.match(q38.answer, /\[\[LETTER_START\]\]\n律师函（草稿）/);
  assert.match(q38.answer, /\[\[LETTER_END\]\]/);

  const q4 = works.find((work) => work.id === "q4");
  const response = await render(`/works/${q4.slug}`);
  const html = await response.text();
  assert.match(html, /思维导图/);
  assert.ok(html.includes(q4.mindMaps[0].src));
});
