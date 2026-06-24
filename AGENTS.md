# AGENTS.md

# 项目上下文

## 项目简介
企业销售数据可视化看板 - 为中小型零售企业开发的销售数据监控系统

### 版本技术栈
- **前端**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **可视化**: ECharts (echarts-for-react)
- **UI组件**: shadcn/ui + Tailwind CSS 4
- **后端**: Python FastAPI (端口 8000)

## 目录结构
```
├── backend/                 # Python 后端服务 (端口 8000)
│   ├── app.py              # FastAPI 主入口
│   ├── routes.py           # API 路由定义
│   ├── data_generator.py   # 模拟数据生成器
│   └── requirements.txt    # Python 依赖
├── src/
│   ├── app/
│   │   ├── page.tsx        # 主仪表盘页面
│   │   ├── layout.tsx      # 页面布局
│   │   └── globals.css     # 全局样式
│   ├── components/ui/      # shadcn/ui 组件库
│   └── lib/utils.ts        # 工具函数
├── scripts/                # 构建脚本
├── public/                 # 静态资源
└── .coze                   # Coze 部署配置
```

## 包管理规范
- 前端：**pnpm** (强制)
- 后端：pip install -r requirements.txt

## 启动方式

### 启动后端服务
```bash
cd /workspace/projects/backend
python app.py
# 服务运行在 http://localhost:8000
```

### 启动前端服务
```bash
cd /workspace/projects
pnpm run dev
# 服务运行在 http://localhost:5000
```

## API 接口清单
| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/summary` | GET | 获取汇总数据 |
| `/api/trend` | GET | 获取趋势数据 |
| `/api/region` | GET | 获取区域数据 |
| `/api/category` | GET | 获取品类数据 |
| `/api/city-ranking` | GET | 获取城市排名 |
| `/api/data` | GET | 获取明细数据(分页) |
| `/api/filters` | GET | 获取筛选器选项 |
| `/api/health` | GET | 健康检查 |

## 功能清单
1. **KPI卡片**: 总销售额、总利润、订单量、利润率
2. **折线图**: 销售趋势分析(日销售额/利润)
3. **柱状图**: 区域销售对比
4. **饼图**: 品类销售占比
5. **横向柱状图**: 城市排名 TOP10
6. **数据表格**: 明细数据展示，支持排序和分页
7. **筛选功能**: 按日期、区域、品类筛选

## 开发规范
- TypeScript strict 模式
- 禁止隐式 any
- 使用语义化 CSS 变量
- 后端数据在启动时生成，运行期间保持一致

## 注意事项
- 前端需要后端服务启动才能正常显示数据
- API 地址: http://localhost:8000
- 前端地址: http://localhost:5000
- CORS 已配置允许跨域访问
