"""
企业销售数据可视化看板 - 后端主入口
基于 FastAPI 框架，提供数据接口服务

项目结构:
- app.py: 主入口，启动服务
- routes.py: API 路由定义
- data_generator.py: 数据生成模块

运行方式:
    python app.py 或 uvicorn app:app --reload

端口: 8000 (默认)
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router
import uvicorn

# 创建 FastAPI 应用实例
app = FastAPI(
    title="企业销售数据可视化看板 API",
    description="为中小型零售企业提供销售数据可视化服务，所有数据由后台动态生成",
    version="1.0.0",
    docs_url="/docs",  # Swagger 文档路径
    redoc_url="/redoc"  # ReDoc 文档路径
)

# 配置 CORS（允许前端跨域访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",  # 前端开发环境
        "http://localhost:3000",
        "*"  # 生产环境允许所有来源
    ],
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法
    allow_headers=["*"],  # 允许所有请求头
)

# 注册路由
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化事件"""
    print("=" * 60)
    print("🚀 企业销售数据可视化看板 - 后端服务启动")
    print("=" * 60)
    print("📡 API 文档地址: http://localhost:8000/docs")
    print("📊 前端访问地址: http://localhost:5000")
    print("=" * 60)
    
    # 预加载数据生成器
    from data_generator import get_generator
    generator = get_generator()
    print(f"✅ 数据已生成，共 {len(generator.daily_data)} 条销售记录")
    print("=" * 60)


@app.get("/")
async def root():
    """根路径欢迎信息"""
    return {
        "message": "企业销售数据可视化看板 API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


def main():
    """主函数：启动服务"""
    # 从环境变量获取端口，默认 8000
    port = int(os.environ.get("BACKEND_PORT", 8000))
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True,  # 开发模式，代码修改自动重启
        log_level="info"
    )


if __name__ == "__main__":
    main()