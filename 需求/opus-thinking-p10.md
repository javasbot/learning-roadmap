


# P7→P10 前端架构师三年成长全案（AI时代版）

---

## 一、P10级前端工程师能力模型（对标阿里）

### 1.1 技术深度（权重30%）

| 能力维度 | 具体要求 | 真实工作场景 | P10必备 |
|---------|---------|-------------|---------|
| **前端内核** | 精通V8引擎执行管线、浏览器渲染全链路、编译原理级框架理解 | 主导框架级性能优化，将LCP从3.2s降至0.8s；设计自研渲染引擎解决Canvas万级节点渲染瓶颈 | ✅ |
| **框架源码** | 能从零设计React/Vue级别响应式系统，精通Fiber调度、编译时优化（Svelte/Solid思路） | 自研框架或深度定制框架内核以适配业务场景（如淘宝的Rax、字节的Semi Design底层） | ✅ |
| **全栈深度** | Node.js事件循环底层（libuv）、Rust/Go写高性能工具链、数据库设计与优化 | 主导BFF层架构，设计支撑10万QPS的Node.js网关；用Rust重写构建工具提速10倍 | ✅ |
| **AI应用开发** | LLM原理（Transformer/Attention）、RAG系统设计、Agent架构、多模态应用 | 设计并落地企业级AI Native产品，如智能客服系统、AI辅助编码平台、对话式BI | ✅ |

### 1.2 技术广度（权重15%）

| 能力维度 | 具体要求 | 真实工作场景 |
|---------|---------|-------------|
| **跨端能力** | Flutter/RN原理级理解、WebAssembly、小程序引擎设计 | 统一跨端架构方案，一套代码覆盖5端，减少60%开发成本 |
| **后端与基础设施** | 微服务、消息队列、容器化、CDN架构、数据库选型 | 与后端/SRE协同设计高可用系统，参与全链路压测和容灾方案 |
| **数据能力** | 数据埋点体系、AB实验平台、数据可视化引擎 | 搭建前端数据度量体系，驱动产品决策 |

### 1.3 架构能力（权重25%）

| 能力维度 | 具体要求 | 真实工作场景 | P10必备 |
|---------|---------|-------------|---------|
| **系统架构** | 亿级用户前端架构设计、微前端体系、状态管理架构 | 主导集团级前端基础设施，支撑100+应用、500+开发者协同 | ✅ |
| **工程架构** | Monorepo治理、CI/CD流水线、构建体系、质量保障体系 | 设计从代码提交到灰度发布的全自动化流水线，将发布周期从天级降至分钟级 | ✅ |
| **AI系统架构** | AI应用全栈架构、模型服务化、Prompt管理系统、评估体系 | 设计AI Native应用架构（前端+模型+数据），实现端到端AI功能闭环 | ✅ |
| **演进式架构** | 技术债务治理、渐进式重构、架构度量体系 | 将一个5年历史的巨石应用平滑迁移至微前端架构，零故障 | ✅ |

### 1.4 影响力（权重30%）

| 能力维度 | 具体要求 | 真实工作场景 | P10必备 |
|---------|---------|-------------|---------|
| **技术决策** | 前端技术方向判断、技术选型决策、ROI分析能力 | 决策集团前端技术栈统一方向，影响千人团队技术路线 | ✅ |
| **组织影响** | 技术团队梯队建设、技术文化塑造、跨BU协同 | 建立前端技术委员会，推动跨团队技术标准和最佳实践 | ✅ |
| **行业影响** | 顶会演讲、知名开源项目、技术标准制定 | 在QCon/GMTC做主题演讲，主导的开源项目GitHub Star > 5k | ✅ |
| **商业价值** | 技术方案的商业价值量化、成本意识 | 通过技术方案优化节省千万级服务器成本，或提升核心业务转化率5%+ | ✅ |

---

## 二、3年成长路径（核心路线图）

```
Year 0                Year 1                Year 2                Year 3
  │                     │                     │                     │
  ▼                     ▼                     ▼                     ▼
┌─────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ P7→P7+  │ │    P7+ → P8     │ │    P8 → P9      │ │    P9 → P10     │
│深度筑基  │ │  架构师跃迁     │ │  技术领袖养成    │ │  行业级影响力    │
│AI启蒙   │ │  AI应用实战     │ │  AI系统架构     │ │  AI Native架构   │
└─────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

### 阶段1：深度筑基 + AI启蒙（0-6个月）

**核心目标**：补齐P8硬性技术短板，建立AI认知框架

#### 学习主题

| 月份 | 主题 | 核心技术 | 每周投入 |
|-----|------|---------|---------|
| M1 | 浏览器与JS引擎深度 | V8 Pipeline、Event Loop底层、内存管理、GC算法 | 20h |
| M2 | React/Vue源码精读 | Fiber架构、调度器(Scheduler)、Diff算法、响应式原理(Proxy) | 20h |
| M3 | 构建工具与编译原理 | Webpack/Vite/Rspack原理、AST操控、Babel插件开发、Rust基础 | 20h |
| M4 | Node.js深度 + 数据库 | libuv、Stream、Cluster、PostgreSQL/Redis设计模式 | 20h |
| M5 | AI基础：LLM原理 | Transformer架构、Attention机制、Tokenization、Prompt Engineering | 20h |
| M6 | AI应用开发入门 | LangChain/LlamaIndex、RAG基础、向量数据库、OpenAI API | 20h |

#### 项目实践

| 项目 | 描述 | 产出 |
|-----|------|------|
| **手写Mini React** | 实现Fiber架构、Hooks系统、Diff算法、并发模式 | GitHub开源 + 技术博客3篇 |
| **手写Mini Vite** | 实现ESM Dev Server、HMR、Plugin系统 | GitHub开源 + 技术博客2篇 |
| **AI Chat应用** | 基于LLM API构建流式对话应用，含Prompt管理 | 完整应用 + 架构设计文档 |

#### 阶段产出（硬性要求）

- [ ] 技术博客：12篇深度文章（每两周一篇）
- [ ] 开源项目：2个Mini实现项目
- [ ] 源码笔记：React 18 / Vue 3 完整源码阅读笔记
- [ ] AI认知：能独立开发基础LLM应用
- [ ] LeetCode：完成150题（中等+困难，侧重树/图/DP）

---

### 阶段2：架构师跃迁 + AI应用实战（6-12个月）

**核心目标**：具备独立架构设计能力，能设计AI Native前端应用

#### 学习主题

| 月份 | 主题 | 核心技术 | 每周投入 |
|-----|------|---------|---------|
| M7 | 微前端架构 | qiankun/Module Federation/Wujie原理、沙箱机制、CSS隔离 | 20h |
| M8 | 性能工程化 | Core Web Vitals深度优化、渲染性能、网络优化、SSR/ISR/RSC | 20h |
| M9 | 分布式系统基础 | CAP理论、一致性协议、消息队列、微服务通信 | 20h |
| M10 | AI Agent开发 | Agent架构(ReAct/Plan-Execute)、Tool Calling、Memory系统 | 20h |
| M11 | AI Native前端 | 流式UI渲染、Agent UI设计模式、实时协同、AI组件库 | 20h |
| M12 | 系统设计方法论 | 高可用/高并发系统设计、技术方案评审方法 | 20h |

#### 项目实践

| 项目 | 描述 | 产出 |
|-----|------|------|
| **企业级微前端平台** | 设计支撑10+子应用的微前端架构 | 架构设计文档 + 核心代码实现 |
| **AI Agent平台前端** | 可视化Agent编排 + 流式对话UI + 工具调用可视化 | 完整系统 + 技术演讲PPT |
| **性能优化专项** | 在实际业务中完成一次完整的性能优化（量化结果） | 优化报告（含数据对比） |

#### 阶段产出

- [ ] 技术方案：3份完整架构设计文档（含评审记录）
- [ ] 技术演讲：2次团队/公司内技术分享
- [ ] 开源贡献：为知名开源项目提交PR（至少3个被合并）
- [ ] AI能力：能独立设计并实现AI Agent应用
- [ ] LeetCode：累计300题

---

### 阶段3：技术领袖养成（1-2年）

**核心目标**：从"做事"转向"做局"——技术规划、团队影响、领域专精

#### 第三季度（M13-M15）：技术规划能力

| 主题 | 核心内容 |
|------|---------|
| 技术战略规划 | 年度技术规划制定方法、ROI分析、OKR拆解 |
| 前端基础设施设计 | CLI工具链、组件库架构（Design Token体系）、文档系统 |
| 全栈架构深化 | GraphQL网关、BFF架构、Serverless架构设计 |

#### 第四季度（M16-M18）：AI系统架构

| 主题 | 核心内容 |
|------|---------|
| RAG系统工程化 | 检索策略、文档处理Pipeline、评估体系（RAGAS） |
| 多模态AI应用 | Vision-Language模型应用、语音交互、实时视频AI |
| AI工程化 | Prompt管理平台、模型评估框架、A/B测试 |

#### 第五季度（M19-M21）：领域专精 + 开源

| 主题 | 核心内容 |
|------|---------|
| 领域专精（选一） | 智能化中后台 / AI Native编辑器 / 数据可视化引擎 / 跨端框架 |
| 开源项目主导 | 从0到1主导一个有影响力的开源项目 |
| 技术写作深化 | 体系化技术专栏（20篇+成系列） |

#### 第六季度（M22-M24）：组织影响力

| 主题 | 核心内容 |
|------|---------|
| 技术团队建设 | 前端技术委员会运营、Code Review文化、技术晋升辅导 |
| 跨团队协同 | 前后端一体化方案推进、与产品/设计的协作模型 |
| 行业输出 | 技术会议演讲、技术播客/视频 |

#### 阶段产出

- [ ] **一个有影响力的开源项目**（Star > 1k）
- [ ] **技术专栏**：20篇以上体系化文章，形成个人技术品牌
- [ ] **技术演讲**：至少1次外部技术会议演讲（GMTC/QCon/D2等）
- [ ] **团队建设**：培养2-3名P6→P7工程师
- [ ] **技术方案**：5份以上架构设计文档，含业务结果量化
- [ ] **AI系统**：独立设计并落地一个生产级AI应用系统

---

### 阶段4：行业级影响力（2-3年）

**核心目标**：技术视野对标行业Top，具备定义技术方向的能力

#### M25-M30：技术纵深突破

| 方向 | 具体内容 |
|------|---------|
| **自研框架/引擎** | 基于业务场景设计领域特定框架（DSL/渲染引擎/编译器） |
| **AI Native架构体系** | 设计企业级AI应用架构标准，含前端+模型+数据全链路 |
| **技术标准制定** | 参与W3C/TC39提案，或制定企业级技术规范 |

#### M31-M36：影响力变现

| 方向 | 具体内容 |
|------|---------|
| **行业影响力** | 顶级技术会议Keynote、技术书籍出版、知名技术社区活跃 |
| **商业价值证明** | 技术方案驱动核心业务指标提升（GMV/用户增长/成本节约） |
| **技术决策能力** | 能为千人级技术团队做技术栈决策并承担结果 |

#### 阶段产出

- [ ] **开源项目** Star > 5k 或成为知名项目Core Maintainer
- [ ] **顶级技术会议**演讲 2次以上
- [ ] **技术书籍**或等价影响力的技术输出
- [ ] **可量化的商业价值**贡献
- [ ] **至少影响100人以上的工程师**成长

---

## 三、每日学习计划

> **前提假设**：工作日可投入学习时间约4-5小时（早晚+通勤），周末可投入8-10小时
> 以下为**阶段1（0-6个月）** 的典型每日计划，后续阶段按同样密度调整内容

### 工作日计划（周一至周五）

```
┌─────────────────────────────────────────────────────────────────────┐
│                        工作日学习日程                                │
├──────────────┬──────────────────────┬──────────┬─────────┬─────────┤
│    时间段     │       学习内容       │  技能点   │ 重要性  │  类型   │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 06:30-07:00  │ 晨间复习：Anki卡片   │ 知识巩固  │  10%   │  基础   │
│              │ （前日知识点复习）    │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 07:00-08:00  │ LeetCode 1-2题      │ 算法能力  │  15%   │  基础   │
│              │ （中等/困难交替）     │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 08:00-09:00  │ 通勤：技术播客/      │ 技术视野  │  5%    │  广度   │
│              │ 音频课程             │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 12:00-13:00  │ 午休：源码阅读       │ 框架深度  │  20%   │  基础   │
│              │ （React/Vue/Node）   │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 18:00-19:00  │ 通勤：AI论文/技术    │ AI认知   │  10%   │  AI     │
│              │ 文章精读             │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 21:00-23:00  │ 项目实践（手写框架/  │ 工程实践  │  25%   │ 架构    │
│              │ AI应用开发）         │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 23:00-23:30  │ 技术日记 + 知识整理  │ 输出能力  │  15%   │  影响力 │
│              │ （博客素材积累）     │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│              │           合计：约5.5小时/天                        │
└──────────────┴──────────────────────┴──────────┴─────────┴─────────┘
```

### 周末计划（周六/周日各一天）

```
┌─────────────────────────────────────────────────────────────────────┐
│                        周末学习日程                                  │
├──────────────┬──────────────────────┬──────────┬─────────┬─────────┤
│    时间段     │       学习内容       │  技能点   │ 重要性  │  类型   │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 08:00-10:00  │ 深度主题学习         │ 核心技术  │  25%   │  基础   │
│              │ （如V8引擎/编译原理）│          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 10:00-10:30  │ 休息 + 散步          │ 恢复     │   -    │   -     │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 10:30-12:30  │ 项目实战             │ 架构实践  │  25%   │  架构   │
│              │ （开源项目开发）     │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 14:00-16:00  │ AI技术学习           │ AI能力   │  20%   │  AI     │
│              │ （LLM/Agent/RAG）   │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 16:00-16:30  │ 休息                │ 恢复     │   -    │   -     │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 16:30-18:00  │ 系统设计练习         │ 架构能力  │  15%   │  架构   │
│              │ （画架构图+写文档）  │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│ 20:00-22:00  │ 技术写作             │ 影响力   │  15%   │  影响力 │
│              │ （技术博客/文章）    │          │         │         │
├──────────────┼──────────────────────┼──────────┼─────────┼─────────┤
│              │           合计：约9小时/天                           │
└──────────────┴──────────────────────┴──────────┴─────────┴─────────┘
```

### 每周总时间分配

| 类型 | 工作日（5天） | 周末（2天） | 周合计 | 占比 |
|------|-------------|------------|--------|------|
| 基础能力 | 12.5h | 4h | 16.5h | 40% |
| 架构能力 | 10h | 5h | 15h | 36% |
| AI能力 | 5h | 4h | 9h | 22% |
| 影响力输出 | 2.5h | 4h | 6.5h | （叠加在以上类别中） |
| **总计** | **27.5h** | **18h** | **~45h/周** | 100% |

### 各阶段每日计划差异

| 时段 | 阶段1(0-6月) | 阶段2(6-12月) | 阶段3(1-2年) | 阶段4(2-3年) |
|------|-------------|--------------|-------------|-------------|
| 早间 | 算法刷题 | 系统设计练习 | 技术规划思考 | 行业趋势研究 |
| 午间 | 源码阅读 | 架构论文精读 | 开源项目维护 | 技术写作/书稿 |
| 晚间 | 手写实现项目 | AI应用开发 | AI系统架构设计 | 技术演讲准备 |
| 周末 | 深度学习+博客 | 系统设计+AI | 开源+演讲 | 战略+影响力 |

---

## 四、核心技能树（带权重）

```
P10前端架构师技能树（总权重 = 100%）
│
├── 🔵 前端核心深度（25%）  [P10必须] [阶段1-2优先]
│   ├── 浏览器原理（6%）      → V8、渲染Pipeline、网络栈
│   ├── 框架原理与设计（7%）   → React/Vue/Solid底层、自研能力
│   ├── 工程化体系（6%）      → 构建工具链、Monorepo、CI/CD
│   └── 性能工程（6%）        → Core Web Vitals、运行时优化、SSR
│
├── 🟢 架构设计能力（20%）  [P10必须] [阶段2-3优先]
│   ├── 系统架构设计（8%）    → 高可用、高并发、分布式
│   ├── 微前端架构（4%）      → 沙箱、通信、部署策略
│   ├── 数据架构（4%）        → 状态管理、数据流、离线优先
│   └── 演进式架构（4%）      → 技术债务、渐进迁移、度量
│
├── 🟠 AI Native能力（25%）  [P10必须] [全阶段渐进]
│   ├── LLM原理理解（5%）     → Transformer、训练、推理优化
│   ├── AI应用开发（8%）      → RAG、Agent、多模态应用
│   ├── AI前端架构（7%）      → 流式UI、Agent UI、AI组件库
│   └── AI工程化（5%）        → 评估体系、Prompt管理、MLOps
│
├── 🟣 全栈能力（15%）  [P10必须] [阶段1-2]
│   ├── Node.js深度（5%）     → 底层原理、高性能服务
│   ├── 后端基础设施（4%）    → 数据库、消息队列、缓存
│   ├── API设计（3%）         → GraphQL、gRPC、RESTful设计
│   └── DevOps（3%）          → 容器化、K8s基础、监控告警
│
├── 🔴 影响力与领导力（15%）  [P10必须] [阶段3-4优先]
│   ├── 技术决策（4%）        → 选型方法论、ROI分析
│   ├── 技术输出（4%）        → 演讲、写作、开源
│   ├── 团队建设（4%）        → 梯队培养、文化塑造
│   └── 商业意识（3%）        → 业务理解、价值量化
│
└── 总计：100%
```

### 学习顺序优先级

```
阶段1 ──→ 前端核心深度 > 全栈能力 > AI基础
阶段2 ──→ 架构设计 > AI应用开发 > 性能工程
阶段3 ──→ AI系统架构 > 影响力输出 > 领域专精
阶段4 ──→ 技术决策 > 行业影响力 > AI Native架构
```

---

## 五、P10级面试题体系

### 5.1 手写代码题（高级）

#### 题目1：实现完整的Mini React（Fiber架构）

```javascript
// ====== 要求实现：Fiber架构的React核心 ======

// 1. createElement - 创建虚拟DOM
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: { nodeValue: text, children: [] },
  };
}

// 2. Fiber节点结构
// { type, props, dom, parent, child, sibling, alternate, effectTag }

// 3. 核心调度器 - 可中断渲染
let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null;
let wipFiber = null;
let hookIndex = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 4. 执行单个工作单元
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 返回下一个工作单元：child → sibling → uncle
  if (fiber.child) return fiber.child;
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

// 5. 函数组件处理（支持Hooks）
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

// 6. useState实现
function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action instanceof Function ? action(hook.state) : action;
  });

  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

// 7. Diff算法（Reconciliation）
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      // UPDATE
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    if (element && !sameType) {
      // PLACEMENT
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !sameType) {
      // DELETION
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) oldFiber = oldFiber.sibling;
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}

// 8. Commit阶段
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}
```

**面试追问点**：
- 为什么用`requestIdleCallback`而不是`setTimeout`？React 18实际用的是什么？
- Fiber链表遍历为什么是child→sibling→uncle？与树的DFS有什么关系？
- 并发模式下如何处理高优先级更新打断低优先级更新？
- 如何实现useEffect？cleanup函数的执行时机？

---

#### 题目2：实现Promise/A+规范（完整版）

```javascript
class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.status = MyPromise.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r; };

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      if (this.status === MyPromise.FULFILLED) {
        fulfilledMicrotask();
      } else if (this.status === MyPromise.REJECTED) {
        rejectedMicrotask();
      } else {
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });

    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected'));
    }
    if (x instanceof MyPromise) {
      x.then(resolve, reject);
    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false;
      try {
        const then = x.then;
        if (typeof then === 'function') {
          then.call(x,
            y => { if (!called) { called = true; this.resolvePromise(promise2, y, resolve, reject); } },
            r => { if (!called) { called = true; reject(r); } }
          );
        } else {
          resolve(x);
        }
      } catch (e) {
        if (!called) { called = true; reject(e); }
      }
    } else {
      resolve(x);
    }
  }

  // 静态方法
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;
      if (promises.length === 0) return resolve([]);
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(val => {
          results[i] = val;
          if (++count === promises.length) resolve(results);
        }, reject);
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => MyPromise.resolve(p).then(resolve, reject));
    });
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason; })
    );
  }
}
```

---

#### 题目3：实现并发控制调度器

```javascript
class ConcurrencyScheduler {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._run();
    });
  }

  _run() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;
      task()
        .then(resolve, reject)
        .finally(() => {
          this.running--;
          this._run();
        });
    }
  }
}

// 使用示例
const scheduler = new ConcurrencyScheduler(2);
const timeout = (time) => new Promise(r => setTimeout(r, time));

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
// 输出顺序：2, 3, 1, 4
```

---

#### 题目4：手写EventEmitter（支持once + 异步）

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push({ listener, once: false });
    return this; // 链式调用
  }

  once(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push({ listener, once: true });
    return this;
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    const listeners = this.events.get(event);
    const remaining = [];
    for (const entry of listeners) {
      entry.listener.apply(this, args);
      if (!entry.once) remaining.push(entry);
    }
    if (remaining.length) {
      this.events.set(event, remaining);
    } else {
      this.events.delete(event);
    }
    return true;
  }

  off(event, listener) {
    if (!this.events.has(event)) return this;
    if (!listener) {
      this.events.delete(event);
    } else {
      const filtered = this.events.get(event).filter(e => e.listener !== listener);
      if (filtered.length) {
        this.events.set(event, filtered);
      } else {
        this.events.delete(event);
      }
    }
    return this;
  }

  // 等待事件（Promise化）
  waitFor(event, timeout = 0) {
    return new Promise((resolve, reject) => {
      let timer;
      if (timeout > 0) {
        timer = setTimeout(() => {
          this.off(event, handler);
          reject(new Error(`Timeout waiting for event: ${event}`));
        }, timeout);
      }
      const handler = (...args) => {
        clearTimeout(timer);
        resolve(args);
      };
      this.once(event, handler);
    });
  }
}
```

---

#### 题目5：实现响应式系统（Vue 3 Reactivity核心）

```javascript
// 依赖收集
let activeEffect = null;
const effectStack = [];
const targetMap = new WeakMap();

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const result = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return result;
  };

  effectFn.deps = [];
  effectFn.options = options;

  if (!options.lazy) {
    effectFn();
  }

  return effectFn;
}

function cleanup(effectFn) {
  for (const dep of effectFn.deps) {
    dep.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  if (!effects) return;
  const effectsToRun = new Set();
  effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn);
    }
  });
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

// reactive
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key);
      const result = Reflect.get(target, key, receiver);
      if (typeof result === 'object' && result !== null) {
        return reactive(result); // 深层响应
      }
      return result;
    },
    set(target, key, newVal, receiver) {
      const oldVal = target[key];
      const result = Reflect.set(target, key, newVal, receiver);
      if (oldVal !== newVal) {
        trigger(target, key);
      }
      return result;
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const result = Reflect.deleteProperty(target, key);
      if (hadKey && result) {
        trigger(target, key);
      }
      return result;
    }
  });
}

// computed
function computed(getter) {
  let value;
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(obj, 'value');
      }
    }
  });

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, 'value');
      return value;
    }
  };

  return obj;
}
```

---

### 5.2 架构设计题

#### 题目1：设计一个支撑1亿DAU的电商前端架构

**考察点**：全链路思维、性能极限优化、容灾能力

**参考答架构思路**：

```
                    ┌──────────────────┐
                    │    CDN + Edge    │  ← 静态资源 + Edge SSR
                    │   Computing     │
                    └───────┬──────────┘
                            │
                    ┌───────▼──────────┐
                    │   API Gateway    │  ← 限流/熔断/灰度
                    │   (Nginx/Kong)   │
                    └───────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
     ┌────────▼───┐  ┌─────▼─────┐ ┌─────▼─────┐
     │  BFF层     │  │ SSR/RSC   │ │  实时服务   │
     │ (Node.js)  │  │  服务器    │ │ (WebSocket)│
     └────────┬───┘  └─────┬─────┘ └─────┬─────┘
              │             │             │
     ┌────────▼─────────────▼─────────────▼─────┐
     │            微前端容器层                     │
     │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
     │  │首页  │ │商品  │ │订单  │ │支付  │  ...   │
     │  │子应用│ │子应用│ │子应用│ │子应用│        │
     │  └─────┘ └─────┘ └─────┘ └─────┘        │
     └──────────────────────────────────────────┘
              │
     ┌────────▼────────────────┐
     │    前端基础设施层         │
     │  监控 / 埋点 / AB实验    │
     │  性能采集 / 错误上报     │
     │  离线包 / 预加载 / SW    │
     └─────────────────────────┘
```

**关键设计点（面试需要展开讲）**：

1. **首屏性能**：Edge SSR + Streaming HTML + Selective Hydration
2. **微前端**：基于Module Federation的子应用动态加载，共享依赖
3. **容灾**：静态兜底页 + 服务端降级 + 离线包
4. **灰度发布**：基于Feature Flag的流量分配
5. **监控**：全链路Trace（从CDN到API到渲染完成）
6. **性能预算**：JS < 200KB gzip，LCP < 1.5s，FID < 50ms

---

#### 题目2：设计一个AI Agent平台的前端架构

```
┌──────────────────────────────────────────────┐
│                  用户界面层                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ 对话界面  │ │ Agent编排 │ │ 知识库管理    │  │
│  │(流式渲染) │ │(可视化)   │ │(RAG配置)     │  │
│  └──────────┘ └──────────┘ └──────────────┘  │
├──────────────────────────────────────────────┤
│                  AI交互层                     │
│  ┌────────────────────────────────────────┐  │
│  │  流式响应引擎 (SSE/WebSocket)           │  │
│  │  ├── Token级流式渲染                    │  │
│  │  ├── Markdown实时解析+高亮              │  │
│  │  ├── 代码块实时渲染+执行                │  │
│  │  └── 工具调用可视化(Tool Calling UI)    │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│                  状态管理层                    │
│  ┌────────────────────────────────────────┐  │
│  │  对话状态机 (XState)                    │  │
│  │  ├── idle → streaming → tool_calling   │  │
│  │  ├── → thinking → responding → done    │  │
│  │  └── 多轮对话Context管理               │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│                  基础设施层                    │
│  Prompt模板管理 | 模型切换 | 评估Dashboard   │
│  Token用量统计 | 会话持久化 | 协同编辑        │
└──────────────────────────────────────────────┘
```

**流式渲染核心实现**：

```javascript
// 流式渲染引擎核心
class StreamRenderer {
  constructor(container) {
    this.container = container;
    this.buffer = '';
    this.parser = new IncrementalMarkdownParser();
    this.rafId = null;
  }

  async connectStream(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      this.buffer += chunk;
      this.scheduleRender();
    }

    this.flush();
  }

  scheduleRender() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.render();
    });
  }

  render() {
    const ast = this.parser.parse(this.buffer);
    const html = this.parser.toHTML(ast);
    // 使用DOM diff最小化更新
    morphdom(this.container, `<div>${html}</div>`, {
      onBeforeElUpdated: (fromEl, toEl) => {
        // 保留用户交互状态
        if (fromEl.isEqualNode(toEl)) return false;
        return true;
      }
    });
    this.autoScroll();
  }

  autoScroll() {
    const { scrollHeight, clientHeight, scrollTop } = this.container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    if (isNearBottom) {
      this.container.scrollTop = scrollHeight;
    }
  }
}
```

---

#### 题目3：设计微前端架构（支撑100+子应用）

**面试回答结构**：

1. **为什么要微前端**：业务拆分、技术栈异构、独立部署、团队自治
2. **技术选型对比**：iframe vs qiankun vs Module Federation vs Wujie
3. **沙箱方案**：JS沙箱（Proxy）+ CSS沙箱（Shadow DOM / Scoped CSS）
4. **通信机制**：CustomEvent + 共享状态（发布订阅）
5. **部署策略**：独立打包、独立CI/CD、版本管理
6. **性能优化**：预加载、共享依赖、按需加载
7. **监控体系**：子应用级别错误隔离与上报

---

### 5.3 AI相关题

#### 题目1：如何设计一个AI Agent UI？

**参考回答框架**：

```
状态维度分析：
1. Agent执行状态：thinking → planning → executing → observing → responding
2. 每个状态需要不同的UI反馈：
   - thinking：加载动画 + "正在思考..."
   - planning：展示思维链（Chain of Thought）
   - executing：展示工具调用（API/搜索/代码执行）及实时结果
   - observing：展示中间结果 + 判断逻辑
   - responding：流式文本渲染

技术方案：
- 状态管理：使用有限状态机（XState）管理Agent生命周期
- 流式通信：SSE用于单向流，WebSocket用于双向交互
- 渲染策略：虚拟滚动 + 增量DOM更新 + requestAnimationFrame节流
- 工具调用UI：卡片式展示，支持折叠/展开/重试
- 多模态：文本/图片/代码/图表统一渲染管线

关键挑战：
- 长对话性能（虚拟滚动 + 对话分页加载）
- 工具调用的异步状态管理（并行/串行/条件分支）
- 错误恢复与重试机制
- 流式中断与取消（AbortController）
```

#### 题目2：如何处理LLM流式渲染的性能问题？

```
核心挑战：
1. 高频DOM更新（每个token触发一次）
2. Markdown实时解析（不完整语法处理）
3. 代码高亮实时计算
4. 自动滚动性能

解决方案：
1. 批量更新：requestAnimationFrame合并多个token的DOM操作
2. 增量解析：使用增量Markdown解析器（只解析新增部分）
3. 延迟高亮：代码块完成后再做语法高亮，流式过程用纯文本
4. CSS contain: 使用contain: content隔离重排范围
5. 虚拟滚动：长对话使用虚拟列表
6. Web Worker：将Markdown解析和高亮放到Worker中
```

#### 题目3：设计一个企业级RAG系统的前端架构

```
需求分析：
- 知识库管理（文档上传/分类/权限）
- 对话界面（引用溯源/相关度展示）
- 管理后台（检索效果评估/Prompt调优）

前端架构要点：
1. 文档处理：
   - 大文件分块上传（Resumable Upload）
   - 文档预览（PDF/Word/Excel在线查看）
   - 分块可视化（Chunk预览 + 向量距离展示）

2. 对话界面：
   - 引用标注（行内引用 + 侧边栏原文展示）
   - 置信度可视化（颜色编码/进度条）
   - 反馈收集（点赞/修正/标注）

3. 评估Dashboard：
   - 检索质量指标（Recall/Precision/MRR）
   - A/B对比（不同策略效果对比）
   - 实时监控（响应时间/Token消耗/错误率）
```

#### 题目4：如何用前端技术优化LLM应用的用户体验？

```
1. 感知性能优化：
   - 打字机效果（逐字/逐词渲染，可配速度）
   - 骨架屏预填充（预测回复长度）
   - 乐观UI（发送后立即展示用户消息）

2. 交互设计：
   - 停止生成按钮（AbortController）
   - 重新生成（保留上下文重新请求）
   - 编辑已发送消息（fork对话分支）
   - 快捷Prompt（模板选择/历史搜索）

3. 上下文管理：
   - 对话历史压缩（前端侧token计数提醒）
   - 系统提示词管理（角色/温度/格式预设）

4. 离线体验：
   - Service Worker缓存对话历史
   - IndexedDB存储长对话
   - 网络恢复自动重连

5. 可访问性：
   - 屏幕阅读器支持（aria-live regions）
   - 键盘导航
   - 高对比度模式
```

---

### 5.4 算法题（P10级别重点）

#### 系统设计类算法

```javascript
// 1. 实现LRU Cache（O(1) get/put）
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      this.map.delete(this.map.keys().next().value);
    }
  }
}

// 2. 实现Virtual List核心（万级列表渲染）
class VirtualList {
  constructor({ container, itemHeight, totalCount, renderItem }) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalCount = totalCount;
    this.renderItem = renderItem;
    this.scrollTop = 0;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;

    this.phantom = document.createElement('div');
    this.phantom.style.height = `${totalCount * itemHeight}px`;
    this.content = document.createElement('div');

    container.appendChild(this.phantom);
    container.appendChild(this.content);
    container.style.position = 'relative';
    container.style.overflow = 'auto';
    this.content.style.position = 'absolute';
    this.content.style.top = '0';
    this.content.style.width = '100%';

    container.addEventListener('scroll', this.onScroll.bind(this));
    this.render();
  }

  onScroll() {
    this.scrollTop = this.container.scrollTop;
    requestAnimationFrame(() => this.render());
  }

  render() {
    const startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - 1);
    const endIndex = Math.min(this.totalCount, startIndex + this.visibleCount + 2);

    this.content.style.transform = `translateY(${startIndex * this.itemHeight}px)`;

    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.renderItem(i);
      item.style.height = `${this.itemHeight}px`;
      fragment.appendChild(item);
    }

    this.content.innerHTML = '';
    this.content.appendChild(fragment);
  }
}

// 3. 深度克隆（处理循环引用 + 特殊类型）
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map) {
    const result = new Map();
    map.set(obj, result);
    obj.forEach((val, key) => result.set(deepClone(key, map), deepClone(val, map)));
    return result;
  }
  if (obj instanceof Set) {
    const result = new Set();
    map.set(obj, result);
    obj.forEach(val => result.add(deepClone(val, map)));
    return result;
  }
  if (map.has(obj)) return map.get(obj);

  const result = Array.isArray(obj) ? [] : {};
  map.set(obj, result);

  for (const key of Reflect.ownKeys(obj)) {
    result[key] = deepClone(obj[key], map);
  }
  return result;
}
```

---

## 六、AI时代动态调整策略

### 6.1 前端是否会被AI替代？

**结论：不会被替代，但会被深度重构**

```
前端工程的演进路径：

2024 ────── 2025 ────── 2026 ────── 2027
  │           │           │           │
  ▼           ▼           ▼           ▼
AI辅助编码   AI生成UI    AI设计系统   AI Native
(Copilot)   (v0/bolt)   (自动化)    (全自动)

前端工程师角色变化：
  代码编写者 → 系统设计者 → AI系统架构师 → 人机交互设计者
```

### 6.2 技能演进预测

| 技能 | 2024状态 | 2027预测 | 变化 | 应对策略 |
|------|---------|---------|------|---------|
| HTML/CSS手写 | 核心技能 | AI自动生成 | 🔻 减弱 | 转向Design Token系统设计 |
| React/Vue开发 | 核心技能 | AI辅助大部分 | 🔻 减弱 | 转向框架设计和架构层 |
| 组件库开发 | 重要技能 | AI可生成80% | 🔻 减弱 | 转向AI组件设计系统 |
| 架构设计 | 高级技能 | 更加重要 | 🔺 增强 | 核心不可替代能力 |
| 性能优化 | 重要技能 | 场景化AI辅助 | ➡️ 变化 | 转向系统级优化 |
| AI应用开发 | 新兴技能 | 核心必备 | 🔺🔺 大增 | 立即投入学习 |
| Prompt Engineering | 新兴技能 | 基础技能 | 🔺 增强 | 纳入日常工具 |
| Agent架构设计 | 前沿技能 | 核心技能 | 🔺🔺 大增 | 深度学习 |
| 全栈能力 | 加分项 | 必备能力 | 🔺 增强 | AI降低全栈门槛 |
| 系统设计 | 高级技能 | 最核心能力 | 🔺🔺 大增 | P10决定性技能 |

### 6.3 技术演进路径图

```
2024 Q1-Q4: AI辅助开发时代
├── Copilot/Cursor成为标配
├── AI生成UI原型（v0, bolt.new）
├── 前端开始学习LLM API调用
└── 框架开始集成AI能力（Next.js AI SDK）

2025 Q1-Q4: AI增强开发时代
├── AI Agent辅助前端全流程（设计→代码→测试→部署）
├── 自然语言编程初步可用
├── AI Native组件库出现
├── 前端工程师开始设计AI交互范式
└── RAG/Agent应用成为主流前端场景

2026 Q1-Q4: AI Native开发时代
├── 80%的常规UI代码由AI生成
├── 前端工程师核心工作转向架构设计 + AI系统设计
├── 新的"人机交互工程师"角色出现
├── 多模态交互成为前端新战场
└── 边缘AI + 端侧模型改变前端架构

2027 Q1-Q4: 人机协同时代
├── AI与前端完全融合
├── 前端工程 ≈ 人机交互系统工程
├── 传统"前端"边界消失
├── 核心能力：系统架构 + AI架构 + 交互设计
└── P10级别 = AI系统架构师
```

### 6.4 应对策略（可执行）

```
立即行动（0-3个月）：
├── 将AI工具融入日常开发（Cursor/Copilot作为主力IDE）
├── 学习OpenAI API / Claude API基本使用
├── 完成1个AI Chat应用开发
└── 阅读《Prompt Engineering Guide》

短期调整（3-12个月）：
├── 深入学习Agent/RAG开发
├── 掌握流式UI渲染技术
├── 学习Transformer基础原理
├── 实践至少1个AI Native应用
└── 开始用AI辅助技术写作

中期转型（1-2年）：
├── 建立AI应用架构能力
├── 主导1个AI Native产品前端
├── 学习模型微调和评估基础
├── 成为团队AI技术布道者
└── 在技术社区输出AI+前端内容

长期定位（2-3年）：
├── 成为AI Native系统架构师
├── 具备前端+AI+后端全链路设计能力
├── 定义新一代人机交互范式
└── 行业影响力覆盖AI+前端交叉领域
```

---

## 七、权威学习资料

### 7.1 前端核心（优先级排序）

| 序号 | 资料 | 类型 | 优先级 | 对应阶段 |
|------|------|------|--------|---------|
| 1 | [React 官方文档 (react.dev)](https://react.dev) | 官方文档 | ⭐⭐⭐⭐⭐ | 阶段1 |
| 2 | [Vue.js 设计与实现 - 霍春阳](https://book.douban.com/subject/35768338/) | 书籍 | ⭐⭐⭐⭐⭐ | 阶段1 |
| 3 | [React 源码 (github.com/facebook/react)](https://github.com/facebook/react) | 源码 | ⭐⭐⭐⭐⭐ | 阶段1 |
| 4 | [V8 Blog (v8.dev/blog)](https://v8.dev/blog) | 官方博客 | ⭐⭐⭐⭐ | 阶段1 |
| 5 | [Web.dev (Google)](https://web.dev) | 官方文档 | ⭐⭐⭐⭐⭐ | 阶段1-2 |
| 6 | [Chromium Blog](https://blog.chromium.org) | 官方博客 | ⭐⭐⭐⭐ | 阶段1 |
| 7 | [MDN Web Docs](https://developer.mozilla.org) | 官方文档 | ⭐⭐⭐⭐⭐ | 全阶段 |
| 8 | [Vite 源码 (github.com/vitejs/vite)](https://github.com/vitejs/vite) | 源码 | ⭐⭐⭐⭐ | 阶段1 |
| 9 | [Node.js 官方文档](https://nodejs.org/docs) | 官方文档 | ⭐⭐⭐⭐ | 阶段1-2 |
| 10 | Dan Abramov 博客 [overreacted.io](https://overreacted.io) | 顶级博客 | ⭐⭐⭐⭐⭐ | 阶段1 |

### 7.2 架构设计

| 序号 | 资料 | 类型 | 优先级 | 对应阶段 |
|------|------|------|--------|---------|
| 1 | [System Design Interview - Alex Xu](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF) | 书籍 | ⭐⭐⭐⭐⭐ | 阶段2 |
| 2 | [Designing Data-Intensive Applications (DERTA)](https://dataintensive.net) | 书籍 | ⭐⭐⭐⭐⭐ | 阶段2-3 |
| 3 | [Martin Fowler 博客](https://martinfowler.com) | 顶级博客 | ⭐⭐⭐⭐⭐ | 阶段2-3 |
| 4 | [Google Engineering Practices](https://google.github.io/eng-practices/) | 官方文档 | ⭐⭐⭐⭐ | 阶段2 |
| 5 | [The Architecture of Open Source Applications](https://aosabook.org) | 书籍 | ⭐⭐⭐⭐ | 阶段3 |
| 6 | [Micro Frontends (micro-frontends.org)](https://micro-frontends.org) | 文档 | ⭐⭐⭐⭐ | 阶段2 |
| 7 | [InfoQ 架构师专题](https://www.infoq.cn/topic/architecture) | 社区 | ⭐⭐⭐⭐ | 全阶段 |

### 7.3 AI / LLM 应用开发

| 序号 | 资料 | 类型 | 优先级 | 对应阶段 |
|------|------|------|--------|---------|
| 1 | [OpenAI 官方文档 (platform.openai.com)](https://platform.openai.com/docs) | 官方文档 | ⭐⭐⭐⭐⭐ | 阶段1 |
| 2 | [Anthropic 官方文档 (docs.anthropic.com)](https://docs.anthropic.com) | 官方文档 | ⭐⭐⭐⭐⭐ | 阶段1 |
| 3 | [LangChain 文档](https://python.langchain.com) | 官方文档 | ⭐⭐⭐⭐⭐ | 阶段1-2 |
| 4 | [Vercel AI SDK (sdk.vercel.ai)](https://sdk.vercel.ai) | 官方文档 | ⭐⭐⭐⭐⭐ | 阶段2 |
| 5 | [Attention Is All You Need (原始论文)](https://arxiv.org/abs/1706.03762) | 论文 | ⭐⭐⭐⭐ | 阶段1 |
| 6 | [Prompt Engineering Guide](https://www.promptingguide.ai) | 社区 | ⭐⭐⭐⭐⭐ | 阶段1 |
| 7 | [Andrej Karpathy YouTube](https://www.youtube.com/@AndrejKarpathy) | 视频 | ⭐⭐⭐⭐⭐ | 阶段1 |
| 8 | [LLM应用开发实战 - 吴恩达 短课程](https://www.deeplearning.ai/short-courses/) | 课程 | ⭐⭐⭐⭐⭐ | 阶段1-2 |
| 9 | [Hugging Face 文档](https://huggingface.co/docs) | 官方文档 | ⭐⭐⭐⭐ | 阶段2-3 |
| 10 | [AI Engineer Summit 演讲](https://www.ai.engineer) | 会议 | ⭐⭐⭐⭐ | 阶段2-3 |

### 7.4 算法与计算机基础

| 序号 | 资料 | 类型 | 优先级 |
|------|------|------|--------|
| 1 | [LeetCode（按标签刷）](https://leetcode.com) | 刷题平台 | ⭐⭐⭐⭐⭐ |
| 2 | [算法导论 CLRS](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/) | 书籍 | ⭐⭐⭐⭐ |
| 3 | [编译原理（龙书/Crafting Interpreters）](https://craftinginterpreters.com) | 书籍 | ⭐⭐⭐⭐ |
| 4 | [操作系统导论 OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) | 书籍 | ⭐⭐⭐ |
| 5 | [计算机网络：自顶向下](https://gaia.cs.umass.edu/kurose_ross/index.php) | 书籍 | ⭐⭐⭐ |

### 7.5 软技能与影响力

| 序号 | 资料 | 描述 |
|------|------|------|
| 1 | [Staff Engineer - Will Larson](https://staffeng.com) | 高级工程师晋升路径 |
| 2 | [The Staff Engineer's Path - Tanya Reilly](https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/) | Staff+工程师成长 |
| 3 | [An Elegant Puzzle - Will Larson](https://lethain.com/elegant-puzzle/) | 工程管理 |
| 4 | [技术写作：dev.to / Medium / 掘金](https://juejin.cn) | 技术输出平台 |
| 5 | [技术演讲：QCon / GMTC / D2](https://gmtc.infoq.cn) | 会议演讲投稿 |

---

## 八、执行检查清单（季度Review）

每季度对照以下清单进行自我评估：

### 季度Review模板

```markdown
## Q[X] 成长Review

### 技术深度
- [ ] 本季度深度学习了哪个技术领域？产出了什么？
- [ ] 完成了多少道LeetCode？（目标：每季度50题）

### 架构能力
- [ ] 完成了几份架构设计文档？
- [ ] 是否主导了一次技术方案评审？

### AI能力
- [ ] 学习了哪些AI新技术？
- [ ] 是否有AI应用实践产出？

### 影响力
- [ ] 发表了几篇技术文章？（目标：每月2篇）
- [ ] 做了几次技术分享？（目标：每季度1次）
- [ ] 开源项目进展如何？

### 下季度目标
- 目标1：
- 目标2：
- 目标3：
```

---

> **最后的核心建议**：
>
> P10级别的本质不是"技术全会"，而是**在一个足够大的技术领域内，具备定义方向、推动变革、产生规模化影响的能力**。
>
> 在AI时代，这个领域正在从"前端工程"扩展到**"AI Native人机交互系统工程"**。
>
> 三年时间，**前18个月打基础、补深度**，**后18个月建影响力、做突破**。
>
> 每天坚持5小时的高质量学习，3年后你的技术水平会远超90%的同行。关键不在于计划多完美，而在于**每天都在执行**。
