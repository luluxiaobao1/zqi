"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    Home,
    Bell,
    HelpCircle,
    User,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Menu,
    FileText,
    Building2,
    Sparkles,
    MessageSquare,
    DollarSign,
    Wallet,
    Receipt,
    Package,
    Search,
    Calendar,
    RefreshCw,
    Download,
    LogOut,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

// 用户角色类型
type UserRole = 'owner' | 'admin' | 'member';

// 角色配置
const roleConfig: Record<UserRole, { label: string; bgColor: string }> = {
    owner: { label: '主账号', bgColor: 'bg-blue-500' },
    admin: { label: '管理员', bgColor: 'bg-orange-500' },
    member: { label: '成员', bgColor: 'bg-green-500' },
};

// 预设企业列表
const enterpriseList = [
    { 
        id: 1, 
        name: "张三", 
        icon: "企", 
        role: 'owner' as UserRole,
        active: true,
        currentPackage: 2,
        adminAccount: null,
        quotaExhausted: false
    },
    { 
        id: 2, 
        name: "李四", 
        icon: "企", 
        role: 'admin' as UserRole,
        active: false,
        currentPackage: null,
        adminAccount: null,
        quotaExhausted: false
    },
    { 
        id: 3, 
        name: "王五", 
        icon: "企", 
        role: 'member' as UserRole,
        active: false,
        currentPackage: null,
        adminAccount: 'zhaoliu',
        quotaExhausted: false
    },
];

// 快捷操作
const quickActions = [{
    name: "AI对话",
    icon: MessageSquare,
    desc: "智能问答与代码生成",
    color: "bg-blue-500"
}, {
    name: "文档助手",
    icon: FileText,
    desc: "快速查阅产品文档",
    color: "bg-green-500"
}, {
    name: "快捷操作",
    icon: Sparkles,
    desc: "常用功能一键直达",
    color: "bg-orange-500"
}];

// 收支明细数据
const incomeExpenseData = [
    { id: 1, time: "2026.03.17 10:48:57", type: "支出", channel: "余额", amount: -2970316.80, balance: 0.00, service: "大模型", serialNo: "BT001507141773715737E55E4F2B3021752C", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBF7" },
    { id: 2, time: "2026.03.16 19:08:22", type: "支出", channel: "余额", amount: -18604.80, balance: 0.00, service: "龙虾", serialNo: "BT001507141773715737E55E4F2B3021752D", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBF8" },
    { id: 3, time: "2026.03.16 19:07:22", type: "支出", channel: "余额", amount: -21830.40, balance: 0.00, service: "APICloud", serialNo: "BT001507141773715737E55E4F2B3021752E", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBF9" },
    { id: 4, time: "2026.03.16 19:01:37", type: "支出", channel: "余额", amount: -36172.80, balance: 0.00, service: "大模型", serialNo: "BT001507141773715737E55E4F2B3021752F", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBFA" },
    { id: 5, time: "2026.03.13 20:36:44", type: "支出", channel: "余额", amount: -96076.80, balance: 0.00, service: "龙虾", serialNo: "BT001507141773715737E55E4F2B30217530", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBFB" },
    { id: 6, time: "2026.03.13 20:26:25", type: "支出", channel: "余额", amount: -48038.40, balance: 0.00, service: "APICloud", serialNo: "BT001507141773715737E55E4F2B30217531", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBFC" },
    { id: 7, time: "2026.03.13 18:53:51", type: "支出", channel: "余额", amount: -87321.60, balance: 0.00, service: "大模型", serialNo: "BT001507141773715737E55E4F2B30217532", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBFD" },
    { id: 8, time: "2026.03.13 18:41:01", type: "支出", channel: "余额", amount: -87321.60, balance: 0.00, service: "龙虾", serialNo: "BT001507141773715737E55E4F2B30217533", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBFE" },
    { id: 9, time: "2026.03.13 18:21:55", type: "支出", channel: "余额", amount: -21830.40, balance: 0.00, service: "APICloud", serialNo: "BT001507141773715737E55E4F2B30217534", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EBFF" },
    { id: 10, time: "2026.03.13 18:21:06", type: "支出", channel: "余额", amount: -87321.60, balance: 0.00, service: "大模型", serialNo: "BT001507141773715737E55E4F2B30217535", billId: "ZY0020061692AA9F0BE95617A1F6DDA72EC00" },
];

// 产品列表
const products = [
    "全部产品",
    "大模型",
    "龙虾",
    "APICloud",
];

export default function IncomeExpensePage() {
    const router = useRouter();
    const [username, setUsername] = useState('未登录');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(enterpriseList[0]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // 左侧菜单展开状态
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['资金管理', '账单管理', '商品订单']));
    const [activeMenu, setActiveMenu] = useState("收支明细");
    
    // 搜索筛选
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("全部产品");
    
    // 展开行状态
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([1])); // 默认展开第一条
    
    // 分页
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalRecords = 159;
    const totalPages = Math.ceil(totalRecords / pageSize);
    
    // 切换行展开状态
    const toggleRow = (id: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    // 当前用户角色
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

    // 权限检查：成员也可以访问费用页面，但只能看到部分菜单
    // useEffect(() => {
    //     if (currentUserRole === 'member') {
    //         router.push('/enterprise');
    //     }
    // }, [currentUserRole, router]);

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

    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem('zhiqi_logged_in');
        localStorage.removeItem('zhiqi_user_info');
        setUserMenuOpen(false);
        window.location.href = '/zhiqi/login';
    };

    // 格式化金额
    const formatMoney = (amount: number) => {
        return amount.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // 重置筛选
    const handleReset = () => {
        setSearchQuery("");
        setStartDate("");
        setEndDate("");
        setSelectedProduct("全部产品");
    };

    // 左侧菜单配置 - 根据角色过滤显示
    const allMenuConfig = [
        {
            name: "资金管理",
            icon: Wallet,
            roles: ['owner', 'admin'] as UserRole[], // 仅管理员可见
            children: [
                { name: "资金概览", href: "/enterprise/cost" },
                { name: "收支明细", href: "/enterprise/cost/income-expense" },
            ]
        },
        {
            name: "账单管理",
            icon: Receipt,
            roles: ['owner', 'admin', 'member'] as UserRole[], // 所有人可见
            children: [
                { name: "账单概览", href: "/enterprise/cost/bill" },
                { name: "计费明细", href: "/enterprise/cost/billing" },
            ]
        },
        {
            name: "商品订单",
            icon: Package,
            roles: ['owner', 'admin', 'member'] as UserRole[], // 所有人可见
            children: [
                { name: "商品订单", href: "/enterprise/cost/orders" },
            ]
        },
        {
            name: "已购套餐",
            icon: Sparkles,
            roles: ['owner', 'admin', 'member'] as UserRole[], // 所有人可见
            children: [
                { name: "已购套餐", href: "/enterprise/cost/purchased-packages" },
            ]
        },
    ];

    // 根据当前角色过滤菜单
    const menuConfig = allMenuConfig.filter(item => item.roles.includes(currentUserRole));

    // 渲染分页
    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        // 上一页
        pages.push(
            <button
                key="prev"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                &lt;
            </button>
        );
        
        // 页码
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="ellipsis1" className="px-2">...</span>);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 text-sm border rounded ${
                        currentPage === i
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    {i}
                </button>
            );
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis2" className="px-2">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                    {totalPages}
                </button>
            );
        }
        
        // 下一页
        pages.push(
            <button
                key="next"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                &gt;
            </button>
        );
        
        return pages;
    };

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            {/* 顶部导航栏 - 和企业入口页面一样 */}
            <header className="fixed top-0 left-0 right-0 h-[50px] bg-white z-[1000] flex items-center justify-between px-4 border-b border-gray-100">
                <div className="flex items-center">
                    {/* Logo */}
                    <Link href="/zhiqi/console" className="flex items-center mr-4">
                        <div className="flex items-center">
                            {/* 双环图形Logo */}
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mr-1.5">
                                <path
                                    d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z"
                                    fill="#1a5cff" />
                                <path d="M22 6L24 10L20 10L22 6Z" fill="#1a5cff" />
                                <path
                                    d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z"
                                    fill="#00d4aa" />
                                <path d="M19 3L21 7L17 7L19 3Z" fill="#00d4aa" />
                            </svg>
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
                    <a href="/enterprise/cost" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">费用</a>
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
                    {/* 页面标题 */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-gray-400">资金管理</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900">收支明细</span>
                        </div>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            帮助文档
                        </Link>
                    </div>

                    {/* 搜索筛选栏 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* 搜索框 */}
                            <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="流水号/账单ID/订单ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-9 pl-9 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            
                            {/* 日期选择 */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="h-9 pl-9 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <span className="text-gray-500">~</span>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="h-9 pl-9 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            
                            {/* 产品选择 */}
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            >
                                {products.map((product) => (
                                    <option key={product} value={product}>{product}</option>
                                ))}
                            </select>
                            
                            {/* 操作按钮 */}
                            <button
                                onClick={handleReset}
                                className="h-9 px-4 text-sm text-gray-600 hover:text-gray-800"
                            >
                                重置
                            </button>
                            <button
                                className="h-9 px-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Download className="w-4 h-4" />
                                导出数据
                            </button>
                        </div>
                    </div>

                    {/* 数据表格 */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-2 py-3 w-10"></th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">交易时间</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">收支类型</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">交易渠道</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">交易金额(¥)</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">现金余额(¥)</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">交易产品</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomeExpenseData.map((item) => {
                                    const isExpanded = expandedRows.has(item.id);
                                    return (
                                        <React.Fragment key={item.id}>
                                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="px-2 py-3 text-center">
                                                    <button
                                                        onClick={() => toggleRow(item.id)}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                                    >
                                                        {isExpanded ? '−' : '+'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{item.time}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{item.channel}</td>
                                                <td className="px-4 py-3 text-sm text-red-500 text-right">{formatMoney(item.amount)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatMoney(item.balance)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{item.service}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                                                        查看账单
                                                    </Link>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <td colSpan={8} className="px-6 py-3">
                                                        <div className="flex flex-col gap-1 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500">流水号:</span>
                                                                <span className="text-gray-900">{item.serialNo}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500">账单ID/订单ID:</span>
                                                                <span className="text-gray-900">{item.billId}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* 分页栏 */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            共{totalRecords}条记录 第{currentPage} / {totalPages}页
                        </div>
                        <div className="flex items-center gap-2">
                            {renderPagination()}
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="h-8 px-2 border border-gray-300 rounded text-sm ml-4"
                            >
                                <option value={10}>10条/页</option>
                                <option value={20}>20条/页</option>
                                <option value={50}>50条/页</option>
                            </select>
                            <div className="flex items-center gap-1 ml-4">
                                <span className="text-sm text-gray-500">跳至</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={totalPages}
                                    value={currentPage}
                                    onChange={(e) => setCurrentPage(Math.min(totalPages, Math.max(1, Number(e.target.value))))}
                                    className="w-12 h-8 px-2 border border-gray-300 rounded text-sm text-center"
                                />
                                <span className="text-sm text-gray-500">页</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 企业切换弹框 */}
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
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {enterpriseList.map((enterprise) => (
                                <button
                                    key={enterprise.id}
                                    onClick={() => {
                                        setSelectedEnterprise(enterprise);
                                        setEnterpriseDialogOpen(false);
                                    }}
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
                                        <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
