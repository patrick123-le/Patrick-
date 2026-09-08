# Patrick的实务学习手册

中文个人网站，整合个人介绍、经历时间线、法务面试题库、思维导图、来源链接与外部反馈入口。

## 本地运行

环境要求：Node.js `>=22.13.0`、pnpm。

```bash
pnpm install
pnpm run content:build
pnpm run dev
```

浏览器访问 `http://localhost:3000`。

## 校验

```bash
pnpm run lint
pnpm run test
```

`pnpm run test` 会先完成生产构建，再检查首页、题库页和题目详情页的服务端渲染结果。

## 内容与素材

- 完整题库数据：`content/works.json`
- 题库连续编号：`lib/works.ts`
- Word 思维导图提取脚本：`scripts/extract-mindmaps.py`
- 公开个人资料：`content/profile.ts`
- 思维导图及公开图片：`public/`

题库与网页所需的公开内容已经包含在仓库中；原始 Word、PDF、二维码及其他私密材料不在仓库内。

## 部署准备

- 通过 `NEXT_PUBLIC_SITE_URL` 设置正式站点地址；站点地图和 robots 文件会使用该值。
- `public/patrick-study-og.png` 是站点及题目页共用的 Open Graph 分享图。
- 本站不设置留言数据库；反馈统一引导至小红书反馈板或商务邮箱。
- `/admin` 为 `noindex` 占位页，不提供登录或管理数据。
- `.openai/hosting.json` 保留 Sites 托管声明，当前版本无需 D1 或 R2 资源。
