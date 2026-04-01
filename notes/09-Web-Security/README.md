# Web 安全

> **权威来源**：[OWASP](https://owasp.org)、[MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

## 核心文件

| 文件 | 内容 | 难度 |
|------|------|------|
| [01-XSS-CSRF.md](./01-XSS-CSRF.md) | XSS/CSRF 攻击与防御 | ⭐⭐⭐⭐ |
| [02-Auth-Security.md](./02-Auth-Security.md) | 认证安全：OAuth2/JWT/Cookie | ⭐⭐⭐⭐ |

## 安全知识图谱

```
Web 安全
├── 注入攻击
│   ├── XSS（跨站脚本）— 反射型/存储型/DOM型
│   ├── SQL 注入
│   └── 命令注入
├── 跨域安全
│   ├── CSRF（跨站请求伪造）
│   └── CORS 配置
├── 认证与授权
│   ├── OAuth 2.0 / OIDC
│   ├── JWT 安全
│   └── Cookie 安全（SameSite/HttpOnly/Secure）
├── 传输安全
│   ├── HTTPS / TLS
│   └── HSTS (HTTP Strict Transport Security)
├── 内容安全
│   ├── CSP (Content Security Policy)
│   ├── SRI (Subresource Integrity)
│   └── Trusted Types
├── 供应链安全
│   ├── 依赖审计（npm audit）
│   ├── Lock 文件管理
│   └── 私有 Registry
└── AI 安全
    ├── Prompt 注入防御
    ├── 输出过滤
    └── 速率限制
```
