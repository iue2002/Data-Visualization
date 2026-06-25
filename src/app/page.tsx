"use client";

import { useState, useEffect, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Percent,
  Calendar,
  MapPin,
  ShoppingCart,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react";

// ==================== 类型定义 ====================

interface SummaryData {
  total_sales: number;
  total_profit: number;
  total_orders: number;
  avg_margin: number;
  record_count: number;
  date_range: {
    start: string;
    end: string;
  };
}

interface TrendItem {
  date: string;
  sales: number;
  profit: number;
  orders: number;
}

interface RegionItem {
  region: string;
  sales: number;
  profit: number;
  orders: number;
  city_count: number;
}

interface CategoryItem {
  category: string;
  sales: number;
  profit: number;
  orders: number;
}

interface CityRankingItem {
  city: string;
  region: string;
  sales: number;
  profit: number;
  orders: number;
}

interface DetailItem {
  date: string;
  region: string;
  city: string;
  category: string;
  sales: number;
  profit: number;
  orders: number;
  avg_order_value: number;
  margin: number;
}

interface PaginationInfo {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

interface FilterOptions {
  regions: string[];
  categories: string[];
  date_range: {
    start: string;
    end: string;
  };
}

// ==================== 工具函数 ====================

// 格式化金额
const formatMoney = (value: number): string => {
  if (value >= 1000000) {
    return `¥${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`;
  }
  return `¥${value.toFixed(2)}`;
};

// 格式化数字
const formatNumber = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return value.toString();
};

// ==================== 主页面组件 ====================

export default function DashboardPage() {
  // 状态管理
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [trendData, setTrendData] = useState<TrendItem[]>([]);
  const [regionData, setRegionData] = useState<RegionItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);
  const [cityRanking, setCityRanking] = useState<CityRankingItem[]>([]);
  const [detailData, setDetailData] = useState<DetailItem[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0,
  });
  const [filters, setFilters] = useState<FilterOptions | null>(null);

  // 筛选条件
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 加载状态
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 排序
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // API 基础地址 - 使用相对路径代理
  const API_BASE = "";

  // ==================== 数据获取 ====================

  // 获取汇总数据
  const fetchSummary = useCallback(async (start?: string, end?: string, region?: string, category?: string) => {
    try {
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (region && region !== "all") params.append("region", region);
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API_BASE}/api/proxy/summary?${params.toString()}`);
      if (!response.ok) throw new Error("获取汇总数据失败");
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error("获取汇总数据失败:", err);
    }
  }, []);

  // 获取趋势数据
  const fetchTrendData = useCallback(async (start?: string, end?: string, region?: string, category?: string) => {
    try {
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (region && region !== "all") params.append("region", region);
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API_BASE}/api/proxy/trend?${params.toString()}`);
      if (!response.ok) throw new Error("获取趋势数据失败");
      const data = await response.json();
      setTrendData(data);
    } catch (err) {
      console.error("获取趋势数据失败:", err);
    }
  }, []);

  // 获取区域数据
  const fetchRegionData = useCallback(async (start?: string, end?: string, region?: string, category?: string) => {
    try {
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (region && region !== "all") params.append("region", region);
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API_BASE}/api/proxy/region?${params.toString()}`);
      if (!response.ok) throw new Error("获取区域数据失败");
      const data = await response.json();
      setRegionData(data);
    } catch (err) {
      console.error("获取区域数据失败:", err);
    }
  }, []);

  // 获取品类数据
  const fetchCategoryData = useCallback(async (start?: string, end?: string, region?: string, category?: string) => {
    try {
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (region && region !== "all") params.append("region", region);
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API_BASE}/api/proxy/category?${params.toString()}`);
      if (!response.ok) throw new Error("获取品类数据失败");
      const data = await response.json();
      setCategoryData(data);
    } catch (err) {
      console.error("获取品类数据失败:", err);
    }
  }, []);

  // 获取城市排名
  const fetchCityRanking = useCallback(async (start?: string, end?: string, region?: string, category?: string) => {
    try {
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (region && region !== "all") params.append("region", region);
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API_BASE}/api/proxy/city-ranking?${params.toString()}`);
      if (!response.ok) throw new Error("获取城市排名失败");
      const data = await response.json();
      setCityRanking(data);
    } catch (err) {
      console.error("获取城市排名失败:", err);
    }
  }, []);

  // 获取热力图数据
  const fetchHeatmapData = useCallback(async (start?: string, end?: string, region?: string, category?: string) => {
    try {
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (region && region !== "all") params.append("region", region);
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API_BASE}/api/proxy/heatmap?${params.toString()}`);
      if (!response.ok) throw new Error("获取热力图数据失败");
      const data = await response.json();
      setHeatmapData(data);
    } catch (err) {
      console.error("获取热力图数据失败:", err);
    }
  }, []);

  // 获取明细数据
  const fetchDetailData = useCallback(async (
    page: number,
    start?: string,
    end?: string,
    region?: string,
    category?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", "20");
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (region && region !== "all") params.append("region", region);
      if (category && category !== "all") params.append("category", category);
      if (sortBy) params.append("sort_by", sortBy);
      if (sortOrder) params.append("sort_order", sortOrder);
      
      const response = await fetch(`${API_BASE}/api/proxy/data?${params.toString()}`);
      if (!response.ok) throw new Error("获取明细数据失败");
      const data = await response.json();
      setDetailData(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("获取明细数据失败:", err);
    }
  }, []);

  // 获取筛选器选项
  const fetchFilters = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/proxy/filters`);
      if (!response.ok) throw new Error("获取筛选器失败");
      const data = await response.json();
      setFilters(data);
      setStartDate(data.date_range.start);
      setEndDate(data.date_range.end);
    } catch (err) {
      console.error("获取筛选器失败:", err);
    }
  }, []);

  // 初始化数据加载
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await fetchFilters();
        await Promise.all([
          fetchSummary(),
          fetchTrendData(),
          fetchRegionData(),
          fetchCategoryData(),
          fetchCityRanking(),
          fetchHeatmapData(),
          fetchDetailData(1),
        ]);
      } catch (err) {
        setError("数据加载失败，请检查后端服务是否启动");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, []);

  // 筛选条件变化时重新加载
  useEffect(() => {
    if (!loading && filters) {
      const start = startDate || filters.date_range.start;
      const end = endDate || filters.date_range.end;
      
      fetchSummary(start, end, selectedRegion, selectedCategory);
      fetchTrendData(start, end, selectedRegion, selectedCategory);
      fetchRegionData(start, end, selectedRegion, selectedCategory);
      fetchCategoryData(start, end, selectedRegion, selectedCategory);
      fetchCityRanking(start, end, selectedRegion, selectedCategory);
      fetchHeatmapData(start, end, selectedRegion, selectedCategory);
      fetchDetailData(1, start, end, selectedRegion, selectedCategory, sortBy, sortOrder);
    }
  }, [startDate, endDate, selectedRegion, selectedCategory]);

  // 排序变化时重新加载
  useEffect(() => {
    if (!loading && filters) {
      const start = startDate || filters.date_range.start;
      const end = endDate || filters.date_range.end;
      
      fetchDetailData(1, start, end, selectedRegion, selectedCategory, sortBy, sortOrder);
    }
  }, [sortBy, sortOrder]);

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    Promise.all([
      fetchSummary(),
      fetchTrendData(startDate, endDate),
      fetchRegionData(startDate, endDate),
      fetchCategoryData(startDate, endDate),
      fetchCityRanking(startDate, endDate),
      fetchDetailData(pagination.page, startDate, endDate, selectedRegion, selectedCategory, sortBy, sortOrder),
    ]).finally(() => setLoading(false));
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      const start = startDate || filters?.date_range.start;
      const end = endDate || filters?.date_range.end;
      fetchDetailData(newPage, start, end, selectedRegion, selectedCategory, sortBy, sortOrder);
    }
  };

  // 排序处理
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // ==================== 图表配置 ====================

  // 趋势图配置
  const getTrendChartOption = () => {
    return {
      title: {
        text: "销售趋势",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        data: ["销售额", "利润"],
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: trendData.map((item) => item.date),
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => formatMoney(value),
        },
      },
      series: [
        {
          name: "销售额",
          type: "line",
          smooth: true,
          data: trendData.map((item) => item.sales),
          itemStyle: { color: "#5B8FF9" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(91, 143, 249, 0.3)" },
                { offset: 1, color: "rgba(91, 143, 249, 0.05)" },
              ],
            },
          },
        },
        {
          name: "利润",
          type: "line",
          smooth: true,
          data: trendData.map((item) => item.profit),
          itemStyle: { color: "#61DDAA" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(97, 221, 170, 0.3)" },
                { offset: 1, color: "rgba(97, 221, 170, 0.05)" },
              ],
            },
          },
        },
      ],
    };
  };

  // 区域柱状图配置
  const getRegionChartOption = () => {
    return {
      title: {
        text: "区域销售对比",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>销售额: ${formatMoney(data.value)}<br/>利润: ${formatMoney(regionData[data.dataIndex]?.profit || 0)}`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: regionData.map((item) => item.region),
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => formatMoney(value),
        },
      },
      series: [
        {
          name: "销售额",
          type: "bar",
          data: regionData.map((item) => item.sales),
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#5B8FF9" },
                { offset: 1, color: "#5B8FF980" },
              ],
            },
          },
        },
      ],
    };
  };

  // 品类饼图配置
  const getCategoryChartOption = () => {
    return {
      title: {
        text: "品类销售占比",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          return `${params.name}<br/>销售额: ${formatMoney(params.value)}<br/>占比: ${params.percent}%`;
        },
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "center",
      },
      series: [
        {
          name: "品类销售",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: categoryData.map((item) => ({
            value: item.sales,
            name: item.category,
          })),
        },
      ],
    };
  };

  // 城市排名图表配置
  const getCityRankingChartOption = () => {
    const top10 = cityRanking.slice(0, 10);
    return {
      title: {
        text: "城市销售排名 TOP10",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => formatMoney(value),
        },
      },
      yAxis: {
        type: "category",
        data: top10.map((item) => item.city).reverse(),
      },
      series: [
        {
          name: "销售额",
          type: "bar",
          data: top10.map((item) => item.sales).reverse(),
          itemStyle: {
            color: "#F6BD16",
          },
        },
      ],
    };
  };

  // 热力图配置
  const getHeatmapChartOption = () => {
    if (!heatmapData.length) return {};
    
    const categories = [...new Set(heatmapData.map((d: any) => d.category))];
    const dates = [...new Set(heatmapData.map((d: any) => d.date))].sort();
    
    const data = heatmapData.map((d: any) => [
      dates.indexOf(d.date),
      categories.indexOf(d.category),
      Math.round(d.sales / 10000)
    ]);
    
    return {
      title: {
        text: "销售热力图（万元）",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        position: "top",
        formatter: (params: any) => {
          const val = params.value[2] * 10000;
          return `${dates[params.value[0]]}<br/>${categories[params.value[1]]}<br/>销售额: ${formatMoney(val)}`;
        },
      },
      grid: {
        left: "8%",
        right: "4%",
        bottom: "15%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        splitArea: { show: true },
        axisLabel: { rotate: 45, fontSize: 10, interval: 6 },
      },
      yAxis: {
        type: "category",
        data: categories,
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: Math.max(...data.map((d: any) => d[2])),
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "2%",
        inRange: {
          color: ["#f0f5ff", "#d6e4ff", "#adc6ff", "#85a5ff", "#597ef7", "#2f54eb", "#1d39c4"],
        },
      },
      series: [{
        name: "销售热力图",
        type: "heatmap",
        data: data,
        label: { show: false },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.5)" }
        },
      }],
    };
  };

  // 堆叠面积图配置 - 品类销售趋势
  const getStackedAreaChartOption = () => {
    if (!heatmapData.length) return {};
    
    const categories = [...new Set(heatmapData.map((d: any) => d.category))];
    const dates = [...new Set(heatmapData.map((d: any) => d.date))].sort();
    
    const series = categories.map((cat) => {
      const catData = heatmapData
        .filter((d: any) => d.category === cat)
        .sort((a: any, b: any) => a.date.localeCompare(b.date));
      
      const dateMap = new Map(catData.map((d: any) => [d.date, d.sales]));
      const values = dates.map((d) => Math.round((dateMap.get(d) || 0) / 10000));
      
      return {
        name: cat,
        type: "line",
        stack: "total",
        smooth: true,
        areaStyle: { opacity: 0.6 },
        emphasis: { focus: "series" },
        data: values,
      };
    });
    
    const colors = ["#5B8FF9", "#61DDAA", "#F6BD16", "#E8684A", "#6DC8EC", "#9270CA"];
    
    return {
      title: {
        text: "品类销售趋势堆叠（万元）",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          let html = `<b>${params[0].axisValue}</b><br/>`;
          params.forEach((p: any) => {
            const val = (p.value * 10000);
            html += `${p.marker} ${p.seriesName}: ${formatMoney(val)}<br/>`;
          });
          return html;
        },
      },
      legend: {
        data: categories,
        bottom: 0,
        type: "scroll",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "20%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: { rotate: 45, fontSize: 10, interval: 6 },
      },
      yAxis: {
        type: "value",
        name: "万元",
        axisLabel: { formatter: (v: number) => `${v}万` },
      },
      series: series.map((s, i) => ({ ...s, itemStyle: { color: colors[i % colors.length] } })),
    };
  };

  // 雷达图配置
  const getRadarChartOption = () => {
    if (!regionData.length) return {};
    
    const indicators = [
      { name: "销售额", max: Math.max(...regionData.map((r) => r.sales)) * 1.2 },
      { name: "利润", max: Math.max(...regionData.map((r) => r.profit)) * 1.2 },
      { name: "订单量", max: Math.max(...regionData.map((r) => r.orders)) * 1.2 },
      { name: "城市数", max: Math.max(...regionData.map((r) => r.city_count)) * 1.2 },
    ];
    
    const colors = ["#5B8FF9", "#61DDAA", "#F6BD16", "#E8684A", "#6DC8EC", "#9270CA", "#FF6B81"];
    
    const seriesData = regionData.slice(0, 7).map((r, i) => ({
      value: [r.sales, r.profit, r.orders, r.city_count],
      name: r.region,
      areaStyle: { color: colors[i % colors.length], opacity: 0.15 },
      lineStyle: { color: colors[i % colors.length], width: 2 },
      itemStyle: { color: colors[i % colors.length] },
    }));
    
    return {
      title: {
        text: "区域多维度对比",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        formatter: (params: any) => {
          const p = params;
          let html = `<b>${p.seriesName}</b><br/>`;
          indicators.forEach((ind, i) => {
            const isCurrency = ind.name === "销售额" || ind.name === "利润";
            const value = p.value[i];
            html += `${ind.name}: ${isCurrency ? formatMoney(value) : formatNumber(Math.round(value))}<br/>`;
          });
          return html;
        },
      },
      legend: {
        data: regionData.slice(0, 7).map((r) => r.region),
        bottom: 0,
        type: "scroll",
      },
      radar: {
        indicator: indicators,
        shape: "circle",
        radius: "65%",
        center: ["50%", "50%"],
        splitNumber: 4,
        axisName: { color: "#666" },
      },
      series: [{
        type: "radar",
        data: seriesData,
        symbol: "none",
        lineStyle: { width: 2 },
      }],
    };
  };

  // ==================== 渲染 ====================

  if (loading && !summary) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-400 rounded-lg" />
            <Skeleton className="h-400 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Activity className="w-12 h-12 mx-auto text-destructive" />
              <h2 className="text-xl font-semibold">数据加载失败</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                重新加载
              </Button>
              <p className="text-xs text-muted-foreground">
                请确保后端服务已启动: python backend/app.py
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部标题栏 */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">企业销售数据可视化看板</h1>
                <p className="text-sm text-muted-foreground">
                  中小型零售企业销售监控系统
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                数据范围: {summary?.date_range?.start} ~ {summary?.date_range?.end}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                刷新
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 筛选区域 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">日期筛选:</span>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
                placeholder="开始日期"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
                placeholder="结束日期"
              />
              
              <div className="flex items-center gap-2 ml-4">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">区域:</span>
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="全部区域" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部区域</SelectItem>
                  {filters?.regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2 ml-4">
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">品类:</span>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="全部品类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部品类</SelectItem>
                  {filters?.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* KPI 卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 总销售额 */}
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总销售额</p>
                  <p className="text-2xl font-bold text-primary">
                    {summary ? formatMoney(summary.total_sales) : "--"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-500">+12.5%</span>
                    <span className="text-xs text-muted-foreground">同比</span>
                  </div>
                </div>
                <DollarSign className="w-12 h-12 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          {/* 总利润 */}
          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总利润</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary ? formatMoney(summary.total_profit) : "--"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-500">+8.3%</span>
                    <span className="text-xs text-muted-foreground">同比</span>
                  </div>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600/20" />
              </div>
            </CardContent>
          </Card>

          {/* 订单量 */}
          <Card className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950 dark:to-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">订单量</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {summary ? formatNumber(summary.total_orders) : "--"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-500">+15.2%</span>
                    <span className="text-xs text-muted-foreground">同比</span>
                  </div>
                </div>
                <Package className="w-12 h-12 text-yellow-600/20" />
              </div>
            </CardContent>
          </Card>

          {/* 利润率 */}
          <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均利润率</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {summary ? `${summary.avg_margin}%` : "--"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-500">-2.1%</span>
                    <span className="text-xs text-muted-foreground">同比</span>
                  </div>
                </div>
                <Percent className="w-12 h-12 text-purple-600/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 销售趋势图 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <LineChart className="w-5 h-5 text-primary" />
                销售趋势分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getTrendChartOption()}
                style={{ height: "350px" }}
                opts={{ renderer: "svg" }}
              />
            </CardContent>
          </Card>

          {/* 区域销售对比 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-5 h-5 text-primary" />
                区域销售对比
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getRegionChartOption()}
                style={{ height: "350px" }}
                opts={{ renderer: "svg" }}
              />
            </CardContent>
          </Card>

          {/* 品类占比 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="w-5 h-5 text-primary" />
                品类销售占比
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getCategoryChartOption()}
                style={{ height: "350px" }}
                opts={{ renderer: "svg" }}
              />
            </CardContent>
          </Card>

          {/* 城市排名 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-5 h-5 text-primary" />
                城市销售排名 TOP10
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getCityRankingChartOption()}
                style={{ height: "350px" }}
                opts={{ renderer: "svg" }}
              />
            </CardContent>
          </Card>
        </div>

        {/* 新增图表行 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 热力图 */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-5 h-5 text-primary" />
                销售热力图
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getHeatmapChartOption()}
                style={{ height: "400px" }}
                opts={{ renderer: "svg" }}
              />
            </CardContent>
          </Card>

          {/* 堆叠面积图 */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <LineChart className="w-5 h-5 text-primary" />
                品类销售趋势堆叠
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getStackedAreaChartOption()}
                style={{ height: "400px" }}
                opts={{ renderer: "svg" }}
              />
            </CardContent>
          </Card>

          {/* 雷达图 */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-5 h-5 text-primary" />
                区域多维度对比
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={getRadarChartOption()}
                style={{ height: "380px" }}
                opts={{ renderer: "svg" }}
              />
            </CardContent>
          </Card>
        </div>

        {/* 明细数据表格 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              销售明细数据
              <Badge variant="secondary" className="ml-2">
                共 {pagination.total} 条记录
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                      <div className="flex items-center gap-1">
                        日期
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>区域</TableHead>
                    <TableHead>城市</TableHead>
                    <TableHead>品类</TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("sales")}>
                      <div className="flex items-center justify-end gap-1">
                        销售额
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("profit")}>
                      <div className="flex items-center justify-end gap-1">
                        利润
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => handleSort("orders")}>
                      <div className="flex items-center justify-end gap-1">
                        订单数
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">利润率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.region}</Badge>
                      </TableCell>
                      <TableCell>{item.city}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatMoney(item.sales)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatMoney(item.profit)}
                      </TableCell>
                      <TableCell className="text-right">{item.orders}</TableCell>
                      <TableCell className="text-right">{item.margin}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                第 {pagination.page} 页，共 {pagination.total_pages} 页
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.total_pages}
                >
                  下一页
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* 底部 */}
      <footer className="bg-card border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-muted-foreground text-center">
            企业销售数据可视化看板 © 2024 | 数据模拟生成，仅供演示
          </p>
        </div>
      </footer>
    </div>
  );
}