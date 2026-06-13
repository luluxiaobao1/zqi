"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    Search,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Home,
    Users,
    Cpu,
    Bot,
    Plus,
    AlertCircle,
    X,
    Check,
    Settings,
    ExternalLink,
    User,
    LogOut,
    Building2,
    FlaskConical,
    Info,
    Sparkles,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// 用户角色类型
type UserRole = 'owner' | 'admin' | 'member';

// 角色配置
const roleConfig: Record<UserRole, { label: string; bgColor: string }> = {
    owner: { label: '主账号', bgColor: 'bg-blue-500' },
    admin: { label: '管理员', bgColor: 'bg-orange-500' },
    member: { label: '成员', bgColor: 'bg-green-500' },
};

// 场景类型定义
type ScenarioType = 'no-package' | 'package-valid-sufficient' | 'package-exhausted' | 'package-expired';

// 场景配置
const scenarioConfig: Record<ScenarioType, { label: string; desc: string; color: string }> = {
    'no-package': { label: '未购买套餐', desc: '企业尚未购买任何套餐', color: 'bg-gray-500' },
    'package-valid-sufficient': { label: '套餐有效·配额充足', desc: '套餐有效期内，配额余量充足', color: 'bg-green-500' },
    'package-exhausted': { label: '套餐有效·余额已用尽', desc: '成员数或龙虾个数或金额已用尽', color: 'bg-orange-500' },
    'package-expired': { label: '套餐已过期', desc: '套餐已过期，请及时续费', color: 'bg-red-500' },
};

// 管理后台左侧菜单项
const adminMenuItems = [
    { id: "overview", name: "概览", icon: Home },
    { id: "members", name: "成员管理", icon: Users },
    { id: "models", name: "大模型管理", icon: Cpu },
    { id: "lobster", name: "龙虾管理", icon: Bot },
];

// 预设企业列表
const enterpriseList = [
    { 
        id: 1, 
        name: "张三", 
        icon: "企", 
        role: 'owner' as UserRole,
        active: true,
    },
    { 
        id: 2, 
        name: "李四", 
        icon: "企", 
        role: 'admin' as UserRole,
        active: false,
    },
    { 
        id: 3, 
        name: "王五", 
        icon: "企", 
        role: 'member' as UserRole,
        active: false,
    },
];

// 模拟数据 - 成员列表
const mockMembers = [
    { id: 'zhangsan', name: '张三', email: 'zhangsan@360.cn', role: 'owner', callsUsed: 52340, callsTotal: 100000, tokensUsed: 1200000, tokensTotal: 2000000, amountUsed: 120.00, amountTotal: 200.00 },
    { id: 'lisi', name: '李四', email: 'lisi@360.cn', role: 'admin', callsUsed: 38920, callsTotal: 50000, tokensUsed: 856000, tokensTotal: 1000000, amountUsed: 85.60, amountTotal: 100.00 },
    { id: 'wangwu', name: '王五', email: 'wangwu@360.cn', role: 'member', callsUsed: 28450, callsTotal: 30000, tokensUsed: 420000, tokensTotal: 500000, amountUsed: 42.00, amountTotal: 50.00 },
    { id: 'zhaoliu', name: '赵六', email: 'zhaoliu@360.cn', role: 'member', callsUsed: 12680, callsTotal: 30000, tokensUsed: 180000, tokensTotal: 500000, amountUsed: 18.00, amountTotal: 50.00 },
    { id: 'sunqi', name: '孙七', email: 'sunqi@360.cn', role: 'member', callsUsed: 5200, callsTotal: 20000, tokensUsed: 85000, tokensTotal: 200000, amountUsed: 8.50, amountTotal: 20.00 },
    { id: 'zhouba', name: '周八', email: 'zhouba@360.cn', role: 'member', callsUsed: 0, callsTotal: 50000, tokensUsed: 0, tokensTotal: 500000, amountUsed: 0, amountTotal: 0 },
    { id: 'zhengshi', name: '郑十', email: 'zhengshi@360.cn', role: 'member', callsUsed: 15680, callsTotal: 30000, tokensUsed: 230000, tokensTotal: 500000, amountUsed: 23.00, amountTotal: 0 },
];

// 模拟数据 - 可添加成员列表
const mockAvailableMembers = [
    { id: 'zhouba', name: '周八', email: 'zhouba@360.cn' },
    { id: 'wujiu', name: '吴九', email: 'wujiu@360.cn' },
    { id: 'zhengshi', name: '郑十', email: 'zhengshi@360.cn' },
];

// 统计数据类型
type StatsData = {
    activeMembers: { count: number; total: number; overQuota: number };
    lobsters: { normal: number; total: number };
    calls: { count: number; trend: string };
    tokens: { count: number; daily: number };
    consumption: { amount: number; daily: number; trend: string };
    memberRanking: Array<{
        rank: number;
        name: string;
        role: string;
        tokensUsed: number;
        tokensQuota: number;
        percentage: number;
        trend: string;
        amount?: number;
    }>;
    modelRanking: Array<{
        rank: number;
        name: string;
        amount: number;
        percentage: number;
        trend: string;
    }>;
    lobsterRanking: Array<{
        rank: number;
        name: string;
        creator: string;
        status: 'normal' | 'abnormal';
        amount: number;
        percentage: number;
        trend: string;
    }>;
};

// 不同时间范围的统计数据
const statsByDateRange: Record<string, StatsData> = {
    today: {
        activeMembers: { count: 8, total: 10, overQuota: 2 },
        lobsters: { normal: 12, total: 15 },
        calls: { count: 12847, trend: "+12.5%" },
        tokens: { count: 1200000, daily: 1200000 },
        consumption: { amount: 128.47, daily: 128.47, trend: "+12.5%" },
        memberRanking: [
            { rank: 1, name: "张三", role: "主账号", tokensUsed: 523400, tokensQuota: 1000000, percentage: 26.5, trend: "↑ 15.2%", amount: 52.34 },
            { rank: 2, name: "李四", role: "管理员", tokensUsed: 389200, tokensQuota: 800000, percentage: 19.7, trend: "↑ 8.7%", amount: 38.92 },
            { rank: 3, name: "王五", role: "成员", tokensUsed: 184500, tokensQuota: 500000, percentage: 9.3, trend: "↓ 3.2%", amount: 18.45 },
            { rank: 4, name: "赵六", role: "成员", tokensUsed: 126800, tokensQuota: 500000, percentage: 6.4, trend: "↑ 5.1%", amount: 12.68 },
            { rank: 5, name: "孙七", role: "成员", tokensUsed: 60800, tokensQuota: 300000, percentage: 3.1, trend: "↑ 2.3%", amount: 6.08 },
            { rank: 6, name: "周八", role: "成员", tokensUsed: 55200, tokensQuota: 300000, percentage: 2.8, trend: "↑ 1.9%", amount: 5.52 },
            { rank: 7, name: "吴九", role: "成员", tokensUsed: 48600, tokensQuota: 250000, percentage: 2.5, trend: "↓ 0.8%", amount: 4.86 },
            { rank: 8, name: "郑十", role: "成员", tokensUsed: 42300, tokensQuota: 200000, percentage: 2.1, trend: "↑ 3.2%", amount: 4.23 },
            { rank: 9, name: "陈一", role: "成员", tokensUsed: 38900, tokensQuota: 200000, percentage: 2.0, trend: "↑ 1.5%", amount: 3.89 },
            { rank: 10, name: "林二", role: "成员", tokensUsed: 35600, tokensQuota: 150000, percentage: 1.8, trend: "↓ 0.5%", amount: 3.56 },
            { rank: 11, name: "黄三", role: "成员", tokensUsed: 31200, tokensQuota: 150000, percentage: 1.6, trend: "↑ 2.1%", amount: 3.12 },
            { rank: 12, name: "刘四", role: "成员", tokensUsed: 27800, tokensQuota: 120000, percentage: 1.4, trend: "↑ 0.9%", amount: 2.78 },
            { rank: 13, name: "杨五", role: "成员", tokensUsed: 24500, tokensQuota: 100000, percentage: 1.2, trend: "↓ 1.2%", amount: 2.45 },
            { rank: 14, name: "赵六", role: "成员", tokensUsed: 21200, tokensQuota: 100000, percentage: 1.1, trend: "↑ 0.6%", amount: 2.12 },
            { rank: 15, name: "钱七", role: "成员", tokensUsed: 18900, tokensQuota: 80000, percentage: 1.0, trend: "↑ 0.4%", amount: 1.89 },
        ],
        modelRanking: [
            { rank: 1, name: "GPT-4o", amount: 52.34, percentage: 26.5, trend: "↑ 12.5%" },
            { rank: 2, name: "Claude-3.5", amount: 38.92, percentage: 19.7, trend: "↑ 8.3%" },
            { rank: 3, name: "DeepSeek-V3", amount: 18.45, percentage: 9.3, trend: "↓ 2.1%" },
            { rank: 4, name: "Qwen-Max", amount: 12.68, percentage: 6.4, trend: "↑ 5.2%" },
            { rank: 5, name: "GLM-4", amount: 6.08, percentage: 3.1, trend: "↑ 1.8%" },
            { rank: 6, name: "GPT-3.5-Turbo", amount: 5.52, percentage: 2.8, trend: "↑ 3.2%" },
            { rank: 7, name: "Gemini-Pro", amount: 4.86, percentage: 2.5, trend: "↓ 0.5%" },
            { rank: 8, name: "Llama-3.1", amount: 4.23, percentage: 2.1, trend: "↑ 4.1%" },
            { rank: 9, name: "Moonshot-V1", amount: 3.89, percentage: 2.0, trend: "↑ 2.3%" },
            { rank: 10, name: "Yi-Large", amount: 3.56, percentage: 1.8, trend: "↑ 1.5%" },
            { rank: 11, name: "Baichuan-4", amount: 3.12, percentage: 1.6, trend: "↓ 0.3%" },
            { rank: 12, name: "Spark-V3", amount: 2.78, percentage: 1.4, trend: "↑ 0.8%" },
            { rank: 13, name: "Hunyuan", amount: 2.45, percentage: 1.2, trend: "↑ 0.6%" },
            { rank: 14, name: "Doubao-Pro", amount: 2.12, percentage: 1.1, trend: "↑ 0.5%" },
            { rank: 15, name: "Minimax", amount: 1.89, percentage: 1.0, trend: "↓ 0.2%" },
        ],
        lobsterRanking: [
            { rank: 1, name: "生产环境龙虾", creator: "张三", status: "normal", amount: 45.20, percentage: 22.9, trend: "↑ 10.5%" },
            { rank: 2, name: "测试环境龙虾", creator: "李四", status: "normal", amount: 32.80, percentage: 16.6, trend: "↑ 6.2%" },
            { rank: 3, name: "开发调试龙虾", creator: "王五", status: "abnormal", amount: 28.50, percentage: 14.4, trend: "↓ 3.1%" },
            { rank: 4, name: "数据分析龙虾", creator: "赵六", status: "normal", amount: 15.30, percentage: 7.7, trend: "↑ 4.8%" },
            { rank: 5, name: "客服助手龙虾", creator: "孙七", status: "normal", amount: 6.67, percentage: 3.4, trend: "↑ 2.1%" },
            { rank: 6, name: "智能推荐龙虾", creator: "周八", status: "normal", amount: 5.82, percentage: 2.9, trend: "↑ 1.8%" },
            { rank: 7, name: "内容审核龙虾", creator: "吴九", status: "normal", amount: 4.95, percentage: 2.5, trend: "↓ 0.6%" },
            { rank: 8, name: "文档处理龙虾", creator: "郑十", status: "normal", amount: 4.28, percentage: 2.2, trend: "↑ 2.5%" },
            { rank: 9, name: "智能问答龙虾", creator: "陈一", status: "normal", amount: 3.92, percentage: 2.0, trend: "↑ 1.2%" },
            { rank: 10, name: "代码助手龙虾", creator: "林二", status: "abnormal", amount: 3.56, percentage: 1.8, trend: "↑ 0.9%" },
            { rank: 11, name: "翻译服务龙虾", creator: "黄三", status: "normal", amount: 3.18, percentage: 1.6, trend: "↓ 0.4%" },
            { rank: 12, name: "摘要生成龙虾", creator: "刘四", status: "normal", amount: 2.82, percentage: 1.4, trend: "↑ 0.7%" },
            { rank: 13, name: "图像识别龙虾", creator: "杨五", status: "normal", amount: 2.45, percentage: 1.2, trend: "↑ 0.5%" },
            { rank: 14, name: "语音转写龙虾", creator: "赵六", status: "normal", amount: 2.15, percentage: 1.1, trend: "↑ 0.3%" },
            { rank: 15, name: "情感分析龙虾", creator: "钱七", status: "normal", amount: 1.88, percentage: 1.0, trend: "↓ 0.1%" },
        ],
    },
    "7days": {
        activeMembers: { count: 9, total: 10, overQuota: 3 },
        lobsters: { normal: 11, total: 15 },
        calls: { count: 89234, trend: "+8.3%" },
        tokens: { count: 8500000, daily: 1200000 },
        consumption: { amount: 892.34, daily: 127.48, trend: "+8.3%" },
        memberRanking: [
            { rank: 1, name: "张三", role: "主账号", tokensUsed: 3680000, tokensQuota: 5000000, percentage: 27.1, trend: "↑ 12.1%", amount: 368.00 },
            { rank: 2, name: "李四", role: "管理员", tokensUsed: 2730000, tokensQuota: 4000000, percentage: 20.1, trend: "↑ 6.8%", amount: 273.00 },
            { rank: 3, name: "王五", role: "成员", tokensUsed: 1290000, tokensQuota: 2500000, percentage: 9.5, trend: "↓ 1.9%", amount: 129.50 },
            { rank: 4, name: "赵六", role: "成员", tokensUsed: 887600, tokensQuota: 2000000, percentage: 6.5, trend: "↑ 4.2%", amount: 88.76 },
            { rank: 5, name: "孙七", role: "成员", tokensUsed: 339900, tokensQuota: 1500000, percentage: 2.5, trend: "↑ 1.5%", amount: 33.99 },
            { rank: 6, name: "周八", role: "成员", tokensUsed: 298500, tokensQuota: 1200000, percentage: 2.2, trend: "↑ 2.1%", amount: 29.85 },
            { rank: 7, name: "吴九", role: "成员", tokensUsed: 256800, tokensQuota: 1000000, percentage: 1.9, trend: "↓ 0.6%", amount: 25.68 },
            { rank: 8, name: "郑十", role: "成员", tokensUsed: 215600, tokensQuota: 900000, percentage: 1.6, trend: "↑ 1.8%", amount: 21.56 },
            { rank: 9, name: "陈一", role: "成员", tokensUsed: 189300, tokensQuota: 800000, percentage: 1.4, trend: "↑ 0.9%", amount: 18.93 },
            { rank: 10, name: "林二", role: "成员", tokensUsed: 165800, tokensQuota: 700000, percentage: 1.2, trend: "↓ 0.3%", amount: 16.58 },
            { rank: 11, name: "黄三", role: "成员", tokensUsed: 142500, tokensQuota: 600000, percentage: 1.0, trend: "↑ 1.2%", amount: 14.25 },
            { rank: 12, name: "刘四", role: "成员", tokensUsed: 118900, tokensQuota: 500000, percentage: 0.9, trend: "↑ 0.5%", amount: 11.89 },
            { rank: 13, name: "杨五", role: "成员", tokensUsed: 95600, tokensQuota: 400000, percentage: 0.7, trend: "↓ 0.2%", amount: 9.56 },
            { rank: 14, name: "赵六", role: "成员", tokensUsed: 72800, tokensQuota: 300000, percentage: 0.5, trend: "↑ 0.3%", amount: 7.28 },
            { rank: 15, name: "钱七", role: "成员", tokensUsed: 51300, tokensQuota: 200000, percentage: 0.4, trend: "↑ 0.1%", amount: 5.13 },
        ],
        modelRanking: [
            { rank: 1, name: "GPT-4o", amount: 368.00, percentage: 27.1, trend: "↑ 15.3%" },
            { rank: 2, name: "Claude-3.5", amount: 273.00, percentage: 20.1, trend: "↑ 9.2%" },
            { rank: 3, name: "DeepSeek-V3", amount: 129.50, percentage: 9.5, trend: "↓ 1.5%" },
            { rank: 4, name: "Qwen-Max", amount: 88.76, percentage: 6.5, trend: "↑ 5.8%" },
            { rank: 5, name: "GLM-4", amount: 33.08, percentage: 2.4, trend: "↑ 2.2%" },
            { rank: 6, name: "GPT-3.5-Turbo", amount: 29.85, percentage: 2.2, trend: "↑ 3.5%" },
            { rank: 7, name: "Gemini-Pro", amount: 25.68, percentage: 1.9, trend: "↓ 0.8%" },
            { rank: 8, name: "Llama-3.1", amount: 21.56, percentage: 1.6, trend: "↑ 4.2%" },
            { rank: 9, name: "Moonshot-V1", amount: 18.93, percentage: 1.4, trend: "↑ 2.6%" },
            { rank: 10, name: "Yi-Large", amount: 16.58, percentage: 1.2, trend: "↑ 1.8%" },
            { rank: 11, name: "Baichuan-4", amount: 14.25, percentage: 1.0, trend: "↓ 0.5%" },
            { rank: 12, name: "Spark-V3", amount: 11.89, percentage: 0.9, trend: "↑ 1.1%" },
            { rank: 13, name: "Hunyuan", amount: 9.56, percentage: 0.7, trend: "↑ 0.8%" },
            { rank: 14, name: "Doubao-Pro", amount: 7.28, percentage: 0.5, trend: "↑ 0.6%" },
            { rank: 15, name: "Minimax", amount: 5.13, percentage: 0.4, trend: "↓ 0.1%" },
        ],
        lobsterRanking: [
            { rank: 1, name: "生产环境龙虾", creator: "张三", status: "normal", amount: 312.50, percentage: 23.0, trend: "↑ 11.2%" },
            { rank: 2, name: "测试环境龙虾", creator: "李四", status: "normal", amount: 228.30, percentage: 16.8, trend: "↑ 7.5%" },
            { rank: 3, name: "开发调试龙虾", creator: "王五", status: "abnormal", amount: 198.20, percentage: 14.6, trend: "↓ 2.8%" },
            { rank: 4, name: "数据分析龙虾", creator: "赵六", status: "normal", amount: 106.50, percentage: 7.8, trend: "↑ 5.1%" },
            { rank: 5, name: "客服助手龙虾", creator: "孙七", status: "normal", amount: 46.84, percentage: 3.4, trend: "↑ 3.2%" },
            { rank: 6, name: "智能推荐龙虾", creator: "周八", status: "normal", amount: 38.52, percentage: 2.8, trend: "↑ 2.3%" },
            { rank: 7, name: "内容审核龙虾", creator: "吴九", status: "normal", amount: 32.15, percentage: 2.4, trend: "↓ 0.9%" },
            { rank: 8, name: "文档处理龙虾", creator: "郑十", status: "normal", amount: 27.86, percentage: 2.0, trend: "↑ 3.1%" },
            { rank: 9, name: "智能问答龙虾", creator: "陈一", status: "normal", amount: 24.52, percentage: 1.8, trend: "↑ 1.5%" },
            { rank: 10, name: "代码助手龙虾", creator: "林二", status: "abnormal", amount: 21.38, percentage: 1.6, trend: "↑ 1.2%" },
            { rank: 11, name: "翻译服务龙虾", creator: "黄三", status: "normal", amount: 18.65, percentage: 1.4, trend: "↓ 0.6%" },
            { rank: 12, name: "摘要生成龙虾", creator: "刘四", status: "normal", amount: 15.92, percentage: 1.2, trend: "↑ 0.9%" },
            { rank: 13, name: "图像识别龙虾", creator: "杨五", status: "normal", amount: 13.28, percentage: 1.0, trend: "↑ 0.7%" },
            { rank: 14, name: "语音转写龙虾", creator: "赵六", status: "normal", amount: 10.56, percentage: 0.8, trend: "↑ 0.4%" },
            { rank: 15, name: "情感分析龙虾", creator: "钱七", status: "normal", amount: 8.12, percentage: 0.6, trend: "↓ 0.2%" },
        ],
    },
    "30days": {
        activeMembers: { count: 10, total: 10, overQuota: 3 },
        lobsters: { normal: 10, total: 15 },
        calls: { count: 356789, trend: "+15.6%" },
        tokens: { count: 35200000, daily: 1170000 },
        consumption: { amount: 3567.89, daily: 118.93, trend: "+15.6%" },
        memberRanking: [
            { rank: 1, name: "张三", role: "主账号", tokensUsed: 15700000, tokensQuota: 20000000, percentage: 28.0, trend: "↑ 18.3%", amount: 1570.00 },
            { rank: 2, name: "李四", role: "管理员", tokensUsed: 10700000, tokensQuota: 15000000, percentage: 19.1, trend: "↑ 10.2%", amount: 1070.00 },
            { rank: 3, name: "王五", role: "成员", tokensUsed: 4640000, tokensQuota: 10000000, percentage: 8.3, trend: "↓ 2.1%", amount: 464.00 },
            { rank: 4, name: "赵六", role: "成员", tokensUsed: 3210000, tokensQuota: 8000000, percentage: 5.7, trend: "↑ 5.8%", amount: 321.00 },
            { rank: 5, name: "孙七", role: "成员", tokensUsed: 1450000, tokensQuota: 6000000, percentage: 2.6, trend: "↑ 2.9%", amount: 145.00 },
            { rank: 6, name: "周八", role: "成员", tokensUsed: 1285000, tokensQuota: 5000000, percentage: 2.3, trend: "↑ 3.2%", amount: 128.50 },
            { rank: 7, name: "吴九", role: "成员", tokensUsed: 1126000, tokensQuota: 4500000, percentage: 2.0, trend: "↓ 0.8%", amount: 112.60 },
            { rank: 8, name: "郑十", role: "成员", tokensUsed: 985600, tokensQuota: 4000000, percentage: 1.8, trend: "↑ 2.5%", amount: 98.56 },
            { rank: 9, name: "陈一", role: "成员", tokensUsed: 862300, tokensQuota: 3500000, percentage: 1.5, trend: "↑ 1.3%", amount: 86.23 },
            { rank: 10, name: "林二", role: "成员", tokensUsed: 756800, tokensQuota: 3000000, percentage: 1.4, trend: "↓ 0.4%", amount: 75.68 },
            { rank: 11, name: "黄三", role: "成员", tokensUsed: 652100, tokensQuota: 2800000, percentage: 1.2, trend: "↑ 1.6%", amount: 65.21 },
            { rank: 12, name: "刘四", role: "成员", tokensUsed: 548900, tokensQuota: 2500000, percentage: 1.0, trend: "↑ 0.8%", amount: 54.89 },
            { rank: 13, name: "杨五", role: "成员", tokensUsed: 446200, tokensQuota: 2000000, percentage: 0.8, trend: "↓ 0.3%", amount: 44.62 },
            { rank: 14, name: "赵六", role: "成员", tokensUsed: 344800, tokensQuota: 1500000, percentage: 0.6, trend: "↑ 0.5%", amount: 34.48 },
            { rank: 15, name: "钱七", role: "成员", tokensUsed: 243500, tokensQuota: 1000000, percentage: 0.4, trend: "↑ 0.2%", amount: 24.35 },
        ],
        modelRanking: [
            { rank: 1, name: "GPT-4o", amount: 1570.00, percentage: 28.0, trend: "↑ 16.8%" },
            { rank: 2, name: "Claude-3.5", amount: 1070.00, percentage: 19.1, trend: "↑ 11.5%" },
            { rank: 3, name: "DeepSeek-V3", amount: 464.00, percentage: 8.3, trend: "↓ 1.8%" },
            { rank: 4, name: "Qwen-Max", amount: 321.00, percentage: 5.7, trend: "↑ 6.2%" },
            { rank: 5, name: "GLM-4", amount: 142.89, percentage: 2.6, trend: "↑ 3.5%" },
            { rank: 6, name: "GPT-3.5-Turbo", amount: 128.50, percentage: 2.3, trend: "↑ 4.5%" },
            { rank: 7, name: "Gemini-Pro", amount: 112.60, percentage: 2.0, trend: "↓ 1.2%" },
            { rank: 8, name: "Llama-3.1", amount: 98.56, percentage: 1.8, trend: "↑ 5.2%" },
            { rank: 9, name: "Moonshot-V1", amount: 86.23, percentage: 1.5, trend: "↑ 3.1%" },
            { rank: 10, name: "Yi-Large", amount: 75.68, percentage: 1.4, trend: "↑ 2.3%" },
            { rank: 11, name: "Baichuan-4", amount: 65.21, percentage: 1.2, trend: "↓ 0.8%" },
            { rank: 12, name: "Spark-V3", amount: 54.89, percentage: 1.0, trend: "↑ 1.5%" },
            { rank: 13, name: "Hunyuan", amount: 44.62, percentage: 0.8, trend: "↑ 1.1%" },
            { rank: 14, name: "Doubao-Pro", amount: 34.48, percentage: 0.6, trend: "↑ 0.8%" },
            { rank: 15, name: "Minimax", amount: 24.35, percentage: 0.4, trend: "↓ 0.2%" },
        ],
        lobsterRanking: [
            { rank: 1, name: "生产环境龙虾", creator: "张三", status: "normal", amount: 1248.50, percentage: 22.0, trend: "↑ 12.5%" },
            { rank: 2, name: "测试环境龙虾", creator: "李四", status: "normal", amount: 912.30, percentage: 16.1, trend: "↑ 8.8%" },
            { rank: 3, name: "开发调试龙虾", creator: "王五", status: "abnormal", amount: 792.20, percentage: 14.0, trend: "↓ 1.5%" },
            { rank: 4, name: "数据分析龙虾", creator: "赵六", status: "normal", amount: 425.80, percentage: 7.5, trend: "↑ 5.8%" },
            { rank: 5, name: "客服助手龙虾", creator: "孙七", status: "normal", amount: 189.09, percentage: 3.3, trend: "↑ 3.2%" },
            { rank: 6, name: "智能推荐龙虾", creator: "周八", status: "normal", amount: 165.82, percentage: 2.9, trend: "↑ 2.8%" },
            { rank: 7, name: "内容审核龙虾", creator: "吴九", status: "normal", amount: 142.56, percentage: 2.5, trend: "↓ 1.1%" },
            { rank: 8, name: "文档处理龙虾", creator: "郑十", status: "normal", amount: 118.95, percentage: 2.1, trend: "↑ 3.8%" },
            { rank: 9, name: "智能问答龙虾", creator: "陈一", status: "normal", amount: 98.62, percentage: 1.7, trend: "↑ 2.1%" },
            { rank: 10, name: "代码助手龙虾", creator: "林二", status: "abnormal", amount: 85.38, percentage: 1.5, trend: "↑ 1.5%" },
            { rank: 11, name: "翻译服务龙虾", creator: "黄三", status: "normal", amount: 72.65, percentage: 1.3, trend: "↓ 0.7%" },
            { rank: 12, name: "摘要生成龙虾", creator: "刘四", status: "normal", amount: 61.92, percentage: 1.1, trend: "↑ 1.2%" },
            { rank: 13, name: "图像识别龙虾", creator: "杨五", status: "normal", amount: 52.28, percentage: 0.9, trend: "↑ 0.9%" },
            { rank: 14, name: "语音转写龙虾", creator: "赵六", status: "normal", amount: 42.56, percentage: 0.7, trend: "↑ 0.6%" },
            { rank: 15, name: "情感分析龙虾", creator: "钱七", status: "normal", amount: 33.12, percentage: 0.6, trend: "↓ 0.3%" },
        ],
    },
    month: {
        activeMembers: { count: 10, total: 10, overQuota: 4 },
        lobsters: { normal: 11, total: 15 },
        calls: { count: 423567, trend: "+18.2%" },
        tokens: { count: 42100000, daily: 1400000 },
        consumption: { amount: 4235.67, daily: 141.19, trend: "+18.2%" },
        memberRanking: [
            { rank: 1, name: "张三", role: "主账号", tokensUsed: 18700000, tokensQuota: 25000000, percentage: 27.8, trend: "↑ 20.1%", amount: 1870.00 },
            { rank: 2, name: "李四", role: "管理员", tokensUsed: 12700000, tokensQuota: 18000000, percentage: 18.9, trend: "↑ 11.5%", amount: 1270.00 },
            { rank: 3, name: "王五", role: "成员", tokensUsed: 5510000, tokensQuota: 12000000, percentage: 8.2, trend: "↓ 1.8%", amount: 551.00 },
            { rank: 4, name: "赵六", role: "成员", tokensUsed: 3810000, tokensQuota: 10000000, percentage: 5.7, trend: "↑ 6.3%", amount: 381.00 },
            { rank: 5, name: "孙七", role: "成员", tokensUsed: 1650000, tokensQuota: 8000000, percentage: 2.5, trend: "↑ 3.1%", amount: 165.00 },
            { rank: 6, name: "周八", role: "成员", tokensUsed: 1526000, tokensQuota: 7000000, percentage: 2.3, trend: "↑ 3.8%", amount: 152.60 },
            { rank: 7, name: "吴九", role: "成员", tokensUsed: 1385000, tokensQuota: 6000000, percentage: 2.1, trend: "↓ 1.0%", amount: 138.50 },
            { rank: 8, name: "郑十", role: "成员", tokensUsed: 1189600, tokensQuota: 5500000, percentage: 1.8, trend: "↑ 2.8%", amount: 118.96 },
            { rank: 9, name: "陈一", role: "成员", tokensUsed: 1052300, tokensQuota: 5000000, percentage: 1.6, trend: "↑ 1.6%", amount: 105.23 },
            { rank: 10, name: "林二", role: "成员", tokensUsed: 925800, tokensQuota: 4500000, percentage: 1.4, trend: "↓ 0.5%", amount: 92.58 },
            { rank: 11, name: "黄三", role: "成员", tokensUsed: 798500, tokensQuota: 4000000, percentage: 1.2, trend: "↑ 1.9%", amount: 79.85 },
            { rank: 12, name: "刘四", role: "成员", tokensUsed: 671200, tokensQuota: 3500000, percentage: 1.0, trend: "↑ 1.0%", amount: 67.12 },
            { rank: 13, name: "杨五", role: "成员", tokensUsed: 544600, tokensQuota: 3000000, percentage: 0.8, trend: "↓ 0.4%", amount: 54.46 },
            { rank: 14, name: "赵六", role: "成员", tokensUsed: 418200, tokensQuota: 2500000, percentage: 0.6, trend: "↑ 0.6%", amount: 41.82 },
            { rank: 15, name: "钱七", role: "成员", tokensUsed: 292500, tokensQuota: 2000000, percentage: 0.4, trend: "↑ 0.3%", amount: 29.25 },
        ],
        modelRanking: [
            { rank: 1, name: "GPT-4o", amount: 1870.00, percentage: 27.8, trend: "↑ 18.5%" },
            { rank: 2, name: "Claude-3.5", amount: 1270.00, percentage: 18.9, trend: "↑ 12.8%" },
            { rank: 3, name: "DeepSeek-V3", amount: 551.00, percentage: 8.2, trend: "↓ 1.2%" },
            { rank: 4, name: "Qwen-Max", amount: 381.00, percentage: 5.7, trend: "↑ 7.1%" },
            { rank: 5, name: "GLM-4", amount: 163.67, percentage: 2.4, trend: "↑ 4.2%" },
            { rank: 6, name: "GPT-3.5-Turbo", amount: 152.60, percentage: 2.3, trend: "↑ 5.2%" },
            { rank: 7, name: "Gemini-Pro", amount: 138.50, percentage: 2.1, trend: "↓ 1.5%" },
            { rank: 8, name: "Llama-3.1", amount: 118.96, percentage: 1.8, trend: "↑ 5.8%" },
            { rank: 9, name: "Moonshot-V1", amount: 105.23, percentage: 1.6, trend: "↑ 3.5%" },
            { rank: 10, name: "Yi-Large", amount: 92.58, percentage: 1.4, trend: "↑ 2.8%" },
            { rank: 11, name: "Baichuan-4", amount: 79.85, percentage: 1.2, trend: "↓ 1.0%" },
            { rank: 12, name: "Spark-V3", amount: 67.12, percentage: 1.0, trend: "↑ 1.8%" },
            { rank: 13, name: "Hunyuan", amount: 54.46, percentage: 0.8, trend: "↑ 1.3%" },
            { rank: 14, name: "Doubao-Pro", amount: 41.82, percentage: 0.6, trend: "↑ 1.0%" },
            { rank: 15, name: "Minimax", amount: 29.25, percentage: 0.4, trend: "↓ 0.3%" },
        ],
        lobsterRanking: [
            { rank: 1, name: "生产环境龙虾", creator: "张三", status: "normal", amount: 1482.50, percentage: 21.8, trend: "↑ 14.2%" },
            { rank: 2, name: "测试环境龙虾", creator: "李四", status: "normal", amount: 1084.30, percentage: 15.9, trend: "↑ 10.5%" },
            { rank: 3, name: "开发调试龙虾", creator: "王五", status: "abnormal", amount: 940.20, percentage: 13.8, trend: "↓ 0.8%" },
            { rank: 4, name: "数据分析龙虾", creator: "赵六", status: "normal", amount: 505.17, percentage: 7.4, trend: "↑ 6.8%" },
            { rank: 5, name: "客服助手龙虾", creator: "孙七", status: "normal", amount: 223.50, percentage: 3.3, trend: "↑ 4.1%" },
            { rank: 6, name: "智能推荐龙虾", creator: "周八", status: "normal", amount: 198.62, percentage: 2.9, trend: "↑ 3.2%" },
            { rank: 7, name: "内容审核龙虾", creator: "吴九", status: "normal", amount: 175.38, percentage: 2.6, trend: "↓ 1.3%" },
            { rank: 8, name: "文档处理龙虾", creator: "郑十", status: "normal", amount: 148.95, percentage: 2.2, trend: "↑ 4.2%" },
            { rank: 9, name: "智能问答龙虾", creator: "陈一", status: "normal", amount: 125.62, percentage: 1.8, trend: "↑ 2.5%" },
            { rank: 10, name: "代码助手龙虾", creator: "林二", status: "abnormal", amount: 108.38, percentage: 1.6, trend: "↑ 1.8%" },
            { rank: 11, name: "翻译服务龙虾", creator: "黄三", status: "normal", amount: 92.65, percentage: 1.4, trend: "↓ 0.8%" },
            { rank: 12, name: "摘要生成龙虾", creator: "刘四", status: "normal", amount: 78.92, percentage: 1.2, trend: "↑ 1.5%" },
            { rank: 13, name: "图像识别龙虾", creator: "杨五", status: "normal", amount: 65.28, percentage: 1.0, trend: "↑ 1.1%" },
            { rank: 14, name: "语音转写龙虾", creator: "赵六", status: "normal", amount: 52.56, percentage: 0.8, trend: "↑ 0.8%" },
            { rank: 15, name: "情感分析龙虾", creator: "钱七", status: "normal", amount: 41.12, percentage: 0.6, trend: "↓ 0.4%" },
        ],
    },
};

function EnterpriseAdminContent() {
    const searchParams = useSearchParams();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string>("overview");
    const [dialogOpen, setDialogOpen] = useState(false);
    
    // 企业切换相关
    const [selectedEnterprise, setSelectedEnterprise] = useState(enterpriseList[0]);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    
    // 用户菜单
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [username, setUsername] = useState('未登录');
    
    // 初始化时从localStorage读取用户信息（使用zhiqi登录态）
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('zhiqi_logged_in');
        if (!isLoggedIn) {
            // 未登录，跳转到登录页
            window.location.href = '/zhiqi/login';
            return;
        }
        const userInfoStr = localStorage.getItem('zhiqi_user_info');
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                // 优先显示账号，其次名称，最后手机号
                setUsername(userInfo.account || userInfo.name || userInfo.phone || '用户');
            } catch (e) {
                setUsername('用户');
            }
        }
    }, []);
    
    // 统计日期范围
    const [statsDateRange, setStatsDateRange] = useState("today");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    
    // 配额编辑弹窗
    const [quotaEditOpen, setQuotaEditOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<{
        id: string;
        name: string;
        email: string;
        callsUsed: number;
        callsTotal: number;
        tokensUsed: number;
        tokensTotal: number;
        amountUsed: number;
        amountTotal: number;
    } | null>(null);
    const [tempCallsQuota, setTempCallsQuota] = useState("");
    const [tempTokensQuota, setTempTokensQuota] = useState("");
    const [tempAmountQuota, setTempAmountQuota] = useState("");
    
    // 添加成员弹窗
    const [addMemberDrawerOpen, setAddMemberDrawerOpen] = useState(false);
    const [selectedAddMember, setSelectedAddMember] = useState<{ id: string; name: string; email: string } | null>(null);
    const [memberSearchKeyword, setMemberSearchKeyword] = useState("");
    const [newMemberCallsQuota, setNewMemberCallsQuota] = useState("");
    const [newMemberTokensQuota, setNewMemberTokensQuota] = useState("");
    const [members, setMembers] = useState(mockMembers);
    
    // 成员多选状态
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    const isAllSelected = selectedMemberIds.length === members.length && members.length > 0;
    const isPartialSelected = selectedMemberIds.length > 0 && selectedMemberIds.length < members.length;
    
    // 批量设置配额弹窗
    const [batchQuotaDialogOpen, setBatchQuotaDialogOpen] = useState(false);
    const [batchQuotaValue, setBatchQuotaValue] = useState("");

    // 消费TOP抽屉状态
    const [consumptionDrawerOpen, setConsumptionDrawerOpen] = useState(false);
    const [consumptionDrawerTab, setConsumptionDrawerTab] = useState<'member' | 'model' | 'lobster'>('member');

    // 场景切换状态（仅在张三企业下生效）
    const [currentScenario, setCurrentScenario] = useState<ScenarioType>('package-valid-sufficient');
    const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false);
    
    // 拖动按钮位置状态
    const [buttonPosition, setButtonPosition] = useState({ x: 16, y: 60 }); // 默认右上角
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    // 拖动处理
    const handleDragStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const rect = (e.target as HTMLElement).closest('button')?.getBoundingClientRect();
        if (rect) {
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };
    
    const handleDragMove = React.useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x));
        const newY = Math.max(50, Math.min(window.innerHeight - 50, e.clientY - dragOffset.y));
        setButtonPosition({ x: newX, y: newY });
    }, [isDragging, dragOffset]);
    
    const handleDragEnd = React.useCallback(() => {
        setIsDragging(false);
    }, []);
    
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);
    
    // 当前套餐模块展开状态
    const [packageExpanded, setPackageExpanded] = useState(true);
    
    // 活跃套餐名称
    const [activePackageName, setActivePackageName] = useState('企业专业版');
    
    // 套餐数据
    const resourcePackages = [
        { id: 1, name: '新手体验包', price: '¥0.00', priceNum: 0, originalPrice: '¥99.00', originalPriceNum: 99, calls: '10万次', tokens: '100万token', validity: '30天', features: ['大语言模型', '图像理解', '语音识别'], hot: false },
        { id: 2, name: '基础开发包', price: '¥299.00', priceNum: 299, originalPrice: '¥599.00', originalPriceNum: 599, calls: '100万次', tokens: '1000万token', validity: '90天', features: ['全部模型', 'API无限调用', '技术支持'], hot: true },
        { id: 3, name: '企业级套餐', price: '¥2999.00', priceNum: 2999, originalPrice: '¥5999.00', originalPriceNum: 5999, calls: '无限次', tokens: '无限token', validity: '365天', features: ['专属服务', 'SLA保障', '定制开发'], hot: false },
    ];
    
    // 订单抽屉状态
    const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<typeof resourcePackages[0] | null>(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [payDrawerOpen, setPayDrawerOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    
    // 打开订单抽屉
    const openOrderDrawer = (pkg: typeof resourcePackages[0]) => {
        setSelectedPackage(pkg);
        setOrderQuantity(1);
        setOrderDrawerOpen(true);
    };
    
    // 确认订单，打开支付抽屉
    const confirmOrder = () => {
        setOrderDrawerOpen(false);
        setPayDrawerOpen(true);
        setOrderSuccess(false);
    };
    
    // 支付成功
    const handlePaySuccess = () => {
        setOrderSuccess(true);
    };
    
    // 关闭支付抽屉
    const closePayDrawer = () => {
        setPayDrawerOpen(false);
        setSelectedPackage(null);
        setOrderSuccess(false);
    };

    // 从URL参数获取初始tab
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['overview', 'members', 'models', 'lobster'].includes(tabParam)) {
            setActiveMenu(tabParam);
        }
    }, [searchParams]);

    // 获取当前统计数据
    const currentStats = useMemo(() => {
        if (statsDateRange === "custom" && customStartDate && customEndDate) {
            // 自定义日期范围时返回模拟数据
            return statsByDateRange["7days"];
        }
        return statsByDateRange[statsDateRange] || statsByDateRange.today;
    }, [statsDateRange, customStartDate, customEndDate]);

    // 过滤可添加成员
    const filteredAvailableMembers = useMemo(() => {
        if (!memberSearchKeyword) return mockAvailableMembers;
        const keyword = memberSearchKeyword.toLowerCase();
        return mockAvailableMembers.filter(
            member =>
                member.name.toLowerCase().includes(keyword) ||
                member.email.toLowerCase().includes(keyword) ||
                member.id.toLowerCase().includes(keyword)
        );
    }, [memberSearchKeyword]);

    // 确认添加成员
    const handleConfirmAddMember = () => {
        if (selectedAddMember) {
            const newMember = {
                id: selectedAddMember.id,
                name: selectedAddMember.name,
                email: selectedAddMember.email,
                role: 'member' as const,
                callsUsed: 0,
                callsTotal: parseInt(newMemberCallsQuota) || 0,
                tokensUsed: 0,
                tokensTotal: parseInt(newMemberTokensQuota) || 0,
                amountUsed: 0,
                amountTotal: parseFloat(newMemberTokensQuota) || 0,
            };
            setMembers([...members, newMember]);
            setAddMemberDrawerOpen(false);
            setSelectedAddMember(null);
            setMemberSearchKeyword("");
            setNewMemberCallsQuota("");
            setNewMemberTokensQuota("");
        }
    };

    // 退出登录
    const handleLogout = () => {
        setUserMenuOpen(false);
        localStorage.removeItem('zhiqi_logged_in');
        localStorage.removeItem('zhiqi_user_info');
        window.location.href = '/zhiqi';
    };

    // 切换企业
    const handleSelectEnterprise = (enterprise: typeof selectedEnterprise) => {
        if (enterprise.role === 'member') {
            // 成员角色不能访问管理后台，显示提示，不切换企业
            setEnterpriseDialogOpen(false);
            setMemberRoleAlertOpen(true);
        } else {
            setSelectedEnterprise(enterprise);
            setEnterpriseDialogOpen(false);
        }
    };

    // 成员角色提示弹框
    const [memberRoleAlertOpen, setMemberRoleAlertOpen] = useState(false);

    // 获取场景数据
    const getScenarioData = () => {
        const baseStats = {
            seatsUsed: 0,
            seatsTotal: 0,
            lobsterNormal: 0,
            lobsterTotal: 0,
            amountUsed: 0,
            amountTotal: 0,
        };

        switch (currentScenario) {
            case 'no-package':
                return {
                    ...baseStats,
                    seatsUsed: 0,
                    seatsTotal: 0,
                    lobsterNormal: 0,
                    lobsterTotal: 0,
                    amountUsed: 0,
                    amountTotal: 0,
                };
            case 'package-valid-sufficient':
                return {
                    ...baseStats,
                    seatsUsed: 2,
                    seatsTotal: 10,
                    lobsterNormal: 2,
                    lobsterTotal: 3,
                    amountUsed: 1440,
                    amountTotal: 10000,
                };
            case 'package-exhausted':
                return {
                    ...baseStats,
                    seatsUsed: 10,
                    seatsTotal: 10,
                    lobsterNormal: 3,
                    lobsterTotal: 3,
                    amountUsed: 10000,
                    amountTotal: 10000,
                };
            case 'package-expired':
                return {
                    ...baseStats,
                    seatsUsed: 10,
                    seatsTotal: 10,
                    lobsterNormal: 3,
                    lobsterTotal: 3,
                    amountUsed: 10000,
                    amountTotal: 10000,
                };
            default:
                return baseStats;
        }
    };

    const scenarioData = getScenarioData();

    // 获取当前用户角色
    const currentUserRole = selectedEnterprise.role;

    return (
        <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden">
            {/* 顶部导航栏 */}
            <header
                className="fixed top-0 left-0 right-0 h-[50px] bg-white z-[1000] flex items-center justify-between px-4 border-b border-gray-100">
                <div className="flex items-center">
                    {/* Logo */}
                    <Link href="/enterprise" className="flex items-center mr-4">
                        <div className="flex items-center">
                            {/* 双环图形Logo */}
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mr-1.5">
                                {/* 深蓝色环形 - 外圈 */}
                                <path
                                    d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z"
                                    fill="#1a5cff" />
                                {/* 深蓝色箭头 */}
                                <path d="M22 6L24 10L20 10L22 6Z" fill="#1a5cff" />
                                {/* 淡绿色环形 - 内圈 */}
                                <path
                                    d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z"
                                    fill="#00d4aa" />
                                {/* 淡绿色箭头 */}
                                <path d="M19 3L21 7L17 7L19 3Z" fill="#00d4aa" />
                            </svg>
                            {/* 文字 */}
                            <span className="text-[17px] font-bold text-[#2c3e50] tracking-tight">360</span>
                            <span className="text-[17px] font-bold text-[#2c3e50] ml-0.5 tracking-tight">智企</span>
                        </div>
                    </Link>
                    {/* 企业切换器 */}
                    <div className="relative" onClick={() => setEnterpriseDialogOpen(true)}>
                        <div
                            className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-sm">
                            <span
                                className="w-4 h-4 bg-[#006bff] rounded text-white text-xs flex items-center justify-center mr-2">{selectedEnterprise.icon}</span>
                            <span className="text-gray-700">{selectedEnterprise.name}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    {/* 功能入口 */}
                    {/* 费用按钮 - 只有主账号和企业管理员可见 */}
                    {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
                        <a
                            href="/enterprise/cost"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">费用
                        </a>
                    )}
                    <Link
                        href="#"
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">工单
                    </Link>
                    <Link
                        href="#"
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 mr-2">帮助
                    </Link>
                    {/* 分隔线 */}
                    <div className="w-px h-5 bg-gray-300 mx-3"></div>
                    {/* 用户入口 */}
                    <div className="relative">
                        <div
                            className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div
                                className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-500">{username}</span>
                            <span className={`ml-2 px-2 py-0.5 text-white text-xs rounded ${roleConfig[currentUserRole].bgColor}`}>
                                {roleConfig[currentUserRole].label}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {/* 用户下拉菜单 */}
                        {userMenuOpen && (
                            <>
                                {/* 点击外部关闭菜单 */}
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setUserMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            window.open('https://console.zyun.360.cn/personalcenter/userinfo', '_blank');
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                    >
                                        <User className="w-4 h-4" />
                                        个人信息
                                    </button>
                                    {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                window.open('https://console.zyun.360.cn/useradmin/index', '_blank');
                                            }}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                        >
                                            <Building2 className="w-4 h-4" />
                                            组织管理
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        退出登录
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>
            
            {/* 悬浮场景切换按钮 - 张三(主账号)和李四(管理员)企业下显示，权限相同，可拖动 */}
            {(selectedEnterprise.name === "张三" || selectedEnterprise.name === "李四") && (
                <div 
                    className="fixed z-[1000]"
                    style={{ 
                        left: `${buttonPosition.x}px`, 
                        top: `${buttonPosition.y}px`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    <div className="relative">
                        {/* 悬浮按钮 */}
                        <button
                            onMouseDown={handleDragStart}
                            onClick={() => !isDragging && setScenarioMenuOpen(!scenarioMenuOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 select-none ${
                                scenarioMenuOpen 
                                    ? 'bg-red-700 text-white' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            <FlaskConical className="w-4 h-4" />
                            <span className="text-sm font-medium">管理员场景切换</span>
                            <span className={`w-2 h-2 rounded-full bg-white`}></span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${scenarioMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* 场景下拉菜单 */}
                        {scenarioMenuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setScenarioMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center gap-2">
                                        <FlaskConical className="w-3.5 h-3.5" />
                                        切换管理员测试场景
                                    </div>
                                    <div className="py-1">
                                        {(Object.keys(scenarioConfig) as ScenarioType[]).map((scenario) => (
                                            <button
                                                key={scenario}
                                                onClick={() => {
                                                    setCurrentScenario(scenario);
                                                    setScenarioMenuOpen(false);
                                                    // 更新套餐名称
                                                    if (scenario === 'no-package') {
                                                        setActivePackageName('');
                                                    } else {
                                                        setActivePackageName('企业专业版');
                                                    }
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${currentScenario === scenario ? 'bg-blue-50' : ''}`}
                                            >
                                                <span className={`w-2.5 h-2.5 rounded-full ${scenarioConfig[scenario].color}`}></span>
                                                <div className="flex-1 text-left">
                                                    <div className="text-sm text-gray-700">{scenarioConfig[scenario].label}</div>
                                                    <div className="text-xs text-gray-400">{scenarioConfig[scenario].desc}</div>
                                                </div>
                                                {currentScenario === scenario && (
                                                    <Check className="w-4 h-4 text-blue-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            {/* 企业切换弹窗 */}
            {enterpriseDialogOpen && (
                <div 
                    className="fixed inset-0 z-[2000] flex items-center justify-center"
                    onClick={() => setEnterpriseDialogOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div 
                        className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-500" />
                                    <span className="text-lg font-semibold text-gray-900">选择企业</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">请选择要切换的企业账号</p>
                            </div>
                            <button
                                onClick={() => setEnterpriseDialogOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {enterpriseList.map((enterprise) => (
                                <button
                                    key={enterprise.id}
                                    onClick={() => handleSelectEnterprise(enterprise)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                                        selectedEnterprise.id === enterprise.id 
                                            ? "border-blue-500 bg-blue-50" 
                                            : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${
                                        selectedEnterprise.id === enterprise.id ? "bg-blue-600" : "bg-gray-400"
                                    }`}>
                                        {enterprise.icon}
                                    </span>
                                    <div className="flex-1">
                                        <div className={`font-medium ${
                                            selectedEnterprise.id === enterprise.id ? "text-blue-600" : "text-gray-700"
                                        }`}>
                                            {enterprise.name}
                                        </div>
                                    </div>
                                    {selectedEnterprise.id === enterprise.id && (
                                        <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 成员角色提示弹框 */}
            {memberRoleAlertOpen && (
                <div 
                    className="fixed inset-0 z-[2000] flex items-center justify-center"
                    onClick={() => setMemberRoleAlertOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div 
                        className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                <span className="text-lg font-semibold text-gray-900">提示</span>
                            </div>
                            <button
                                onClick={() => setMemberRoleAlertOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-6">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                您在当前企业下是成员角色，不能访问管理后台。请确认所选企业是否正确。
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setMemberRoleAlertOpen(false)}
                                className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                我知道了
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 左侧导航栏 */}
            <aside
                className={`fixed left-0 top-[50px] h-[calc(100vh-50px)] bg-white z-[999] transition-all duration-300 border-r border-gray-200 ${sidebarCollapsed ? "w-[60px]" : "w-[200px]"}`}
            >
                {/* 标题 */}
                <div className="h-12 flex items-center px-4 border-b border-gray-100">
                    {!sidebarCollapsed && (
                        <span className="text-base font-semibold text-gray-900">管理后台</span>
                    )}
                </div>
                {/* 菜单列表 */}
                <nav className="p-2 pt-3 flex-1">
                    {adminMenuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`flex items-center px-3 py-2.5 rounded-md mb-1 transition-colors w-full ${activeMenu === item.id ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            <item.icon className={`w-5 h-5 ${sidebarCollapsed ? "mx-auto" : "mr-3"}`} />
                            {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
                        </button>
                    ))}
                </nav>
                
                {/* 折叠按钮 */}
                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>
            </aside>

            {/* 主内容区域 */}
            <main className={`pt-[50px] transition-all duration-300 ${sidebarCollapsed ? "ml-[60px]" : "ml-[200px]"}`}>
                <div className="p-6">
                    {/* 概览页面 */}
                    {activeMenu === "overview" && (
                        <>
                            {/* 页面标题 */}
                            <div className="text-xl font-semibold text-gray-900 mb-6">概览</div>
                            
                            {/* 场景1：推荐套餐模块 - 未购买套餐时显示 */}
                            {currentScenario === 'no-package' && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-blue-600" />
                                            <h2 className="text-base font-semibold text-gray-900">推荐套餐</h2>
                                        </div>
                                        <Link 
                                            href="/purchase"
                                            target="_blank"
                                            className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                                        >
                                            更多套餐
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        {/* 套餐卡片 */}
                                        <div className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-900">新手体验包</span>
                                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">免费</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mb-3">10万次调用 · 100万token · 30天</div>
                                            <button 
                                                onClick={() => openOrderDrawer(resourcePackages[0])}
                                                className="w-full py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                立即领取
                                            </button>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow relative">
                                            <span className="absolute -top-2 right-2 text-xs text-white bg-orange-500 px-2 py-0.5 rounded-full">热门</span>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-900">基础开发包</span>
                                                <span className="text-sm font-bold text-blue-600">¥299</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mb-3">100万次调用 · 1000万token · 90天</div>
                                            <button 
                                                onClick={() => openOrderDrawer(resourcePackages[1])}
                                                className="w-full py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                立即购买
                                            </button>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-900">企业级套餐</span>
                                                <span className="text-sm font-bold text-blue-600">¥2999</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mb-3">无限调用 · 无限token · 365天</div>
                                            <button 
                                                onClick={() => openOrderDrawer(resourcePackages[2])}
                                                className="w-full py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                立即购买
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* 场景2/3/4：当前套餐模块 */}
                            {(currentScenario === 'package-valid-sufficient' || currentScenario === 'package-exhausted' || currentScenario === 'package-expired') && (
                            <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
                                {/* 套餐信息模块 */}
                                <div className={`px-6 py-4 ${
                                    packageExpanded ? 'border-b border-gray-100' : ''
                                } ${
                                    currentScenario === 'package-expired' 
                                        ? 'bg-gradient-to-r from-red-50 to-orange-50' 
                                        : currentScenario === 'package-exhausted'
                                            ? 'bg-gradient-to-r from-orange-50 to-amber-50'
                                            : 'bg-gradient-to-r from-blue-50 to-purple-50'
                                }`}>
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-6 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">当前套餐</div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {activePackageName}
                                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                                            currentScenario === 'package-expired' 
                                                                ? 'bg-red-100 text-red-600' 
                                                                : currentScenario === 'package-exhausted'
                                                                    ? 'bg-orange-100 text-orange-600'
                                                                    : 'bg-green-100 text-green-600'
                                                        }`}>
                                                            {currentScenario === 'package-expired' ? '已过期' : currentScenario === 'package-exhausted' ? '已用尽' : '生效中'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setPackageExpanded(!packageExpanded)}
                                                    className="p-1 hover:bg-white/50 rounded transition-colors ml-2"
                                                >
                                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${packageExpanded ? '' : '-rotate-90'}`} />
                                                </button>
                                            </div>
                                            <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">到期时间</div>
                                                <div className={`text-lg font-semibold ${
                                                    currentScenario === 'package-expired' ? 'text-red-600' : 'text-gray-900'
                                                }`}>
                                                    {currentScenario === 'package-expired' ? '2025-02-28' : '2025-06-15'}
                                                </div>
                                            </div>
                                            <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">成员数 (已用/总量)</div>
                                                <div className="text-lg font-semibold text-gray-900">
                                                    <span className={`${
                                                        scenarioData.seatsTotal > 0 && (scenarioData.seatsTotal - scenarioData.seatsUsed) === 0 ? 'text-orange-600' : 'text-[#006bff]'
                                                    }`}>
                                                        {scenarioData.seatsUsed}
                                                    </span>
                                                    <span className="text-gray-400 font-normal text-sm ml-1">/ {scenarioData.seatsTotal}</span>
                                                </div>
                                            </div>
                                            <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">龙虾个数 (已用/总量)</div>
                                                <div className="text-lg font-semibold text-gray-900">
                                                    <span className={`${
                                                        scenarioData.lobsterTotal > 0 && (scenarioData.lobsterTotal - scenarioData.lobsterNormal) === 0 ? 'text-orange-600' : 'text-[#006bff]'
                                                    }`}>
                                                        {scenarioData.lobsterNormal}
                                                    </span>
                                                    <span className="text-gray-400 font-normal text-sm ml-1">/ {scenarioData.lobsterTotal}</span>
                                                </div>
                                            </div>
                                            <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">金额 (已用/总量)</div>
                                                <div className="text-lg font-semibold text-gray-900">
                                                    <span className={`${
                                                        scenarioData.amountTotal > 0 && (scenarioData.amountTotal - scenarioData.amountUsed) === 0 ? 'text-orange-600' : 'text-[#006bff]'
                                                    }`}>
                                                        ￥{scenarioData.amountUsed.toLocaleString()}
                                                    </span>
                                                    <span className="text-gray-400 font-normal text-sm ml-1">/ ￥{scenarioData.amountTotal.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {currentScenario === 'package-exhausted' || currentScenario === 'package-expired' ? (
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className={`w-4 h-4 flex-shrink-0 ${
                                                        currentScenario === 'package-expired' ? 'text-red-500' : 'text-orange-500'
                                                    }`} />
                                                    <span className={`text-sm ${
                                                        currentScenario === 'package-expired' ? 'text-red-600' : 'text-orange-600'
                                                    }`}>
                                                        {currentScenario === 'package-expired' ? '套餐已过期，请及时续费以继续使用服务' : '成员数或龙虾个数或金额已用尽，请尽快充值'}
                                                    </span>
                                                </div>
                                                <Link 
                                                    href="/purchase"
                                                    target="_blank"
                                                    className={`px-4 py-2 text-white text-sm rounded-lg transition-colors flex-shrink-0 ${
                                                        currentScenario === 'package-expired' 
                                                            ? 'bg-red-600 hover:bg-red-700' 
                                                            : 'bg-orange-600 hover:bg-orange-700'
                                                    }`}
                                                >
                                                    {currentScenario === 'package-expired' ? '立即续费' : '立即充值'}
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link 
                                                href="/purchase"
                                                target="_blank"
                                                className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                升级套餐
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                {/* 进度条 */}
                                {packageExpanded && (
                                <div className="px-6 py-4 space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                            <span>成员数使用进度</span>
                                            <span>{scenarioData.seatsTotal > 0 ? Math.round((scenarioData.seatsUsed / scenarioData.seatsTotal) * 100) : 0}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    currentScenario === 'package-expired' ? 'bg-red-500' : 
                                                    currentScenario === 'package-exhausted' ? 'bg-orange-500' : 'bg-[#006bff]'
                                                }`}
                                                style={{ width: `${scenarioData.seatsTotal > 0 ? Math.round((scenarioData.seatsUsed / scenarioData.seatsTotal) * 100) : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                            <span>龙虾个数使用进度</span>
                                            <span>{scenarioData.lobsterTotal > 0 ? Math.round((scenarioData.lobsterNormal / scenarioData.lobsterTotal) * 100) : 0}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    currentScenario === 'package-expired' ? 'bg-red-500' : 
                                                    currentScenario === 'package-exhausted' ? 'bg-orange-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${scenarioData.lobsterTotal > 0 ? Math.round((scenarioData.lobsterNormal / scenarioData.lobsterTotal) * 100) : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                            <span>金额使用进度</span>
                                            <span>{scenarioData.amountTotal > 0 ? Math.round((scenarioData.amountUsed / scenarioData.amountTotal) * 100) : 0}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    currentScenario === 'package-expired' ? 'bg-red-500' : 
                                                    currentScenario === 'package-exhausted' ? 'bg-orange-500' : 'bg-purple-500'
                                                }`}
                                                style={{ width: `${scenarioData.amountTotal > 0 ? Math.round((scenarioData.amountUsed / scenarioData.amountTotal) * 100) : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            )}
                            
                            {/* 数据统计模块 */}
                            <div className={`bg-white rounded-lg border border-gray-200 ${currentScenario === 'package-expired' ? 'opacity-50 pointer-events-none' : ''}`}>
                                {currentScenario === 'no-package' ? (
                                    /* 未购买套餐：显示默认文案 */
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="text-gray-400 text-base mb-3">
                                            暂无数据，<Link 
                                                href="/purchase" 
                                                target="_blank"
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >购买套餐</Link>即可使用。
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">数据统计</h3>
                                    <div className="flex items-center gap-3">
                                        <select 
                                            value={statsDateRange}
                                            onChange={(e) => setStatsDateRange(e.target.value)}
                                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="today">今日</option>
                                            <option value="7days">最近7天</option>
                                            <option value="30days">最近30天</option>
                                            <option value="month">本月</option>
                                            <option value="custom">自定义</option>
                                        </select>
                                        {statsDateRange === "custom" && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="date"
                                                    value={customStartDate}
                                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500"
                                                />
                                                <span className="text-gray-400">至</span>
                                                <input
                                                    type="date"
                                                    value={customEndDate}
                                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* 统计概览卡片 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                                    {/* 活跃成员/已超配额成员 */}
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="text-sm text-green-600">活跃成员</div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white text-xs max-w-56">
                                                    <p>活跃成员：在选定时间范围内有调用的成员数量</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <span className="text-gray-300 mx-1">/</span>
                                            <div className="text-sm text-orange-600">已超配额</div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white text-xs max-w-56">
                                                    <p>已超配额：在选定时间范围内消费金额超自身配额的成员数量</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            <span className="text-green-600">{currentStats.activeMembers.count}</span>
                                            <span className="text-gray-400 font-normal mx-1">/</span>
                                            <span className="text-orange-600">{currentStats.activeMembers.overQuota}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">共 {currentStats.activeMembers.total} 名成员</div>
                                    </div>
                                    {/* 龙虾数量 */}
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <div className="text-sm text-orange-600 mb-1">龙虾数量(正常/总数)</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            <span className="text-green-600">{currentStats.lobsters.normal}</span>
                                            <span className="text-gray-400 font-normal"> / {currentStats.lobsters.total}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">正常率 {((currentStats.lobsters.normal / currentStats.lobsters.total) * 100).toFixed(1)}%</div>
                                    </div>
                                    {/* 消费金额 */}
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="flex items-center gap-1 mb-1">
                                            <div className="text-sm text-purple-600">消费金额</div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white text-xs max-w-56">
                                                    <p>趋势：与上一个相同时间周期相比的消费金额变化百分比</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-gray-900">¥{currentStats.consumption.amount.toLocaleString()}</span>
                                            <span className={`text-sm font-medium ${currentStats.consumption.trend.includes('+') ? 'text-green-500' : currentStats.consumption.trend.includes('-') ? 'text-red-500' : 'text-gray-400'}`}>
                                                {currentStats.consumption.trend}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">日均 ¥{currentStats.consumption.daily.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* 消费TOP */}
                                <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h4 className="text-sm font-medium text-gray-700">消费TOP</h4>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="bg-gray-800 text-white text-xs max-w-72">
                                                <p>趋势：与上一个相同时间周期相比的消费金额变化百分比</p>
                                                <p className="mt-1">占比：当前消费金额占总消费金额的百分比</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        {/* 成员消费分布 */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                                <h5 className="text-sm font-medium text-gray-700">成员消费分布</h5>
                                            </div>
                                            <div className="p-3">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-100">
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500 w-10">排名</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">成员</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">消费金额</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">占比</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentStats.memberRanking.slice(0, 5).map((member, index) => {
                                                            const rankColors = [
                                                                "bg-yellow-100 text-yellow-600",
                                                                "bg-gray-100 text-gray-600",
                                                                "bg-orange-100 text-orange-600",
                                                                "bg-gray-50 text-gray-500",
                                                                "bg-gray-50 text-gray-500",
                                                            ];
                                                            const trendColor = member.trend.includes("↑") ? "text-green-500" : member.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                                            const amount = (member.amount || (member.tokensUsed * 0.0001)).toFixed(2);
                                                            
                                                            return (
                                                                <tr key={member.rank} className="border-b border-gray-50 last:border-0">
                                                                    <td className="py-2">
                                                                        <span className={`inline-flex w-5 h-5 rounded-full items-center justify-center text-xs font-medium ${rankColors[index]}`}>{member.rank}</span>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <div className="text-sm text-gray-900">{member.name}</div>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-sm font-medium text-gray-900">¥{amount}</span>
                                                                            <span className={`text-xs ${trendColor}`}>{member.trend}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <span className="text-sm text-gray-600">{member.percentage}%</span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <button 
                                                    onClick={() => {
                                                        setConsumptionDrawerTab('member');
                                                        setConsumptionDrawerOpen(true);
                                                    }}
                                                    className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 text-center"
                                                >查看全部</button>
                                            </div>
                                        </div>

                                        {/* 模型消费分布 */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                                <h5 className="text-sm font-medium text-gray-700">模型消费分布</h5>
                                            </div>
                                            <div className="p-3">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-100">
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500 w-10">排名</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">模型</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">消费金额</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">占比</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentStats.modelRanking.slice(0, 5).map((model, index) => {
                                                            const rankColors = [
                                                                "bg-yellow-100 text-yellow-600",
                                                                "bg-gray-100 text-gray-600",
                                                                "bg-orange-100 text-orange-600",
                                                                "bg-gray-50 text-gray-500",
                                                                "bg-gray-50 text-gray-500",
                                                            ];
                                                            const trendColor = model.trend.includes("↑") ? "text-green-500" : model.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                                            
                                                            return (
                                                                <tr key={model.rank} className="border-b border-gray-50 last:border-0">
                                                                    <td className="py-2">
                                                                        <span className={`inline-flex w-5 h-5 rounded-full items-center justify-center text-xs font-medium ${rankColors[index]}`}>{model.rank}</span>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <div className="text-sm text-gray-900">{model.name}</div>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-sm font-medium text-gray-900">¥{model.amount.toFixed(2)}</span>
                                                                            <span className={`text-xs ${trendColor}`}>{model.trend}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <span className="text-sm text-gray-600">{model.percentage}%</span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <button 
                                                    onClick={() => {
                                                        setConsumptionDrawerTab('model');
                                                        setConsumptionDrawerOpen(true);
                                                    }}
                                                    className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 text-center"
                                                >查看全部</button>
                                            </div>
                                        </div>

                                        {/* 龙虾消费分布 */}
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                                <h5 className="text-sm font-medium text-gray-700">龙虾消费分布</h5>
                                            </div>
                                            <div className="p-3">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-100">
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500 w-10">排名</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">龙虾</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">消费金额</th>
                                                            <th className="text-left py-2 text-xs font-medium text-gray-500">占比</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentStats.lobsterRanking.slice(0, 5).map((lobster, index) => {
                                                            const rankColors = [
                                                                "bg-yellow-100 text-yellow-600",
                                                                "bg-gray-100 text-gray-600",
                                                                "bg-orange-100 text-orange-600",
                                                                "bg-gray-50 text-gray-500",
                                                                "bg-gray-50 text-gray-500",
                                                            ];
                                                            const trendColor = lobster.trend.includes("↑") ? "text-green-500" : lobster.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                                            
                                                            return (
                                                                <tr key={lobster.rank} className="border-b border-gray-50 last:border-0">
                                                                    <td className="py-2">
                                                                        <span className={`inline-flex w-5 h-5 rounded-full items-center justify-center text-xs font-medium ${rankColors[index]}`}>{lobster.rank}</span>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-sm text-gray-900">{lobster.name}</span>
                                                                            {lobster.status === 'abnormal' && (
                                                                                <span className="text-xs text-red-500">●</span>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-sm font-medium text-gray-900">¥{lobster.amount.toFixed(2)}</span>
                                                                            <span className={`text-xs ${trendColor}`}>{lobster.trend}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <span className="text-sm text-gray-600">{lobster.percentage}%</span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <button 
                                                    onClick={() => {
                                                        setConsumptionDrawerTab('lobster');
                                                        setConsumptionDrawerOpen(true);
                                                    }}
                                                    className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 text-center"
                                                >查看全部</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {/* 成员管理页面 */}
                    {activeMenu === "members" && (
                        <>
                            {/* 页面标题 */}
                            <div className="text-xl font-semibold text-gray-900 mb-6">成员配额</div>
                            <div className="bg-white rounded-lg border border-gray-200">
                                {/* 顶部操作栏 */}
                                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="搜索成员名称"
                                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                        <option value="all">全部角色</option>
                                        <option value="owner">主账号</option>
                                        <option value="admin">管理员</option>
                                        <option value="member">成员</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => {
                                            if (selectedMemberIds.length > 0) {
                                                setBatchQuotaValue("");
                                                setBatchQuotaDialogOpen(true);
                                            }
                                        }}
                                        disabled={selectedMemberIds.length === 0}
                                        className={`px-4 py-2 border text-sm rounded-lg transition-colors ${selectedMemberIds.length > 0 ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        批量设置配额{selectedMemberIds.length > 0 && ` (${selectedMemberIds.length})`}
                                    </button>
                                    <button 
                                        onClick={() => setAddMemberDrawerOpen(true)}
                                        className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        导入成员
                                    </button>
                                </div>
                            </div>

                            {/* 成员列表 */}
                            <div className="overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50">
                                            <th className="py-3 px-4 w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    ref={(el) => {
                                                        if (el) el.indeterminate = isPartialSelected;
                                                    }}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedMemberIds(members.map(m => m.id));
                                                        } else {
                                                            setSelectedMemberIds([]);
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#006bff] focus:ring-[#006bff]"
                                                />
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">成员信息</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">角色</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">配额(￥)</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((member) => {
                                            const colorMap: Record<string, { bg: string; text: string }> = {
                                                '张': { bg: 'bg-blue-100', text: 'text-blue-600' },
                                                '李': { bg: 'bg-green-100', text: 'text-green-600' },
                                                '王': { bg: 'bg-purple-100', text: 'text-purple-600' },
                                                '赵': { bg: 'bg-cyan-100', text: 'text-cyan-600' },
                                                '孙': { bg: 'bg-pink-100', text: 'text-pink-600' },
                                            };
                                            const color = colorMap[member.name[0]] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                                            const roleLabel = member.role === 'owner' ? '主账号' : member.role === 'admin' ? '管理员' : '成员';
                                            const roleStyle = member.role === 'owner' ? 'bg-yellow-50 text-yellow-600' : member.role === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600';
                                            const isUnlimited = member.amountTotal === 0;
                                            const amountPercentage = isUnlimited ? 0 : (member.amountUsed / member.amountTotal) * 100;
                                            const isAmountWarning = !isUnlimited && amountPercentage > 90;
                                            
                                            return (
                                                <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 px-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedMemberIds.includes(member.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedMemberIds([...selectedMemberIds, member.id]);
                                                                } else {
                                                                    setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id));
                                                                }
                                                            }}
                                                            className="w-4 h-4 rounded border-gray-300 text-[#006bff] focus:ring-[#006bff]"
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center ${color.text} font-medium`}>{member.name[0]}</div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{member.name}</div>
                                                                <div className="text-xs text-gray-400">{member.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2 py-1 ${roleStyle} text-xs rounded`}>{roleLabel}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="w-36">
                                                            <div className="flex items-center justify-between text-xs mb-1">
                                                                <span className={isAmountWarning ? "text-orange-500" : "text-gray-500"}>已用 ¥{member.amountUsed.toFixed(2)}</span>
                                                                <span className="text-gray-900 font-medium">
                                                                    {isUnlimited ? '不限制' : `¥${member.amountTotal.toFixed(2)}`}
                                                                </span>
                                                            </div>
                                                            {!isUnlimited && (
                                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${isAmountWarning ? 'bg-orange-500' : 'bg-[#006bff]'} rounded-full`} style={{ width: `${amountPercentage}%` }}></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <button 
                                                            onClick={() => {
                                                                setEditingMember(member);
                                                                setTempAmountQuota(member.amountTotal.toString());
                                                                setQuotaEditOpen(true);
                                                            }}
                                                            className="text-sm text-[#006bff] hover:text-blue-600"
                                                        >
                                                            设置配额
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* 配额编辑弹窗 */}
                            {quotaEditOpen && editingMember && (
                                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                                    <div 
                                        className="absolute inset-0 bg-black/50"
                                        onClick={() => setQuotaEditOpen(false)}
                                    />
                                    <div className="relative bg-white rounded-lg shadow-xl w-[480px]">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900">设置配额</h3>
                                            <button 
                                                onClick={() => setQuotaEditOpen(false)}
                                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                            >
                                                <X className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">{editingMember.name[0]}</div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{editingMember.name}</div>
                                                    <div className="text-xs text-gray-400">{editingMember.email}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    配额(￥)
                                                    <span className="text-xs text-gray-400 font-normal ml-1">（不填则不限制）</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                                                    <input
                                                        type="number"
                                                        value={tempAmountQuota}
                                                        onChange={(e) => setTempAmountQuota(e.target.value)}
                                                        placeholder="请输入配额金额"
                                                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">已使用 ¥{editingMember.amountUsed.toFixed(2)}</div>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                <div className="text-xs text-blue-600">
                                                    配额设置后立即生效。不填写配额则表示不限制该成员的消费金额。
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                                            <button 
                                                onClick={() => setQuotaEditOpen(false)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    // 更新成员配额，空值表示不限制（amountTotal为0）
                                                    const quotaValue = tempAmountQuota ? parseFloat(tempAmountQuota) : 0;
                                                    setMembers(members.map(m => 
                                                        m.id === editingMember.id 
                                                            ? { ...m, amountTotal: quotaValue }
                                                            : m
                                                    ));
                                                    setQuotaEditOpen(false);
                                                }}
                                                className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                确认设置
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* 批量设置配额弹窗 */}
                            {batchQuotaDialogOpen && (
                                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                                    <div 
                                        className="absolute inset-0 bg-black/50"
                                        onClick={() => setBatchQuotaDialogOpen(false)}
                                    />
                                    <div className="relative bg-white rounded-lg shadow-xl w-[480px]">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900">批量设置配额</h3>
                                            <button 
                                                onClick={() => setBatchQuotaDialogOpen(false)}
                                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                            >
                                                <X className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="text-sm text-gray-600">
                                                    已选择 <span className="font-medium text-gray-900">{selectedMemberIds.length}</span> 名成员
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    配额(￥)
                                                    <span className="text-xs text-gray-400 font-normal ml-1">（不填则不限制）</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                                                    <input
                                                        type="number"
                                                        value={batchQuotaValue}
                                                        onChange={(e) => setBatchQuotaValue(e.target.value)}
                                                        placeholder="请输入配额金额"
                                                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                <div className="text-xs text-blue-600">
                                                    配额设置后立即生效。不填写配额则表示不限制选中成员的消费金额。
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                                            <button 
                                                onClick={() => setBatchQuotaDialogOpen(false)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    // 批量更新配额
                                                    const quotaValue = batchQuotaValue ? parseFloat(batchQuotaValue) : 0;
                                                    setMembers(members.map(m => 
                                                        selectedMemberIds.includes(m.id) 
                                                            ? { ...m, amountTotal: quotaValue }
                                                            : m
                                                    ));
                                                    setSelectedMemberIds([]);
                                                    setBatchQuotaDialogOpen(false);
                                                }}
                                                className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                确认设置
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* 导入成员抽屉 */}
                            {addMemberDrawerOpen && (
                                <div className="fixed inset-0 z-[2000]">
                                    <div 
                                        className="absolute inset-0 bg-black/50"
                                        onClick={() => setAddMemberDrawerOpen(false)}
                                    />
                                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl flex flex-col">
                                        {/* 头部 */}
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900">导入成员</h3>
                                            <button 
                                                onClick={() => {
                                                    setAddMemberDrawerOpen(false);
                                                    setSelectedAddMember(null);
                                                    setMemberSearchKeyword("");
                                                    setNewMemberCallsQuota("");
                                                    setNewMemberTokensQuota("");
                                                }}
                                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                                            >
                                                <X className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                        
                                        {/* 内容区 */}
                                        <div className="flex-1 overflow-y-auto p-6">
                                            {/* 步骤1：搜索成员 */}
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-[#006bff] text-white text-xs flex items-center justify-center font-medium">1</div>
                                                        <span className="font-medium text-gray-900">选择成员</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => window.open('https://console.zyun.360.cn/useradmin/index', '_blank')}
                                                        className="text-xs text-[#006bff] hover:text-blue-600 flex items-center gap-1"
                                                    >
                                                        <Settings className="w-3.5 h-3.5" />
                                                        组织管理
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    <input
                                                        type="text"
                                                        value={memberSearchKeyword}
                                                        onChange={(e) => {
                                                            setMemberSearchKeyword(e.target.value);
                                                            setSelectedAddMember(null);
                                                        }}
                                                        placeholder="输入账号/姓名/邮箱搜索成员"
                                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                
                                                {/* 搜索结果列表 */}
                                                {memberSearchKeyword && (
                                                    <div className="mt-3 border border-gray-100 rounded-lg max-h-[200px] overflow-y-auto">
                                                        {filteredAvailableMembers.length > 0 ? (
                                                            filteredAvailableMembers.map(member => (
                                                                <div
                                                                    key={member.id}
                                                                    onClick={() => {
                                                                        setSelectedAddMember(member);
                                                                        setMemberSearchKeyword("");
                                                                    }}
                                                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedAddMember?.id === member.id ? 'bg-blue-50' : ''}`}
                                                                >
                                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm">
                                                                        {member.name[0]}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                                                                        <div className="text-xs text-gray-400">{member.email}</div>
                                                                    </div>
                                                                    {selectedAddMember?.id === member.id && (
                                                                        <Check className="w-4 h-4 text-[#006bff]" />
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                                                未找到匹配的成员
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* 已选中的成员 */}
                                                {selectedAddMember && !memberSearchKeyword && (
                                                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                                                            {selectedAddMember.name[0]}
                                                        </div>
                                                        <span className="text-sm text-gray-900">{selectedAddMember.name}</span>
                                                        <span className="text-xs text-gray-400">{selectedAddMember.email}</span>
                                                        <button 
                                                            onClick={() => setSelectedAddMember(null)}
                                                            className="ml-auto text-gray-400 hover:text-gray-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* 步骤2：设置配额 */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-6 h-6 rounded-full ${selectedAddMember ? 'bg-[#006bff]' : 'bg-gray-200'} text-white text-xs flex items-center justify-center font-medium`}>2</div>
                                                    <span className={`font-medium ${selectedAddMember ? 'text-gray-900' : 'text-gray-400'}`}>设置配额</span>
                                                </div>
                                                
                                                <div className={`space-y-4 ${!selectedAddMember ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            配额(￥)
                                                            <span className="text-xs text-gray-400 font-normal ml-1">（不填则不限制）</span>
                                                        </label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                                                            <input
                                                                type="number"
                                                                value={newMemberTokensQuota}
                                                                onChange={(e) => setNewMemberTokensQuota(e.target.value)}
                                                                placeholder="请输入配额金额"
                                                                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-blue-50 rounded-lg p-3 text-xs text-gray-600">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                不填写配额则表示不限制该成员的消费金额。如需调整，可在成员列表中重新设置。
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* 底部按钮 */}
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                                            <button 
                                                onClick={() => {
                                                    setAddMemberDrawerOpen(false);
                                                    setSelectedAddMember(null);
                                                    setMemberSearchKeyword("");
                                                    setNewMemberCallsQuota("");
                                                    setNewMemberTokensQuota("");
                                                }}
                                                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button 
                                                onClick={handleConfirmAddMember}
                                                disabled={!selectedAddMember}
                                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedAddMember ? 'bg-[#006bff] text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                确认添加
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        </>
                    )}

                    {/* 大模型管理页面 */}
                    {activeMenu === "models" && (
                        <>
                            {/* 页面标题 */}
                            <div className="text-xl font-semibold text-gray-900 mb-6">大模型管理</div>
                            <div className="bg-white rounded-lg border border-gray-200">
                                {/* 顶部操作栏 */}
                                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="搜索模型名称"
                                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                        <option value="all">全部类型</option>
                                        <option value="text">文本模型</option>
                                        <option value="image">图像模型</option>
                                        <option value="audio">音频模型</option>
                                        <option value="video">视频模型</option>
                                    </select>
                                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                        <option value="all">全部状态</option>
                                        <option value="enabled">已启用</option>
                                        <option value="disabled">已停用</option>
                                    </select>
                                </div>
                                <button className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    申请模型
                                </button>
                            </div>

                            {/* 模型列表 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                {/* GPT-4 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">G</div>
                                            <div>
                                                <div className="font-medium text-gray-900">GPT-4</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">125,340</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">874,660 / 1,000,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '87.5%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* Claude */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">C</div>
                                            <div>
                                                <div className="font-medium text-gray-900">Claude-3</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">89,210</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">410,790 / 500,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '82.2%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* 文心一言 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">文</div>
                                            <div>
                                                <div className="font-medium text-gray-900">文心一言</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">45,680</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">254,320 / 300,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '84.8%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* 通义千问 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">通</div>
                                            <div>
                                                <div className="font-medium text-gray-900">通义千问</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">32,150</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">167,850 / 200,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '83.9%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* 讯飞星火 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">讯</div>
                                            <div>
                                                <div className="font-medium text-gray-900">讯飞星火</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">已停用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">0</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">100,000 / 100,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* 智谱GLM */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center text-white font-bold text-sm">智</div>
                                            <div>
                                                <div className="font-medium text-gray-900">智谱GLM</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">18,920</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">81,080 / 100,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '81.1%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </>
                    )}

                    {/* 龙虾管理页面 */}
                    {activeMenu === "lobster" && (
                        <>
                            {/* 页面标题 */}
                            <div className="text-xl font-semibold text-gray-900 mb-6">龙虾管理</div>
                            <div className="bg-white rounded-lg border border-gray-200">
                                {/* 配额显示模块 */}
                                <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">配额剩余</span>
                                    <span className="text-sm text-gray-900 font-medium">87,660 / 100,000</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '87.66%' }}></div>
                                    </div>
                                    <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                        管理
                                    </button>
                                </div>
                            </div>

                            {/* 龙虾卡片列表 */}
                            <div className="p-6 space-y-4">
                                {/* 龙虾卡片1 */}
                                <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">🦞</div>
                                        <div className="flex-1">
                                            <button 
                                                onClick={() => alert('跳转到龙虾详情页')}
                                                className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors block mb-1"
                                            >
                                                生产环境龙虾
                                            </button>
                                            <div className="text-xs text-gray-400 mb-3">创建时间: 2026.01.01 23:56</div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">状态</span>
                                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        正常
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">今日调用</span>
                                                    <span className="text-sm text-gray-900 font-medium">12,340</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 龙虾卡片2 */}
                                <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">🦞</div>
                                        <div className="flex-1">
                                            <button 
                                                onClick={() => alert('跳转到龙虾详情页')}
                                                className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors block mb-1"
                                            >
                                                测试环境龙虾
                                            </button>
                                            <div className="text-xs text-gray-400 mb-3">创建时间: 2026.01.15 10:23</div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">状态</span>
                                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        正常
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">今日调用</span>
                                                    <span className="text-sm text-gray-900 font-medium">5,890</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 龙虾卡片3 */}
                                <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">🦞</div>
                                        <div className="flex-1">
                                            <button 
                                                onClick={() => alert('跳转到龙虾详情页')}
                                                className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors block mb-1"
                                            >
                                                开发调试龙虾
                                            </button>
                                            <div className="text-xs text-gray-400 mb-3">创建时间: 2026.02.08 16:45</div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">状态</span>
                                                    <span className="flex items-center gap-1 text-orange-600 text-sm">
                                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                        配额不足
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">今日调用</span>
                                                    <span className="text-sm text-gray-900 font-medium">3,210</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </main>

            {/* 智能助手对话框 */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>智能助手</DialogTitle>
                        <DialogDescription>
                            有什么可以帮助您的？
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-gray-500">智能助手功能开发中...</p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setDialogOpen(false)}>关闭</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 消费TOP抽屉 */}
            {consumptionDrawerOpen && (
                <div className="fixed inset-0 z-[2000]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setConsumptionDrawerOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-3xl bg-white shadow-2xl flex flex-col">
                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">消费详情</h3>
                            <button 
                                onClick={() => setConsumptionDrawerOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        
                        {/* Tab切换 */}
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setConsumptionDrawerTab('member')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                                    consumptionDrawerTab === 'member' 
                                        ? 'text-blue-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                成员消费分布
                                {consumptionDrawerTab === 'member' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                                )}
                            </button>
                            <button
                                onClick={() => setConsumptionDrawerTab('model')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                                    consumptionDrawerTab === 'model' 
                                        ? 'text-blue-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                模型消费分布
                                {consumptionDrawerTab === 'model' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                                )}
                            </button>
                            <button
                                onClick={() => setConsumptionDrawerTab('lobster')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                                    consumptionDrawerTab === 'lobster' 
                                        ? 'text-blue-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                龙虾消费分布
                                {consumptionDrawerTab === 'lobster' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                                )}
                            </button>
                        </div>
                        
                        {/* 内容区 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* 成员消费分布 */}
                            {consumptionDrawerTab === 'member' && (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 text-xs font-medium text-gray-500 w-16">排名</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">成员</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">消费金额</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">占比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStats.memberRanking.map((member, index) => {
                                            const rankColors = [
                                                "bg-yellow-100 text-yellow-600",
                                                "bg-gray-100 text-gray-600",
                                                "bg-orange-100 text-orange-600",
                                            ];
                                            const trendColor = member.trend.includes("↑") ? "text-green-500" : member.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                            const amount = (member.amount || (member.tokensUsed * 0.0001)).toFixed(2);
                                            
                                            return (
                                                <tr key={member.rank} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                    <td className="py-3">
                                                        <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-medium ${rankColors[index] || 'bg-gray-50 text-gray-500'}`}>
                                                            {member.rank}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                                                                {member.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                                <div className="text-xs text-gray-400">{member.role}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">¥{amount}</span>
                                                            <span className={`text-xs ${trendColor}`}>{member.trend}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm text-gray-600">{member.percentage}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            
                            {/* 模型消费分布 */}
                            {consumptionDrawerTab === 'model' && (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 text-xs font-medium text-gray-500 w-16">排名</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">模型</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">消费金额</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">占比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStats.modelRanking.map((model, index) => {
                                            const rankColors = [
                                                "bg-yellow-100 text-yellow-600",
                                                "bg-gray-100 text-gray-600",
                                                "bg-orange-100 text-orange-600",
                                            ];
                                            const trendColor = model.trend.includes("↑") ? "text-green-500" : model.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                            
                                            return (
                                                <tr key={model.rank} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                    <td className="py-3">
                                                        <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-medium ${rankColors[index] || 'bg-gray-50 text-gray-500'}`}>
                                                            {model.rank}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm font-medium text-gray-900">{model.name}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">¥{model.amount.toFixed(2)}</span>
                                                            <span className={`text-xs ${trendColor}`}>{model.trend}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm text-gray-600">{model.percentage}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            
                            {/* 龙虾消费分布 */}
                            {consumptionDrawerTab === 'lobster' && (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 text-xs font-medium text-gray-500 w-16">排名</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">龙虾</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">消费金额</th>
                                            <th className="text-left py-3 text-xs font-medium text-gray-500">占比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStats.lobsterRanking.map((lobster, index) => {
                                            const rankColors = [
                                                "bg-yellow-100 text-yellow-600",
                                                "bg-gray-100 text-gray-600",
                                                "bg-orange-100 text-orange-600",
                                            ];
                                            const trendColor = lobster.trend.includes("↑") ? "text-green-500" : lobster.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                            
                                            return (
                                                <tr key={lobster.rank} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                    <td className="py-3">
                                                        <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-medium ${rankColors[index] || 'bg-gray-50 text-gray-500'}`}>
                                                            {lobster.rank}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">{lobster.name}</span>
                                                            {lobster.status === 'abnormal' && (
                                                                <span className="text-xs text-red-500 font-medium">● 异常</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400">创建者：{lobster.creator}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">¥{lobster.amount.toFixed(2)}</span>
                                                            <span className={`text-xs ${trendColor}`}>{lobster.trend}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm text-gray-600">{lobster.percentage}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 订单确认抽屉 */}
            {orderDrawerOpen && selectedPackage && (
                <div className="fixed inset-0 z-[2000]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOrderDrawerOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl">
                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">订单确认</h3>
                            <button 
                                onClick={() => setOrderDrawerOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        
                        {/* 内容区 */}
                        <div className="px-6 py-4 space-y-4">
                            {/* 购买说明 */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-700">购买说明</span>
                                </div>
                                <p className="text-xs text-gray-500">套餐用于抵扣产品对应计费项的费用，购买后立即生效，到期作废</p>
                            </div>
                            
                            {/* 套餐详情 */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">套餐名称</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedPackage.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">套餐类型</span>
                                    <span className="text-sm font-medium text-gray-900">总价包</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">购买时长</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedPackage.validity}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">官方标准价</span>
                                    <span className="text-sm text-gray-400">¥ {selectedPackage.originalPriceNum}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">购买价</span>
                                    <span className="text-sm font-bold text-red-500">{selectedPackage.price}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">购买数量</span>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number" 
                                            value={orderQuantity}
                                            onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 h-6 text-center border border-gray-300 rounded text-sm"
                                            min="1"
                                        />
                                        <button 
                                            onClick={() => setOrderQuantity(orderQuantity + 1)}
                                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 底部 */}
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">应付金额：</span>
                                <span className="text-xl font-bold text-orange-500">¥{(selectedPackage.priceNum * orderQuantity).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setOrderDrawerOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={confirmOrder}
                                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    确认订单
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 支付抽屉 */}
            {payDrawerOpen && selectedPackage && (
                <div className="fixed inset-0 z-[2001]">
                    <div className="absolute inset-0 bg-black/50" onClick={closePayDrawer} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl">
                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">订单支付</h3>
                            <button 
                                onClick={closePayDrawer}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        
                        {/* 内容区 */}
                        <div className="px-6 py-4 space-y-4">
                            {/* 订单信息 */}
                            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">产品名称</span>
                                    <span className="text-sm font-medium text-gray-900">360智汇云套餐</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">商品名称</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedPackage.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">商品配置</span>
                                    <span className="text-sm font-medium text-gray-900">总价包</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">购买数量</span>
                                    <span className="text-sm font-medium text-gray-900">{orderQuantity}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <span className="text-sm text-gray-500">应付金额</span>
                                    <span className="text-lg font-bold text-orange-500">¥{(selectedPackage.priceNum * orderQuantity).toFixed(2)}</span>
                                </div>
                            </div>
                            
                            {/* 支付提示 */}
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <span className="text-yellow-500">⚠️</span>
                                <span className="text-sm text-yellow-700">支付结果返回前不要重复支付</span>
                            </div>
                            
                            {/* 支付方式 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1677FF">
                                        <path d="M21.422 15.358c-3.277-.89-4.328-1.278-4.328-1.278s-.89 2.56-1.778 4.156c-.334.598-.668 1.128-.945 1.5-.277.373-.5.557-.667.612-.168.056-.334.028-.445-.056-.167-.11-.223-.334-.223-.612 0-.334.056-.724.167-1.178.056-.223.111-.45.167-.68l.083-.333c.111-.45.223-.89.334-1.28.111-.389.167-.722.167-1-.001-.277-.056-.5-.167-.667-.111-.167-.278-.278-.5-.333-.223-.056-.5-.083-.834-.083-.334 0-.667.056-1 .167-.334.111-.612.278-.834.5-.223.223-.334.5-.334.834 0 .334.056.667.167 1 .111.334.223.667.334 1 .056.111.111.278.167.445.056.167.111.389.167.612.111.389.167.778.167 1.167 0 .389-.056.722-.167 1-.111.278-.278.5-.5.667-.223.167-.5.278-.834.334-.334.056-.722.083-1.167.083-.5 0-.945-.056-1.334-.167-.389-.111-.722-.278-1-.5-.278-.223-.5-.5-.667-.834-.167-.334-.278-.722-.334-1.167-.056-.445-.056-.945 0-1.5.056-.556.167-1.167.334-1.834.167-.667.389-1.389.667-2.167.278-.778.612-1.612 1-2.5-2.223-.445-4.278-.945-6.167-1.5-.334 1.334-.556 2.612-.667 3.834-.111 1.223-.056 2.334.167 3.334.223 1 .612 1.89 1.167 2.667.556.778 1.278 1.389 2.167 1.834.889.445 1.945.667 3.167.667 1.223 0 2.278-.222 3.167-.667.889-.445 1.612-1.056 2.167-1.834.556-.778.945-1.667 1.167-2.667.223-1 .278-2.111.167-3.334-.111-1.223-.333-2.5-.667-3.834-1.89.556-3.945 1.056-6.167 1.5.389.889.722 1.722 1 2.5.278.778.5 1.5.667 2.167.167.667.278 1.278.334 1.834.056.556.056 1.056 0 1.5-.056.445-.167.834-.334 1.167-.167.334-.389.612-.667.834-.278.223-.612.389-1 .5-.389.111-.834.167-1.334.167-.445 0-.834-.028-1.167-.083-.334-.056-.612-.167-.834-.334-.223-.167-.389-.389-.5-.667-.111-.278-.167-.612-.167-1 0-.389.056-.778.167-1.167.056-.223.111-.445.167-.612.056-.167.111-.334.167-.445.111-.334.223-.667.334-1 .111-.334.167-.667.167-1 0-.334-.111-.612-.334-.834-.223-.223-.5-.389-.834-.5-.334-.111-.667-.167-1-.167-.334 0-.612.028-.834.083-.223.056-.389.167-.5.333-.111.167-.167.389-.167.667 0 .278.056.612.167 1 .111.389.223.834.334 1.28l.083.333c.056.223.111.45.167.68.111.445.167.834.167 1.178 0 .278-.056.5-.223.612-.111.083-.278.111-.445.056-.167-.056-.389-.239-.667-.612-.278-.373-.612-.903-.945-1.5-.889-1.596-1.778-4.156-1.778-4.156s-1.056.389-4.328 1.278c.5 1.334 1.056 2.612 1.667 3.834.612 1.223 1.334 2.334 2.167 3.334.834 1 1.778 1.834 2.834 2.5 1.056.667 2.278 1.167 3.667 1.5 1.389.334 2.945.5 4.667.5 1.722 0 3.278-.167 4.667-.5 1.389-.334 2.612-.834 3.667-1.5 1.056-.667 2-1.5 2.834-2.5.834-1 1.556-2.111 2.167-3.334.612-1.223 1.167-2.5 1.667-3.834z"/>
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">使用支付宝扫码支付</span>
                                </div>
                                
                                {/* 二维码 */}
                                <div className="flex justify-center py-4">
                                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                        {/* 模拟二维码 */}
                                        <svg className="w-40 h-40" viewBox="0 0 100 100">
                                            <rect x="10" y="10" width="20" height="20" fill="#000"/>
                                            <rect x="35" y="10" width="10" height="10" fill="#000"/>
                                            <rect x="50" y="10" width="10" height="10" fill="#000"/>
                                            <rect x="70" y="10" width="20" height="20" fill="#000"/>
                                            <rect x="10" y="35" width="10" height="10" fill="#000"/>
                                            <rect x="25" y="35" width="10" height="10" fill="#000"/>
                                            <rect x="45" y="35" width="20" height="10" fill="#000"/>
                                            <rect x="75" y="35" width="15" height="10" fill="#000"/>
                                            <rect x="10" y="50" width="10" height="20" fill="#000"/>
                                            <rect x="25" y="55" width="15" height="10" fill="#000"/>
                                            <rect x="50" y="50" width="10" height="10" fill="#000"/>
                                            <rect x="65" y="55" width="10" height="15" fill="#000"/>
                                            <rect x="10" y="70" width="20" height="20" fill="#000"/>
                                            <rect x="35" y="75" width="10" height="10" fill="#000"/>
                                            <rect x="50" y="70" width="20" height="10" fill="#000"/>
                                            <rect x="75" y="75" width="15" height="15" fill="#000"/>
                                            {/* 更多随机方块 */}
                                            <rect x="15" y="15" width="10" height="10" fill="#fff"/>
                                            <rect x="75" y="15" width="10" height="10" fill="#fff"/>
                                            <rect x="15" y="75" width="10" height="10" fill="#fff"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 底部 */}
                        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            {orderSuccess ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Check className="w-6 h-6" />
                                        <span className="font-medium">支付成功！订单已生成</span>
                                    </div>
                                    <button 
                                        onClick={closePayDrawer}
                                        className="px-6 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        完成
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={handlePaySuccess}
                                    className="w-full py-3 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    支付成功
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
            <div className="text-gray-500">加载中...</div>
        </div>
    );
}

// Default export with Suspense boundary
export default function EnterpriseAdminPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <EnterpriseAdminContent />
        </Suspense>
    );
}
