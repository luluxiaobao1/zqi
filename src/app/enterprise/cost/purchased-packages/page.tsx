"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import {
    User,
    ChevronDown,
    Building2,
    Sparkles,
    Wallet,
    Receipt,
    Package,
    Calendar,
    Download,
    Search,
    RefreshCw,
    LogOut,
    Info,
} from "lucide-react";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// 用户角色类型
type UserRole = 'owner' | 'admin' | 'member';

// 角色配置
const roleConfig: Record<UserRole, { label: string; bgColor: string }> = {
    owner: { label: '主账号', bgColor: 'bg-blue-500' },
    admin: { label: '管理员', bgColor: 'bg-orange-500' },
    member: { label: '成员', bgColor: 'bg-green-500' },
};

// 企业列表 - 与其他费用页面保持一致
const enterpriseList = [
    { 
        id: 1, 
        name: "张三", 
        icon: "企", 
        role: 'owner' as UserRole,  // 主账号
    },
    { 
        id: 2, 
        name: "李四", 
        icon: "企", 
        role: 'admin' as UserRole,  // 管理员
    },
    { 
        id: 3, 
        name: "王五", 
        icon: "企", 
        role: 'member' as UserRole,  // 成员
    },
];

// 套餐状态
type PackageStatus = 'active' | 'expired';

// 续费状态
type RenewStatus = 'renewing' | 'stopped' | 'auto';

// 已购套餐数据
const purchasedPackagesData = [
    {
        id: 1,
        taskId: "ZY002006169217D5AD922F7006CE225B3AF1",
        name: "AI计划高级包",
        product: "智企",
        type: "月包",
        quantity: 2,
        status: 'active' as PackageStatus,
        validity: "1个月",
        renewStatus: 'renewing' as RenewStatus,
        purchaser: "张三",
        startTime: "2026-04-14 12:00:00",
        endTime: "2026-05-14 12:00:00",
        resourceGroup: "AI实验室",
        totalQuota: "TAI-H800-80G-基础版 1152卡时",
        usedQuota: "TAI-H800-80G-基础版 0/1152卡时",
        remainingQuota: "TAI-H800-80G-基础版 1152卡时",
    },
    {
        id: 2,
        taskId: "ZY0020061683BBE1DCF04828B2G7EEB83FCG8",
        name: "龙虾高级包",
        product: "智企",
        type: "月包",
        quantity: 2,
        status: 'active' as PackageStatus,
        validity: "1个月",
        renewStatus: 'stopped' as RenewStatus,
        purchaser: "张三",
        startTime: "2026-04-10 09:30:00",
        endTime: "2026-05-10 09:30:00",
        resourceGroup: "城市产业事业部",
        totalQuota: "TAI-H800-80G-基础版 1152卡时",
        usedQuota: "TAI-H800-80G-基础版 0/1152卡时",
        remainingQuota: "TAI-H800-80G-基础版 1152卡时",
    },
    {
        id: 3,
        taskId: "ZY0020061674CCF2EDG15939C3H8FFC94GDH9",
        name: "AI计划基础包",
        product: "智企",
        type: "加油包",
        quantity: 1,
        status: 'expired' as PackageStatus,
        validity: "1个月",
        renewStatus: 'stopped' as RenewStatus,
        purchaser: "李四",
        startTime: "2026-02-01 00:00:00",
        endTime: "2026-03-01 00:00:00",
        resourceGroup: "AI实验室",
        totalQuota: "TAI-A30-24G-标准版 576卡时",
        usedQuota: "TAI-A30-24G-标准版 576/576卡时",
        remainingQuota: "TAI-A30-24G-标准版 0卡时",
    },
    {
        id: 4,
        taskId: "ZY0020061665DDG3FEH26040D4I9GGD05HEI0",
        name: "龙虾基础包",
        product: "智企",
        type: "加油包",
        quantity: 5,
        status: 'active' as PackageStatus,
        validity: "3个月",
        renewStatus: 'auto' as RenewStatus,
        purchaser: "王五",
        startTime: "2026-03-20 16:00:00",
        endTime: "2026-06-20 16:00:00",
        resourceGroup: "研发中心",
        totalQuota: "TAI-V100-32G-高级版 720卡时",
        usedQuota: "TAI-V100-32G-高级版 320/720卡时",
        remainingQuota: "TAI-V100-32G-高级版 400卡时",
    },
];

export default function PurchasedPackagesPage() {
    const [username, setUsername] = useState('未登录');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(enterpriseList[0]);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['资金管理', '账单管理', '商品订单', '已购套餐']));
    const [activeMenu, setActiveMenu] = useState("已购套餐");

    // 筛选相关状态
    const [searchName, setSearchName] = useState("");
    const [filterProduct, setFilterProduct] = useState("all");
    const [filterRenewStatus, setFilterRenewStatus] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    // 展开行
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const currentUserRole = selectedEnterprise.role;

    // 初始化时从localStorage读取用户信息（使用zhiqi登录态）
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('zhiqi_logged_in');
        if (!isLoggedIn) {
            window.location.href = '/zhiqi/login';
            return;
        }
        const userInfoStr = localStorage.getItem('zhiqi_user_info');
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                const name = userInfo.name || userInfo.phone || userInfo.account || '用户';
                setUsername(name);
            } catch (e) {
                setUsername('用户');
            }
        }
    }, []);

    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem('zhiqi_logged_in');
        localStorage.removeItem('zhiqi_user_info');
        setUserMenuOpen(false);
        window.location.href = '/zhiqi/login';
    };

    // 切换菜单展开状态
    const toggleMenu = (menuName: string) => {
        const newExpanded = new Set(expandedMenus);
        if (newExpanded.has(menuName)) {
            newExpanded.delete(menuName);
        } else {
            newExpanded.add(menuName);
        }
        setExpandedMenus(newExpanded);
    };

    // 左侧菜单配置
    const allMenuConfig = [
        {
            name: "资金管理",
            icon: Wallet,
            roles: ['owner', 'admin'] as UserRole[],
            children: [
                { name: "资金概览", href: "/enterprise/cost" },
                { name: "收支明细", href: "/enterprise/cost/income-expense" },
            ]
        },
        {
            name: "账单管理",
            icon: Receipt,
            roles: ['owner', 'admin', 'member'] as UserRole[],
            children: [
                { name: "账单概览", href: "/enterprise/cost/bill" },
                { name: "计费明细", href: "/enterprise/cost/billing" },
            ]
        },
        {
            name: "商品订单",
            icon: Package,
            roles: ['owner', 'admin', 'member'] as UserRole[],
            children: [
                { name: "商品订单", href: "/enterprise/cost/orders" },
            ]
        },
        {
            name: "已购套餐",
            icon: Sparkles,
            roles: ['owner', 'admin', 'member'] as UserRole[],
            children: [
                { name: "已购套餐", href: "/enterprise/cost/purchased-packages" },
            ]
        },
    ];

    const menuConfig = allMenuConfig.filter(item => item.roles.includes(currentUserRole));

    // 筛选数据
    const filteredPackages = purchasedPackagesData.filter(pkg => {
        if (searchName && !pkg.name.toLowerCase().includes(searchName.toLowerCase())) return false;
        if (filterProduct !== "all" && pkg.product !== filterProduct) return false;
        if (filterRenewStatus !== "all" && pkg.renewStatus !== filterRenewStatus) return false;
        if (filterStatus !== "all" && pkg.status !== filterStatus) return false;
        if (dateRange.start && pkg.startTime < dateRange.start) return false;
        if (dateRange.end && pkg.endTime > dateRange.end + " 23:59:59") return false;
        return true;
    });

    const activeCount = purchasedPackagesData.filter(p => p.status === 'active').length;
    const expiredCount = purchasedPackagesData.filter(p => p.status === 'expired').length;

    // 重置筛选
    const resetFilters = () => {
        setSearchName("");
        setFilterProduct("all");
        setFilterRenewStatus("all");
        setFilterStatus("all");
        setDateRange({ start: "", end: "" });
    };

    const getRenewStatusLabel = (status: RenewStatus) => {
        switch (status) {
            case 'renewing': return '发放中';
            case 'stopped': return '停止发放';
            case 'auto': return '自动续费';
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            {/* 顶部导航栏 - 与智企控制台保持一致 */}
            <header className="fixed top-0 left-0 right-0 h-[50px] bg-white z-[1000] flex items-center justify-between px-4 border-b border-gray-100">
                <div className="flex items-center">
                    {/* Logo */}
                    <Link href="/zhiqi/console" className="flex items-center mr-4">
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
                        <div className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-sm">
                            <span className="w-4 h-4 bg-[#006bff] rounded text-white text-xs flex items-center justify-center mr-2">{selectedEnterprise.icon}</span>
                            <span className="text-gray-700">{selectedEnterprise.name}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    {/* 功能入口 */}
                    {/* 费用按钮 - 所有角色可见 */}
                    <a
                        href="/enterprise/cost"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">费用
                    </a>
                    <Link href="#" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">工单</Link>
                    <Link href="#" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 mr-2">帮助</Link>
                    {/* 分隔线 */}
                    <div className="w-px h-5 bg-gray-300 mx-3"></div>
                    {/* 用户入口 */}
                    <div className="relative">
                        <div
                            className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2">
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
                                                window.open('/zhiqi/console/organization', '_blank');
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

            {/* 左侧导航栏 */}
            <aside className={`fixed left-0 top-[50px] h-[calc(100vh-50px)] bg-white z-[999] transition-all duration-300 border-r border-gray-200 ${sidebarCollapsed ? "w-[60px]" : "w-[200px]"}`}>
                {/* 标题 */}
                <div className="h-12 flex items-center px-4 border-b border-gray-100">
                    {!sidebarCollapsed && (
                        <span className="text-base font-semibold text-gray-900">费用</span>
                    )}
                </div>
                
                {/* 菜单列表 */}
                <nav className="p-2 pt-3 flex-1 overflow-y-auto">
                    {menuConfig.map((group) => {
                        const isExpanded = expandedMenus.has(group.name);
                        const Icon = group.icon;
                        
                        return (
                            <div key={group.name} className="mb-1">
                                {/* 父菜单 */}
                                <div
                                    className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
                                        sidebarCollapsed ? 'justify-center' : ''
                                    } hover:bg-gray-50`}
                                    onClick={() => !sidebarCollapsed && toggleMenu(group.name)}
                                >
                                    <Icon className={`w-4 h-4 text-gray-500 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="flex-1 text-sm text-gray-700">{group.name}</span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </>
                                    )}
                                </div>
                                
                                {/* 子菜单 */}
                                {!sidebarCollapsed && isExpanded && group.children.map((child) => (
                                    <Link
                                        key={child.name}
                                        href={child.href}
                                        onClick={() => setActiveMenu(child.name)}
                                        className={`flex items-center px-3 py-2 ml-4 rounded-md transition-colors ${
                                            activeMenu === child.name
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        <span className="text-sm">{child.name}</span>
                                    </Link>
                                ))}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* 主内容区 */}
            <main className={`pt-[50px] transition-all duration-300 ${sidebarCollapsed ? 'pl-[60px]' : 'pl-[200px]'}`}>
                <div className="p-6">
                    {/* 状态统计 + 购买按钮 */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm text-blue-600 font-medium">生效中</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>当前处于有效状态的套餐数量</TooltipContent>
                                </Tooltip>
                                <span className="text-sm font-semibold text-blue-600 ml-1">{activeCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm text-red-600 font-medium">已失效</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>已过期或已用尽的套餐数量</TooltipContent>
                                </Tooltip>
                                <span className="text-sm font-semibold text-red-600 ml-1">{expiredCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* 筛选搜索栏 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* 套餐名称搜索 */}
                            <div className="relative w-56">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="套餐名称搜索"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* 全部产品 */}
                            <select
                                value={filterProduct}
                                onChange={(e) => setFilterProduct(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                            >
                                <option value="all">全部产品</option>
                                <option value="智企">智企</option>
                            </select>

                            {/* 续费/发放状态 */}
                            <select
                                value={filterRenewStatus}
                                onChange={(e) => setFilterRenewStatus(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                            >
                                <option value="all">续费/发放状态</option>
                                <option value="renewing">发放中</option>
                                <option value="stopped">停止发放</option>
                                <option value="auto">自动续费</option>
                            </select>

                            {/* 套餐状态 */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                            >
                                <option value="all">套餐状态</option>
                                <option value="active">生效</option>
                                <option value="expired">已失效</option>
                            </select>

                            {/* 日期范围 */}
                            <div className="flex items-center gap-1">
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                                />
                                <span className="text-gray-400 text-sm">~</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
                                />
                            </div>

                            {/* 重置 / 导出 */}
                            <button
                                onClick={resetFilters}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                重置
                            </button>
                            <button className="px-3 py-2 text-sm text-[#006bff] hover:text-blue-600 transition-colors flex items-center gap-1">
                                <Download className="w-3.5 h-3.5" />
                                导出数据
                            </button>
                        </div>
                    </div>

                    {/* 数据表格 */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-left">购买任务ID</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-left">套餐名称</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-left">所属产品</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-center">数量</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-center">套餐状态</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-left">有效期</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-left">续费状态</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-left">购买人</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-left">生效时间</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 text-left">到期时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPackages.map((pkg) => (
                                    <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <span className="text-xs text-gray-600 font-mono" title={pkg.taskId}>
                                                {pkg.taskId.length > 18 ? pkg.taskId.substring(0, 18) + '...' : pkg.taskId}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-900">{pkg.name}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-600">{pkg.product}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-sm text-gray-900">{pkg.quantity}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-2 py-0.5 text-xs rounded ${
                                                pkg.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                                {pkg.status === 'active' ? '生效' : '已失效'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-600">{pkg.validity}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs ${
                                                pkg.renewStatus === 'renewing' ? 'text-blue-600' :
                                                pkg.renewStatus === 'stopped' ? 'text-gray-500' :
                                                'text-green-600'
                                            }`}>
                                                {getRenewStatusLabel(pkg.renewStatus)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-700">{pkg.purchaser}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs text-gray-600">{pkg.startTime}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs text-gray-600">{pkg.endTime}</span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPackages.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="py-12 text-center text-gray-400">
                                            暂无数据
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* 企业切换弹窗 - 与智企控制台保持一致 */}
            {enterpriseDialogOpen && <div
                className="fixed inset-0 z-[2000] flex items-center justify-center"
                onClick={() => setEnterpriseDialogOpen(false)}>
                <div className="absolute inset-0 bg-black/50" />
                <div
                    className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                    onClick={e => e.stopPropagation()}>
                    <div
                        className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                <span className="text-lg font-semibold text-gray-900">选择企业</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">请选择要切换的企业账号</p>
                        </div>
                        <button
                            onClick={() => setEnterpriseDialogOpen(false)}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 space-y-2">
                        {enterpriseList.map(enterprise => <button
                            key={enterprise.id}
                            onClick={() => {
                                setSelectedEnterprise(enterprise);
                                setEnterpriseDialogOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${selectedEnterprise.id === enterprise.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                            <span
                                className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${selectedEnterprise.id === enterprise.id ? "bg-blue-600" : "bg-gray-400"}`}>{enterprise.icon}</span>
                            <div className="flex-1">
                                <div className={`font-medium ${selectedEnterprise.id === enterprise.id ? "text-blue-600" : "text-gray-700"}`}>{enterprise.name}</div>
                            </div>
                            {selectedEnterprise.id === enterprise.id && <span
                                className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>}
                        </button>)}
                    </div>
                </div>
            </div>}
        </div>
    );
}
