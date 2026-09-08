import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const sourcePath = path.join(root, "法务面经 副本-编辑版.md");
const outputPath = path.resolve(import.meta.dirname, "../content/works.json");
const glossaryOutputPath = path.resolve(import.meta.dirname, "../content/legal-glossary.json");
const mindmapsPath = path.resolve(import.meta.dirname, "../content/mindmaps.json");
const source = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");
const mindmaps = fs.existsSync(mindmapsPath) ? JSON.parse(fs.readFileSync(mindmapsPath, "utf8")) : {};

const headingPattern = /^(### Q\d+\s+.+|# (?:\*\*)?【(?:补充题目|Day\s*\d+|DAY\s*\d+)】.+)$/gim;
const matches = [...source.matchAll(headingPattern)];

function clean(value = "") {
  return value
    .replace(/\\([.\-+_()])/g, "$1")
    .replace(/\*{1,3}/g, "")
    .replace(/\u200b/g, "")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/^[ \t]*>[ \t]*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanUrl(value = "") {
  return value.replace(/\\([._&-])/g, "$1").replace(/[；，。,.]+$/g, "");
}

function cleanEmbeddedMedia(value = "") {
  return clean(value)
    .replace(/^!\[[^\]]*\]\([^\n)]+\)\s*$/gm, "")
    .replace(/\[([^\]]+?)\]\((?!https?:\/\/)[^\n)]*?\.pdf\)/gi, (_match, label) => {
      const documentTitle = clean(label).replace(/\.pdf$/i, "");
      return `> PDF原文不上传，读者可自行检索、溯源出处：${documentTitle}。`;
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function urlsIn(text) {
  return [...text.matchAll(/https?:\\?\/\\?\/[^\s]+/g)]
    .map((match) => cleanUrl(match[0]))
    .filter(Boolean);
}

const supplementalAnalyses = {
  s01: "先概括两大法系均承认合同自由、要约承诺和损失补偿，再从法律渊源、合同成立、对价、解释方法及违约救济比较差异。最后落到涉外合同实务：大陆法系重视强制性规范与诚信义务，英美法系更依赖精细文本、先例和对价，并结合CISG等规则判断融合趋势。",
  s02: "回答应以风险、成本、效率和交易信用为主线。依次比较汇款、托收、信用证，并补充保理与银行保函：汇款便捷但依赖对手信用，托收成本适中但银行不承担付款责任，信用证安全性较高但费用和单证要求高。最后结合金额、合作历史和资金周转选择方式。",
  s03: "先说明DSA为应对非法内容、算法黑箱和平台系统性风险而建立分级责任体系，再按中介服务、托管服务、在线平台及超大型平台区分义务强度。回答重点依次覆盖通知处置、透明度、广告与推荐系统、未成年人保护、风险评估和审计，并说明欧盟委员会与成员国的执法分工。",
  s04: "按三层路径展开：优先判断目的地是否获得充分性认定；否则选择SCC、BCR等适当保障并完成传输影响评估和补充措施；仅在偶发、必要场景使用第49条例外。企业选择时应结合接收方所在地、集团关系、传输频率、数据敏感度、实施周期和监管成本。",
  s05: "先判断是否属于贸易、合同履行、人力资源等法定豁免，再利用自贸区负面清单筛选数据；不豁免时，根据个人信息规模和敏感程度选择标准合同或认证，涉及重要数据、关基运营者或达到门槛时申报安全评估。云业务还需建立数据盘点、分类分级和持续监测机制。",
  s06: "回答分为触发条件和评估流程。先从主体身份、重要数据及个人信息数量门槛判断是否申报；再说明事前自评估、准备申报材料、主管部门受理评估及结果有效期内持续管理。若包含个人信息，还要同步开展PIA，审查必要性、境外接收方能力和目的地法律环境。",
  s07: "先以可识别性界定个人信息，以泄露或滥用后的严重损害界定敏感个人信息，以对国家安全、经济运行和公共利益的影响界定重要数据。再说明敏感个人信息是个人信息的子集，重要数据与个人信息可能交叉。处理时分别关注单独同意、必要性、影响评估及目录识别、负责人、年度评估和出境审查。",
  s08: "围绕“何时评、怎么评、为何评”回答：先列举敏感个人信息、自动化决策、委托或共同处理、公开、出境等触发场景；再按范围确认、数据映射、风险识别、措施评估、报告审批和持续复核展开流程；最后说明PIA兼具风险预防、责任落实和监管举证价值，报告及记录应依法保存。",
  s09: "以信息流转生命周期审查NDA：先核实主体及单向或双向性质，再明确合作目的、保密信息定义与排除项，限制接触人员和允许披露场景；随后检查保护措施、泄露通知、返还销毁、协议期限与保密期限；最后审查知识产权不转移、禁令及赔偿救济、适用法律和争议解决。",
  s10: "先画出设计服务履约链条：需求与订单、阶段交付、修改变更、验收、付款、知识产权转移、保密和解除。审查时区分主体付款等共性条款与交付形式、修改次数、源文件、验收标准等设计业务特有条款；重点避免需求无限扩张、默认验收失控及付款与权利转移脱节。",
  s11: "沿工程落地顺序审查：主体与施工资质、工程范围、价格和材料、增减项、工期、质量验收、付款保修、违约解除。每一环都要明确责任人、书面确认和证据文件；同时核对消防物业等审批、图纸与工程量清单等附件，以及正文、补充协议、变更单之间的效力顺序。",
  s12: "先区分违约金的事先定价与损害赔偿的事后填补，说明同一损失不得重复受偿，但不同违约行为或损失项目可以并行。起草时再区分立场：甲方扩大触发、保留差额赔偿和其他救济；乙方限定事件、可归责性、损失范围、索赔程序和责任上限，并处理法定限责例外。",
};

function applyEditorialOverrides(work, section) {
  if (work.id === "q3") {
    const supplement = [
      "> #### 其他补充知识：SCC 与 BCR 法务速览",
      "> SCC（标准合同条款）是欧盟委员会预先制定的跨境传输合同工具，主要依据 GDPR 第46条提供适当保障。它适用于集团内外多类主体之间的数据传输，通常无需逐份报监管机构审批；企业选定对应模块、填写传输信息和技术组织措施，并结合场景完成传输影响评估即可。其实施成本较低、周期通常较短，适合中小企业、低频跨境传输及集团外传输，但集团结构复杂时可能需要逐组签署和持续维护多份合同。",
      "> BCR（有约束力的公司规则）是跨国集团内部统一适用的隐私与数据跨境治理规则，主要依据 GDPR 第47条运行，仅适用于同一集团内部。BCR须经主管数据保护机构审批，制度搭建、内部审计和培训成本较高，落地周期通常为12—24个月；优势是一套规则可覆盖集团内部的持续、高频跨境流动，长期管理效率更高。",
      "> 选择建议：中小企业、低频或集团外数据传输一般优先考虑SCC；具有成熟隐私治理能力、且集团内部存在高频大规模跨境流动的大型跨国集团，可评估采用BCR。二者都不能替代数据最小化、安全措施、透明告知及目的地法律风险评估。",
    ].join("\n");
    work.answer = cleanEmbeddedMedia(work.answer.replace(/^intro[：:]\s*/i, "").replace(/\n*> 其他补充知识：[\s\S]*$/m, `\n\n${supplement}`));
    work.mindMaps = work.mindMaps.filter(({ src }) => /q3-0[34]\./.test(src));
  }

  if (work.id === "q5") {
    const supplement = [
      "> #### 其他知识补充",
      "> 若医疗AI训练数据包含个人自行公开或其他合法公开的个人信息，可依据《个人信息保护法》第27条在合理范围内处理，但仍应尊重个人明确拒绝处理的权利；对个人权益有重大影响，尤其涉及医疗健康等敏感个人信息时，仍应取得个人同意并采取严格保护措施。",
      "> 同时，根据《数据安全法》第27条，重要数据处理者应明确数据安全负责人和管理机构。医疗AI产品应设置专门的数据安全岗位，形成定级、审批、访问控制、审计、出境评估和事件响应的闭环责任机制。",
      "> PDF原文不上传，读者可自行检索、溯源出处：《数据安全技术 数据分类分级规则》。",
    ].join("\n");
    work.answer = cleanEmbeddedMedia(work.answer.replace(/\n补充：若[\s\S]*$/m, `\n\n${supplement}`));
  }

  if (work.id === "q6") {
    work.tips = cleanEmbeddedMedia(work.tips.replace(/\n其他知识补充：\s*\n/m, "\n> #### 其他知识补充\n"));
  }

  if (work.id === "q7") {
    const urls = urlsIn(section);
    const xiaohongshuUrls = urls.filter((item) => item.includes("xiaohongshu.com"));
    const officialUrl = urls.find((item) => item.includes("samr.gov.cn"));
    work.tips = cleanEmbeddedMedia(work.tips.replace(/\n《互联网平台反垄断合规指引》加试题：[\s\S]*$/m, ""));
    work.supplementalResources = [{
      title: "《互联网平台反垄断合规指引》批注版",
      description: "图文解析，欢迎👏作补充学习📑",
      url: xiaohongshuUrls[1] || null,
      sourceUrl: officialUrl || null,
    }];
  }

  if (work.id === "q9") {
    work.mindMapCorrection = {
      title: "勘误",
      content: "《民法典》第1195—1197条共同构成网络服务提供者责任规则：第1195条是通知原则，第1196条是反通知原则，第1197条为红旗原则。推荐大家回归原始法条理解。",
    };
  }

  if (work.id === "q11") {
    work.title = work.title.replace(/引发【交易-玩家自己行为；装备丢失-玩家借出账号、公司bug】的纠纷/, "引发的纠纷");
    work.question = work.title;
    work.analysis = cleanEmbeddedMedia(`${work.analysis}\n\n> #### 审题中的思考路径\n> - 账号交易：重点识别玩家自行转让、出租或出借账号等行为，并判断用户协议效力、双方过错及平台是否履行提示说明义务。\n> - 装备丢失：区分玩家主动出借账号、账号被盗等用户侧原因，与系统漏洞、数据异常等公司侧原因，再分别确定举证、恢复数据、赔偿或报案路径。`);
    work.answer = cleanEmbeddedMedia(work.answer
      .replace(/^推荐阅读：[^\n]*(?:\n+)?/m, "")
      .split("\n")
      .filter((line) => !/(?:推荐阅读|后续的延伸链接)/.test(line))
      .join("\n"));
  }

  if (work.id === "q17") {
    work.answer = cleanEmbeddedMedia(work.answer.replace(
      /\[算法专项治理清单指引\.xlsx\]\([^\n)]+\)/,
      "> 读者可以自行检索官方发布的清单，关键词为“算法专项治理清单指引”，关注时效以及是否有新发布的官方指引。",
    ));
  }

  if (work.id === "q19") {
    work.answer = cleanEmbeddedMedia(work.answer
      .replace(/客户身份资料至少保存5年/g, "客户身份资料至少保存10年")
      .concat("\n\n> #### Comment\n> 本题面对的法律法规变化较大，思维导图为旧版本需要修改（例如5000美元、5年等数字有过时风险），建议读者自行检索最新法律法规并运用AI交叉验证。"));
  }

  if (work.id === "q21") {
    const dataCategories = [
      "1）公有领域数据（如已过保护期作品、政府公开数据），可直接使用；",
      "2）需获授权的数据，通过与数据持有方（如图书馆、出版社、内容平台）签订合作协议获取，并尽量采用模块化、场景化授权机制，明确训练用途、商用范围、输出限制及再许可条款；",
      "3）开放许可数据（如采用Creative Commons协议的数据集），需严格遵守署名、非商业使用、相同方式共享等许可证要求；",
      "4）公开网络抓取数据，应建立专门的风险评估机制，对网站Robots协议、平台服务条款、版权声明及“禁止AI训练”标识进行识别，并进行侵权过滤和来源留痕管理。对于来源不明、版权状态不清晰的数据，应原则上避免纳入核心训练语料。",
    ].join("\n\n");
    work.answer = cleanEmbeddedMedia(work.answer.replace(
      /1）公有领域数据[\s\S]*?核心训练语料。/,
      dataCategories,
    ));
    work.tips = cleanEmbeddedMedia(work.tips.replace(
      /- 论文视角：[\s\S]*$/,
      "- 论文视角：读者可以自行检索相关专业论文补充认知，多多益善，本题仅作抛砖引玉。",
    ));
  }

  if (work.id === "q26") {
    work.analysis = cleanEmbeddedMedia([
      "## 考察核心",
      "本题核心是考察候选人对欧盟最新数字与数据立法的敏感度：能否及时识别DMA、《数据法案》等规则的监管重点，并判断其对平台、应用开发者及相关数字业务的直接或间接影响。",
      "## 思路深度拆解",
      "1）先判断监管定位：说明DMA用于解决大型数字平台凭借网络效应、数据优势和生态锁定形成的竞争问题，其监管逻辑由传统的事后执法转向对“守门人”的事前义务约束。",
      "2）再判断适用主体：结合核心平台服务类型、欧盟营业额或市值、终端用户和商业用户规模，以及市场地位是否稳定持续，判断企业是否可能被指定为守门人；同时区分A公司自身受DMA直接监管，还是作为应用开发者受到应用商店规则调整的间接影响。",
      "3）梳理核心义务：围绕禁止自我优待、限制跨服务数据混同与交叉使用、开放第三方支付和分发渠道、保障卸载与默认设置选择、提升互操作性、数据可携带及公平准入等要求形成检查清单。",
      "4）建立法规联动视角：不能只看DMA，还应持续跟踪《数据法案》等欧盟数字与数据规则，以及守门人整改方案、执法决定和应用商店政策变化；涉及个人数据时，还需与GDPR下的同意、目的限制和数据主体权利要求协同判断。",
      "5）落到业务动作：针对某APP在欧盟应用市场的上架、支付跳转、数据授权、账号体系和平台接口，建立规则更新监测、产品改版评估、合同审查、证据留存及跨部门整改机制，并根据新规生效和执法动态持续复核。",
    ].join("\n\n"));
  }

  if (work.id === "q33") {
    work.answer = cleanEmbeddedMedia(work.answer.replace(
      /【一句话总结】：产品设计-评估备案-持续审核监控】?/,
      "【一句话总结】：产品设计—评估备案—持续审核监控",
    ));
  }

  if (work.id === "q38") {
    work.answer = cleanEmbeddedMedia(work.answer
      .replace(/\n律师函（草稿）\n/, "\n[[LETTER_START]]\n律师函（草稿）\n")
      .replace(/\n> If 是律所主体发出：/, "\n[[LETTER_END]]\n\n> 如由律所主体发出："));
  }

  if (!work.analysis && supplementalAnalyses[work.id]) {
    work.analysis = `## 思路深度拆解\n${supplementalAnalyses[work.id]}`;
  }

  return work;
}

function blockBetween(text, startLabels, endLabels) {
  const starts = startLabels.map((label) => text.indexOf(label)).filter((index) => index >= 0);
  if (!starts.length) return "";
  const start = Math.min(...starts);
  const bodyStart = text.indexOf("\n", start) + 1;
  const ends = endLabels
    .map((label) => text.indexOf(label, bodyStart))
    .filter((index) => index >= 0);
  return clean(text.slice(bodyStart, ends.length ? Math.min(...ends) : text.length));
}

function firstParagraph(value) {
  return clean(value.split(/\n\s*\n/).find((part) => clean(part)) || "").replace(/^#+\s*/, "");
}

function categoryFor(title) {
  if (/劳动|竞业/.test(title)) return "劳动用工";
  if (/反垄断|公司治理|ESG/.test(title)) return "公司法与公司治理";
  if (/知识产权|版权|著作权|专利|UGC|避风港|平行进口/.test(title)) return "知识产权";
  if (/诉讼|管辖权异议|刑事|投诉处理|律师函|和解/.test(title)) return "诉讼与争议解决";
  if (/合同|SLA|违约金|损害赔偿|不可抗力|结算|保密协议|NDA|函件起草/.test(title)) return "合同审查";
  if (/数据|个人信息|隐私|GDPR|网络安全|SDK|算法|深度合成|AIGC标识|DMA|DSA|车联网|信息安全/.test(title)) return "数据与隐私";
  if (/游戏|直播|广告|支付|未成年人|内容审核|舆情|MCN|虚拟财产/.test(title)) return "合规与风控";
  return "通用法务能力";
}

const tagDictionary = [
  "民法典", "个人信息保护法", "数据安全法", "网络安全法", "GDPR", "DSA", "DMA",
  "数据出境", "合同审查", "合规", "争议解决", "知识产权", "劳动法", "算法", "AIGC",
  "电子签名", "反垄断", "未成年人保护", "广告法", "跨境", "诉讼", "谈判", "SLA", "NDA"
];

const works = matches.map((match, index) => {
  const rawHeading = match[1];
  const start = match.index;
  const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
  const section = source.slice(start, end);
  const qMatch = rawHeading.match(/^### Q(\d+)\s+(.+)$/i);
  const prefix = qMatch ? `Q${qMatch[1]}` : `S${String(index - 41).padStart(2, "0")}`;
  const title = clean(qMatch ? qMatch[2] : rawHeading.replace(/^#\s+/, "").replace(/^\*\*/, "").replace(/\*\*$/, "").replace(/^【[^】]+】\s*/, ""));
  const difficultyMatch = section.match(/难度指数[：:]\s*(\d+)\s*\/\s*10/);
  const roundMatch = section.match(/常见轮次[：:]\s*([^\n]+)/);
  const url = (labelPattern) => {
    const found = section.match(new RegExp(`${labelPattern}[：:]\\s*(https?:\\/\\/[^\\s]+)`, "i"));
    return found ? cleanUrl(clean(found[1])) : null;
  };
  const core = blockBetween(section, ["【考察核心】"], ["【思路深度拆解】", "【低分踩雷回答】", "【草拟回答】", "【草拟答案】", "【修改答案】"]);
  const thinking = blockBetween(section, ["【思路深度拆解】"], ["【低分踩雷回答】", "【草拟回答】", "【草拟答案】", "【修改答案】"]);
  const answer = blockBetween(section, ["【草拟回答】", "【草拟答案】", "【修改答案】"], ["【加分与避坑】"]);
  const fallbackAnswer = clean(section.replace(rawHeading, "").replace(/小红书链接[：:].*/g, "").replace(/速记(?:图卡|图文)链接[：:].*/g, ""));
  const pitfall = blockBetween(section, ["【低分踩雷回答】"], ["【草拟回答】", "【草拟答案】", "【修改答案】"]);
  const tips = blockBetween(section, ["【加分与避坑】"], ["---"]);
  const searchable = `${title}\n${core}\n${thinking}\n${answer}`;
  const tags = tagDictionary.filter((tag) => searchable.includes(tag)).slice(0, 4);
  const number = qMatch ? Number(qMatch[1]) : index + 1;
  return applyEditorialOverrides({
    id: prefix.toLowerCase(),
    number,
    slug: prefix.toLowerCase(),
    title,
    summary: firstParagraph(core) || `围绕“${title.replace(/[？?]$/, "")}”展开实务分析与回答框架。`,
    category: categoryFor(title),
    tags: tags.length ? tags : [categoryFor(title)],
    difficulty: difficultyMatch ? Number(difficultyMatch[1]) : null,
    interviewRound: roundMatch ? clean(roundMatch[1]) : null,
    question: title,
    analysis: cleanEmbeddedMedia([core && `## 考察核心\n${core}`, thinking && `## 思路深度拆解\n${thinking}`].filter(Boolean).join("\n\n")),
    answer: cleanEmbeddedMedia(answer || fallbackAnswer),
    pitfall: cleanEmbeddedMedia(pitfall),
    tips: cleanEmbeddedMedia(tips),
    xiaohongshuUrl: url("小红书链接"),
    quickNoteUrl: url("速记(?:图卡|图文)链接"),
    sourceDocumentReference: "法务面经 副本-编辑版.docx",
    updatedAt: "2026-09-04",
    featured: [2, 3, 15, 28, 36, 51].includes(number),
    mindMaps: mindmaps[prefix.toLowerCase()] || [],
  }, section);
});

const glossaryWork = works.find((work) => work.id === "s12");
const glossaryMarker = "### 四、专业词表";
const glossaryIndex = glossaryWork?.answer.indexOf(glossaryMarker) ?? -1;
if (!glossaryWork || glossaryIndex < 0) throw new Error("Unable to locate the professional glossary in S12");

const glossarySource = glossaryWork.answer.slice(glossaryIndex + glossaryMarker.length).trim();
glossaryWork.answer = glossaryWork.answer
  .slice(0, glossaryIndex)
  .replace(/\n---\s*$/, "")
  .trim();

const glossaryHeadings = [...glossarySource.matchAll(/^####\s+（[一二三四五六七八九十]+）(.+)$/gm)];
const glossary = {
  title: "法务实务专业词表",
  description: "从题库材料中整理的常用法律、合规、交易、争议解决与技术概念，作为题库外的快速查阅资料。",
  sections: glossaryHeadings.map((heading, index) => {
    const start = heading.index + heading[0].length;
    const end = index + 1 < glossaryHeadings.length ? glossaryHeadings[index + 1].index : glossarySource.length;
    const items = glossarySource.slice(start, end).trim().split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf("：");
        return separator > 0
          ? { term: line.slice(0, separator), definition: line.slice(separator + 1) }
          : { term: line, definition: "" };
      });
    return { title: heading[1].trim(), items };
  }),
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(works, null, 2)}\n`);
fs.writeFileSync(glossaryOutputPath, `${JSON.stringify(glossary, null, 2)}\n`);
console.log(`Generated ${works.length} works at ${outputPath}`);
console.log(`Generated ${glossary.sections.length} glossary sections at ${glossaryOutputPath}`);
