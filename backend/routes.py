"""
API 路由模块
定义所有数据接口的路由处理函数
"""

from fastapi import APIRouter, Query
from typing import Optional
from data_generator import get_generator

# 创建路由器
router = APIRouter()


@router.get("/api/summary")
async def get_summary(
    start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)"),
    region: Optional[str] = Query(None, description="区域筛选"),
    category: Optional[str] = Query(None, description="品类筛选")
):
    """
    获取销售数据汇总（支持筛选）
    
    参数:
        - start_date: 开始日期（可选）
        - end_date: 结束日期（可选）
        - region: 区域筛选（可选）
        - category: 品类筛选（可选）
    
    返回:
        - total_sales: 总销售额
        - total_profit: 总利润
        - total_orders: 总订单量
        - avg_margin: 平均利润率
        - record_count: 记录总数
        - date_range: 日期范围
    """
    generator = get_generator()
    return generator.get_summary(start_date, end_date, region, category)


@router.get("/api/trend")
async def get_trend(
    start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)"),
    region: Optional[str] = Query(None, description="区域筛选"),
    category: Optional[str] = Query(None, description="品类筛选")
):
    """
    获取销售趋势数据（按日期聚合）
    
    参数:
        - start_date: 开始日期（可选）
        - end_date: 结束日期（可选）
        - region: 区域筛选（可选）
        - category: 品类筛选（可选）
    
    返回:
        - 日期、销售额、利润、订单量的趋势数据列表
    """
    generator = get_generator()
    return generator.get_trend_data(start_date, end_date, region, category)


@router.get("/api/region")
async def get_region(
    start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)"),
    region: Optional[str] = Query(None, description="区域筛选"),
    category: Optional[str] = Query(None, description="品类筛选")
):
    """
    获取区域销售数据
    
    参数:
        - start_date: 开始日期（可选）
        - end_date: 结束日期（可选）
        - region: 区域筛选（可选）
        - category: 品类筛选（可选）
    
    返回:
        - 各区域的销售额、利润、订单量数据
    """
    generator = get_generator()
    return generator.get_region_data(start_date, end_date, region, category)


@router.get("/api/category")
async def get_category(
    start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)"),
    region: Optional[str] = Query(None, description="区域筛选"),
    category: Optional[str] = Query(None, description="品类筛选")
):
    """
    获取品类销售数据
    
    参数:
        - start_date: 开始日期（可选）
        - end_date: 结束日期（可选）
        - region: 区域筛选（可选）
        - category: 品类筛选（可选）
    
    返回:
        - 各品类的销售额、利润、订单量数据
    """
    generator = get_generator()
    return generator.get_category_data(start_date, end_date, region, category)


@router.get("/api/city-ranking")
async def get_city_ranking(
    start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)"),
    region: Optional[str] = Query(None, description="区域筛选"),
    category: Optional[str] = Query(None, description="品类筛选"),
    limit: Optional[int] = Query(20, ge=1, le=50, description="返回城市数量")
):
    """
    获取城市销售排名
    
    参数:
        - start_date: 开始日期（可选）
        - end_date: 结束日期（可选）
        - region: 区域筛选（可选）
        - category: 品类筛选（可选）
        - limit: 返回城市数量（默认20，最大50）
    
    返回:
        - 城市销售排名数据
    """
    generator = get_generator()
    return generator.get_city_ranking(start_date, end_date, region, category, limit)


@router.get("/api/heatmap")
async def get_heatmap(
    start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)")
):
    """
    获取热力图数据（按日期+品类聚合）
    
    参数:
        - start_date: 开始日期（可选）
        - end_date: 结束日期（可选）
    
    返回:
        - 热力图数据
    """
    generator = get_generator()
    return generator.get_heatmap_data(start_date, end_date)


@router.get("/api/data")
async def get_data(
    start_date: Optional[str] = Query(None, description="开始日期 (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="结束日期 (YYYY-MM-DD)"),
    region: Optional[str] = Query(None, description="区域筛选"),
    category: Optional[str] = Query(None, description="品类筛选"),
    page: Optional[int] = Query(1, ge=1, description="页码"),
    page_size: Optional[int] = Query(20, ge=1, le=100, description="每页条数"),
    sort_by: Optional[str] = Query("date", description="排序字段"),
    sort_order: Optional[str] = Query("desc", description="排序方式 (asc/desc)")
):
    """
    获取明细数据（支持筛选、分页、排序）
    
    参数:
        - start_date: 开始日期（可选）
        - end_date: 结束日期（可选）
        - region: 区域筛选（可选）
        - category: 品类筛选（可选）
        - page: 页码（默认1）
        - page_size: 每页条数（默认20，最大100）
        - sort_by: 排序字段（默认date）
        - sort_order: 排序方式（默认desc）
    
    返回:
        - 明细数据列表 + 分页信息
    """
    generator = get_generator()
    return generator.get_filtered_data(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )


@router.get("/api/filters")
async def get_filters():
    """
    获取筛选器选项
    
    返回:
        - 区域列表
        - 品类列表
        - 日期范围
    """
    generator = get_generator()
    
    # 获取所有区域
    regions = list(generator.REGIONS.keys()) if hasattr(generator, 'REGIONS') else []
    
    # 如果没有，直接定义
    if not regions:
        from data_generator import REGIONS, CATEGORIES
        regions = list(REGIONS.keys())
        categories = list(CATEGORIES.keys())
    else:
        categories = list(generator.CATEGORIES.keys()) if hasattr(generator, 'CATEGORIES') else []
        if not categories:
            from data_generator import CATEGORIES
            categories = list(CATEGORIES.keys())
    
    date_range = generator.get_date_range()
    
    return {
        "regions": regions,
        "categories": categories,
        "date_range": date_range
    }


@router.get("/api/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy", "message": "服务运行正常"}