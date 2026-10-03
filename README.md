# YEATS-Teacher｜叶芝英语老师 PC

React/TypeScript 独立工程，沿用认可原型橙黄主题、侧边栏和业务页面结构。只调用 YEATS-Platform 的同一套 /v1/staff 后端，不带数据库或后端副本。

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run dev
```

开发入口 http://127.0.0.1:8931/teacher/ ，Vite 只代理本机8930。构建后由 Platform 本机 API 提供 http://127.0.0.1:8930/teacher/ ，须重启后端一次加载新构建。不得依赖旧总仓库 node_modules。

测试账号安全取得：本机 `%LOCALAPPDATA%/YEATS/secrets/teacher-acceptance.json`。密码不在源码、截图或聊天中。真实老师账号需平台阶段维护。测试账号在非development环境不可登录，已发会话也被禁用。

已实现登录退出、班级/学员/学情、作业定向/多班发布、附件查看、退回重交历史、文字/图片/音频批改、测试维护撤回、补签留痕、共享知识浏览与引用/移除、私密问答、课表与补看状态。平台统一维护知识内容和分类；补看审批仅平台管理员，老师页只读知会。

验收路径：登录 → 作业管理/布置作业 → 家长端提交 → 查看提交/批改 → 退回 → 家长重交 → 提交批改；知识提问从家长端发起，老师“提问答复”处理。请使用标注测试资料。

文件支持受控图片和MP3/WAV音频上传、图片批注、在线播放。Office网页预览服务未接入，非视频可按权限下载；视频无下载入口。PC麦克风录制与本地MP3转码已实现；真实麦克风授权/设备录制及云能力仍待人工验收。

前身 HEltDeng/YEATS 的 apps/teacher-web 仅有阶段说明；本仓库从 phase2 开始实际实现。来源提交 a5a7105ead1084a96d4ece9cbeba32a8d009dc88。
具体实际测试记录与剩余项在 Platform docs/teacher-acceptance.md。当前待用户验收，未发布。

真实浏览器冒烟：先启动本地后端并配置测试老师账号，再 `npm.cmd test`；使用已安装 Chrome，在登录后截图，不输出秘密。该测试不替代完整人工验收。

`npm run test:scope` 使用独立Chrome会话，只读检查班级切换、学情历史、测试筛选、签到统计、知识树与课程知会。需要本机验收凭据和已保留的受控跨端测试记录；不会操作家长小程序，截图输出忽略的 `.artifacts/scope`。完整范围/缺项见Platform的 `docs/teacher-scope-matrix.md`。
