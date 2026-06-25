"""
数据生成器模块
负责生成模拟的销售数据，包括日期、区域、品类、销售额、利润、订单量等
所有数据在启动时生成，运行期间保持一致
"""

import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
import numpy as np

# 设置随机种子，确保同一次运行期内数据一致
SEED = 2024
random.seed(SEED)
np.random.seed(SEED)

# ==================== 基础配置 ====================

# 区域配置（中国主要区域）
REGIONS = {
    "华东": ["上海", "南京", "杭州", "苏州", "无锡"],
    "华南": ["广州", "深圳", "佛山", "东莞", "厦门"],
    "华北": ["北京", "天津", "石家庄", "太原", "呼和浩特"],
    "华中": ["武汉", "长沙", "郑州", "南昌", "合肥"],
    "西南": ["成都", "重庆", "昆明", "贵阳", "拉萨"],
    "西北": ["西安", "兰州", "乌鲁木齐", "银川", "西宁"],
    "东北": ["沈阳", "大连", "哈尔滨", "长春", "齐齐哈尔"]
}

# 品类配置（零售商品类别）
CATEGORIES = {
    "食品饮料": {"margin": 0.15, "weight": 0.25},
    "日用百货": {"margin": 0.20, "weight": 0.20},
    "服装鞋帽": {"margin": 0.35, "weight": 0.18},
    "电子产品": {"margin": 0.12, "weight": 0.15},
    "家居用品": {"margin": 0.28, "weight": 0.12},
    "美妆护肤": {"margin": 0.40, "weight": 0.10}
}

# 区域销售系数（体现区域经济差异）
REGION_COEFFICIENTS = {
    "华东": 1.5,    # 经济发达，销售额高
    "华南": 1.4,
    "华北": 1.3,
    "华中": 1.0,
    "西南": 0.9,
    "西北": 0.7,
    "东北": 0.8
}

# 季节系数（体现销售季节性）
SEASON_COEFFICIENTS = {
    1: 0.8,   # 春节前低谷
    2: 1.2,   # 春节期间高峰
    3: 0.9,
    4: 1.0,
    5: 1.1,   # 五一假期
    6: 0.9,
    7: 0.85,  # 夏季淡季
    8: 0.9,
    9: 1.0,
    10: 1.15, # 国庆期间
    11: 1.3,  # 双十一大促
    12: 1.4   # 年底促销
}


class SalesDataGenerator:
    """销售数据生成器"""
    
    def __init__(self, days: int = 90):
        """
        初始化数据生成器
        
        Args:
            days: 生成多少天的历史数据，默认90天
        """
        self.days = days
        self.start_date = datetime.now() - timedelta(days=days)
        self.daily_data: List[Dict[str, Any]] = []
        self.generate_all_data()
    
    def generate_all_data(self):
        """生成所有销售数据"""
        print(f"正在生成 {self.days} 天的销售数据...")
        
        for day_offset in range(self.days):
            current_date = self.start_date + timedelta(days=day_offset)
            month = current_date.month
            
            # 获取季节系数
            season_coef = SEASON_COEFFICIENTS.get(month, 1.0)
            
            # 为每个区域生成数据
            for region, cities in REGIONS.items():
                region_coef = REGION_COEFFICIENTS.get(region, 1.0)
                
                # 为每个品类生成数据
                for category, config in CATEGORIES.items():
                    margin = config["margin"]
                    weight = config["weight"]
                    
                    # 基础销售额（考虑品类权重）
                    base_sales = random.uniform(50000, 150000) * weight
                    
                    # 应用区域系数和季节系数
                    adjusted_sales = base_sales * region_coef * season_coef
                    
                    # 添加随机波动（±20%）
                    fluctuation = random.uniform(0.8, 1.2)
                    final_sales = adjusted_sales * fluctuation
                    
                    # 计算利润
                    profit = final_sales * margin * random.uniform(0.8, 1.2)
                    
                    # 计算订单量
                    avg_order_value = random.uniform(200, 800)
                    order_count = int(final_sales / avg_order_value)
                    
                    # 随机选择一个城市
                    city = random.choice(cities)
                    
                    # 生成记录
                    record = {
                        "date": current_date.strftime("%Y-%m-%d"),
                        "region": region,
                        "city": city,
                        "category": category,
                        "sales": round(final_sales, 2),
                        "profit": round(profit, 2),
                        "orders": order_count,
                        "avg_order_value": round(avg_order_value, 2),
                        "margin": round(margin * 100, 1)  # 利润率百分比
                    }
                    
                    self.daily_data.append(record)
        
        print(f"数据生成完成，共 {len(self.daily_data)} 条记录")
    
    def get_summary(self, start_date: str = None, end_date: str = None, region: str = None, category: str = None) -> Dict[str, Any]:
        """获取汇总数据（支持筛选）"""
        filtered_data = self.daily_data
        
        # 日期过滤
        if start_date or end_date:
            filtered_data = [
                item for item in filtered_data
                if (not start_date or item["date"] >= start_date)
                and (not end_date or item["date"] <= end_date)
            ]
        
        # 区域过滤
        if region:
            filtered_data = [item for item in filtered_data if item["region"] == region]
        
        # 品类过滤
        if category:
            filtered_data = [item for item in filtered_data if item["category"] == category]
        
        total_sales = sum(item["sales"] for item in filtered_data)
        total_profit = sum(item["profit"] for item in filtered_data)
        total_orders = sum(item["orders"] for item in filtered_data)
        avg_margin = (total_profit / total_sales * 100) if total_sales > 0 else 0
        
        # 计算实际日期范围
        if filtered_data:
            dates = [item["date"] for item in filtered_data]
            actual_start = min(dates)
            actual_end = max(dates)
        else:
            actual_start = self.start_date.strftime("%Y-%m-%d")
            actual_end = datetime.now().strftime("%Y-%m-%d")
        
        return {
            "total_sales": round(total_sales, 2),
            "total_profit": round(total_profit, 2),
            "total_orders": total_orders,
            "avg_margin": round(avg_margin, 2),
            "record_count": len(filtered_data),
            "date_range": {
                "start": actual_start,
                "end": actual_end
            }
        }
    
    def get_trend_data(self, start_date: str = None, end_date: str = None, region: str = None, category: str = None) -> List[Dict]:
        """获取趋势数据（按日期聚合，支持筛选）"""
        date_map = {}
        
        for item in self.daily_data:
            date = item["date"]
            
            # 日期过滤
            if start_date and date < start_date:
                continue
            if end_date and date > end_date:
                continue
            
            # 区域过滤
            if region and item["region"] != region:
                continue
            
            # 品类过滤
            if category and item["category"] != category:
                continue
            
            if date not in date_map:
                date_map[date] = {
                    "date": date,
                    "sales": 0,
                    "profit": 0,
                    "orders": 0
                }
            
            date_map[date]["sales"] += item["sales"]
            date_map[date]["profit"] += item["profit"]
            date_map[date]["orders"] += item["orders"]
        
        # 按日期排序
        result = sorted(date_map.values(), key=lambda x: x["date"])
        
        # 四舍五入
        for item in result:
            item["sales"] = round(item["sales"], 2)
            item["profit"] = round(item["profit"], 2)
        
        return result
    
    def get_region_data(self, start_date: str = None, end_date: str = None, region: str = None, category: str = None) -> List[Dict]:
        """获取区域销售数据（支持筛选）"""
        region_map = {}
        
        for item in self.daily_data:
            # 日期过滤
            if start_date and item["date"] < start_date:
                continue
            if end_date and item["date"] > end_date:
                continue
            
            # 区域过滤
            if region and item["region"] != region:
                continue
            
            # 品类过滤
            if category and item["category"] != category:
                continue
            
            reg = item["region"]
            
            if reg not in region_map:
                region_map[reg] = {
                    "region": reg,
                    "sales": 0,
                    "profit": 0,
                    "orders": 0,
                    "cities": set()
                }
            
            region_map[reg]["sales"] += item["sales"]
            region_map[reg]["profit"] += item["profit"]
            region_map[reg]["orders"] += item["orders"]
            region_map[reg]["cities"].add(item["city"])
        
        # 转换为列表并格式化
        result = []
        for reg, data in region_map.items():
            result.append({
                "region": reg,
                "sales": round(data["sales"], 2),
                "profit": round(data["profit"], 2),
                "orders": data["orders"],
                "city_count": len(data["cities"])
            })
        
        # 按销售额排序
        result.sort(key=lambda x: x["sales"], reverse=True)
        
        return result
    
    def get_category_data(self, start_date: str = None, end_date: str = None, region: str = None, category: str = None) -> List[Dict]:
        """获取品类销售数据（支持筛选）"""
        category_map = {}
        
        for item in self.daily_data:
            # 日期过滤
            if start_date and item["date"] < start_date:
                continue
            if end_date and item["date"] > end_date:
                continue
            
            # 区域过滤
            if region and item["region"] != region:
                continue
            
            # 品类过滤
            if category and item["category"] != category:
                continue
            
            cat = item["category"]
            
            if cat not in category_map:
                category_map[cat] = {
                    "category": cat,
                    "sales": 0,
                    "profit": 0,
                    "orders": 0
                }
            
            category_map[cat]["sales"] += item["sales"]
            category_map[cat]["profit"] += item["profit"]
            category_map[cat]["orders"] += item["orders"]
        
        # 转换为列表并格式化
        result = []
        for cat, data in category_map.items():
            result.append({
                "category": cat,
                "sales": round(data["sales"], 2),
                "profit": round(data["profit"], 2),
                "orders": data["orders"]
            })
        
        # 按销售额排序
        result.sort(key=lambda x: x["sales"], reverse=True)
        
        return result
    
    def get_city_ranking(self, start_date: str = None, end_date: str = None, region: str = None, category: str = None, limit: int = 20) -> List[Dict]:
        """获取城市销售排名（支持筛选）"""
        city_map = {}
        
        for item in self.daily_data:
            # 日期过滤
            if start_date and item["date"] < start_date:
                continue
            if end_date and item["date"] > end_date:
                continue
            
            # 区域过滤
            if region and item["region"] != region:
                continue
            
            # 品类过滤
            if category and item["category"] != category:
                continue
            
            city = item["city"]
            
            if city not in city_map:
                city_map[city] = {
                    "city": city,
                    "region": item["region"],
                    "sales": 0,
                    "profit": 0,
                    "orders": 0
                }
            
            city_map[city]["sales"] += item["sales"]
            city_map[city]["profit"] += item["profit"]
            city_map[city]["orders"] += item["orders"]
        
        # 转换为列表并排序
        result = []
        for city, data in city_map.items():
            result.append({
                "city": city,
                "region": data["region"],
                "sales": round(data["sales"], 2),
                "profit": round(data["profit"], 2),
                "orders": data["orders"]
            })
        
        # 按销售额排序
        result.sort(key=lambda x: x["sales"], reverse=True)
        
        return result[:limit]
    
    def get_filtered_data(
        self, 
        start_date: str = None, 
        end_date: str = None,
        region: str = None,
        category: str = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "date",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
        """获取筛选后的数据（支持分页和排序）"""
        
        # 筛选数据
        filtered = []
        for item in self.daily_data:
            # 日期过滤
            if start_date and item["date"] < start_date:
                continue
            if end_date and item["date"] > end_date:
                continue
            
            # 区域过滤
            if region and item["region"] != region:
                continue
            
            # 品类过滤
            if category and item["category"] != category:
                continue
            
            filtered.append(item.copy())
        
        # 排序
        reverse = (sort_order == "desc")
        if sort_by in ["date", "sales", "profit", "orders"]:
            filtered.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse)
        
        # 分页
        total = len(filtered)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        page_data = filtered[start_idx:end_idx]
        
        return {
            "data": page_data,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": (total + page_size - 1) // page_size
            }
        }
    
    def get_date_range(self) -> Dict[str, str]:
        """获取数据日期范围"""
        return {
            "start": self.start_date.strftime("%Y-%m-%d"),
            "end": (self.start_date + timedelta(days=self.days - 1)).strftime("%Y-%m-%d")
        }
    
    def get_heatmap_data(self, start_date: str = None, end_date: str = None, region: str = None, category: str = None) -> List[Dict]:
        """获取热力图数据（按日期+品类聚合，支持筛选）"""
        heatmap_map = {}
        
        for item in self.daily_data:
            # 日期过滤
            if start_date and item["date"] < start_date:
                continue
            if end_date and item["date"] > end_date:
                continue
            
            # 区域过滤
            if region and item["region"] != region:
                continue
            
            # 品类过滤
            if category and item["category"] != category:
                continue
            
            key = f"{item['date']}_{item['category']}"
            
            if key not in heatmap_map:
                heatmap_map[key] = {
                    "date": item["date"],
                    "category": item["category"],
                    "sales": 0,
                    "profit": 0,
                    "orders": 0
                }
            
            heatmap_map[key]["sales"] += item["sales"]
            heatmap_map[key]["profit"] += item["profit"]
            heatmap_map[key]["orders"] += item["orders"]
        
        # 转换为列表
        result = []
        for data in heatmap_map.values():
            result.append({
                "date": data["date"],
                "category": data["category"],
                "sales": round(data["sales"], 2),
                "profit": round(data["profit"], 2),
                "orders": data["orders"]
            })
        
        return result


# 创建全局数据生成器实例
generator = None

def get_generator() -> SalesDataGenerator:
    """获取数据生成器实例（单例模式）"""
    global generator
    if generator is None:
        generator = SalesDataGenerator(days=90)
    return generator