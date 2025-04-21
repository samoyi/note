

## `ArgumentsCamelCase` 模块
### 核心功能
#### ​自动格式转换
将命令行参数从 ​kebab-case 转换为 ​camelCase，例如：
```ts
// 命令行输入
--case-sensitive --output-dir ./dist

// 转换为
{ caseSensitive: true, outputDir: './dist' }
```

#### 类型推导增强
自动推导转换后的参数类型，避免手动类型断言：
```ts
// 没有使用时的类型问题
const sensitive = argv['case-sensitive'] as boolean; // 需要断言

// 使用后
const sensitive = argv.caseSensitive; // 自动推导为 boolean
```