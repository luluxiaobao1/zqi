"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    User,
    ChevronDown,
    ChevronRight,
    Building2,
    Sparkles,
    Wallet,
    Receipt,
    Package,
    Calendar,
    Download,
    LogOut,
} from "lucide-react";

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
    { 
        id: 4, 
        name: "赵六", 
        icon: "企", 
        role: 'member' as UserRole,
        active: false,
    },
];

// 套餐状态类型
type PackageStatus = 'active' | 'expired' | 'pending';

// 套餐状态配置
const packageStatusConfig: Record<PackageStatus, { label: string; color: string }> = {
    active: { label: '生效', color: 'text-green-600 bg-green-50' },
    expired: { label: '已过期', color: 'text-gray-600 bg-gray-100' },
    pending: { label: '待生效', color: 'text-blue-600 bg-blue-50' },
};

// 续费状态类型
type RenewalStatus = 'issued' | 'issuing' | 'pending';

// 续费状态配置
const renewalStatusConfig: Record<RenewalStatus, { label: string }> = {
    issued: { label: '发放' },
    issuing: { label: '发放中' },
    pending: { label: '待发放' },
};

// 已购套餐数据
const packagesData = [
    {
        id: 1,
        taskId: "ZY0020061692AA9F0BE95617A1F6DDA72EBF7",
        packageName: "H800-80G-基础版-8卡",
        productName: "大模型",
        packageType: "总量节省",
        quantity: 22,
        packageStatus: 'active' as PackageStatus,
        validityPeriod: "1个月",
        renewalStatus: 'issued' as RenewalStatus,
        effectiveTime: "2026-03-17 10:00:00",
        expiryTime: "2026-04-16 10:00:00",
    },
    {
        id: 2,
        taskId: "ZY002006169274C0A1F7A09038702869FBC03",
        packageName: "A30-24G-标准版-8卡",
        productName: "大模型",
        packageType: "总量节省",
        quantity: 1,
        packageStatus: 'active' as PackageStatus,
        validityPeriod: "1个月",
        renewalStatus: 'issuing' as RenewalStatus,
        effectiveTime: "2026-03-16 19:00:00",
        expiryTime: "2026-04-15 19:00:00",
    },
    {
        id: 3,
        taskId: "ZY0020061683BBE1DCF04828B2G7EEB83FCG8",
        packageName: "A100-40G-专业版-4卡",
        productName: "龙虾",
        packageType: "总量节省",
        quantity: 5,
        packageStatus: 'active' as PackageStatus,
        validityPeriod: "3个月",
        renewalStatus: 'issued' as RenewalStatus,
        effectiveTime: "2026-03-15 09:00:00",
        expiryTime: "2026-06-14 09:00:00",
    },
    {
        id: 4,
        taskId: "ZY0020061674CCF2EDG15939C3H8FFC94GDH9",
        packageName: "V100-32G-高级版-2卡",
        productName: "龙虾",
        packageType: "总量节省",
        quantity: 3,
        packageStatus: 'expired' as PackageStatus,
        validityPeriod: "1个月",
        renewalStatus: 'issued' as RenewalStatus,
        effectiveTime: "2026-02-14 16:00:00",
        expiryTime: "2026-03-14 16:00:00",
    },
    {
        id: 5,
        taskId: "ZY0020061665DDG3FEH26040D4I9GGD05HEI0",
        packageName: "T4-16G-入门版-4卡",
        productName: "APICloud",
        packageType: "总量节省",
        quantity: 10,
        packageStatus: 'pending' as PackageStatus,
        validityPeriod: "1个月",
        renewalStatus: 'pending' as RenewalStatus,
        effectiveTime: "2026-03-20 00:00:00",
        expiryTime: "2026-04-19 00:00:00",
    },
];

export default function PackagesPage() {
    const router = useRouter();
    const [username, setUsername] = useState('未登录');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(enterpriseList[0]);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // 左侧菜单展开状态
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['资金管理', '账单管理', '商品订单']));
    const [activeMenu, setActiveMenu] = useState("已购套餐");
    
    // 筛选条件
    const [searchKeyword, setSearchKeyword] = useState("");
    const [renewalStatusFilter, setRenewalStatusFilter] = useState<string>("all");
    const [packageStatusFilter, setPackageStatusFilter] = useState<string>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    // 表格数据
    const [tableData, setTableData] = useState(packagesData);

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

    // 重置筛选
    const handleReset = () => {
        setSearchKeyword("");
        setRenewalStatusFilter("all");
        setPackageStatusFilter("all");
        setStartDate("");
        setEndDate("");
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

    // 续费状态选项
    const renewalStatusOptions = [
        { value: "all", label: "续费/发放状态" },
        { value: "issued", label: "发放" },
        { value: "issuing", label: "发放中" },
        { value: "pending", label: "待发放" },
    ];

    // 套餐状态选项
    const packageStatusOptions = [
        { value: "all", label: "套餐状态" },
        { value: "active", label: "生效" },
        { value: "expired", label: "已过期" },
        { value: "pending", label: "待生效" },
    ];

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            {/* 顶部导航栏 */}
            <header className="fixed top-0 left-0 right-0 h-[50px] bg-white z-[1000] flex items-center justify-between px-4 border-b border-gray-100">
                <div className="flex items-center">
                    <Link href="/zhiqi/console" className="flex items-center mr-4">
                        <div className="flex items-center">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mr-1.5">
                                <path d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z" fill="#1a5cff" />
                                <path d="M22 6L24 10L20 10L22 6Z" fill="#1a5cff" />
                                <path d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z" fill="#00d4aa" />
                                <path d="M19 3L21 7L17 7L19 3Z" fill="#00d4aa" />
                            </svg>
                            <span className="text-[17px] font-bold text-[#2c3e50] tracking-tight">360</span>
                            <span className="text-[17px] font-bold text-[#2c3e50] ml-0.5 tracking-tight">智企</span>
                        </div>
                    </Link>
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
                    <div className="w-px h-5 bg-gray-300 mx-3"></div>
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
                <div className="h-12 flex items-center px-4 border-b border-gray-100">
                    {!sidebarCollapsed && (
                        <span className="text-base font-semibold text-gray-900">费用</span>
                    )}
                </div>
                
                <nav className="p-2 pt-3 flex-1 overflow-y-auto">
                    {menuConfig.map((group) => {
                        const isExpanded = expandedMenus.has(group.name);
                        const Icon = group.icon;
                        
                        return (
                            <div key={group.name} className="mb-1">
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
                            <span className="text-gray-400">定价和套餐</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900">已购套餐</span>
                        </div>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            帮助文档
                        </Link>
                    </div>

                    {/* 筛选栏 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* 套餐名称搜索 */}
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    placeholder="套餐名称搜索"
                                    className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            
                            {/* 续费/发放状态 */}
                            <select
                                value={renewalStatusFilter}
                                onChange={(e) => setRenewalStatusFilter(e.target.value)}
                                className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            >
                                {renewalStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            
                            {/* 套餐状态 */}
                            <select
                                value={packageStatusFilter}
                                onChange={(e) => setPackageStatusFilter(e.target.value)}
                                className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            >
                                {packageStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            
                            {/* 日期范围 */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="开始日期"
                                        className="h-9 pl-9 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-32"
                                    />
                                </div>
                                <span className="text-gray-500">~</span>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="结束日期"
                                        className="h-9 pl-9 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-32"
                                    />
                                </div>
                            </div>
                            
                            {/* 重置按钮 */}
                            <button
                                onClick={handleReset}
                                className="h-9 px-4 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                重置
                            </button>
                            
                            {/* 导出数据按钮 */}
                            <button className="h-9 px-4 text-blue-600 text-sm rounded-lg hover:text-blue-700 transition-colors flex items-center gap-1">
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
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">购买任务ID</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">套餐名称</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">所属产品</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">套餐类型</th>
                                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">数量</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">套餐状态</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">有效期</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">续费状态</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">生效时间</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 bg-gray-50 whitespace-nowrap">到期时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-3 py-3 text-sm text-gray-900 font-mono truncate max-w-[150px]" title={item.taskId}>{item.taskId}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 truncate" title={item.packageName}>{item.packageName}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 truncate">{item.productName}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900">{item.packageType}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                                        <td className="px-3 py-3">
                                            <span className={`inline-block px-2 py-1 text-xs rounded ${packageStatusConfig[item.packageStatus].color}`}>
                                                {packageStatusConfig[item.packageStatus].label}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-sm text-gray-900">{item.validityPeriod}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900">{renewalStatusConfig[item.renewalStatus].label}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{item.effectiveTime}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{item.expiryTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 max-h-[400px] overflow-y-auto">
                            {enterpriseList.map((enterprise) => (
                                <div
                                    key={enterprise.id}
                                    onClick={() => {
                                        setSelectedEnterprise(enterprise);
                                        setEnterpriseDialogOpen(false);
                                    }}
                                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                                        selectedEnterprise.id === enterprise.id
                                            ? 'bg-blue-50 border border-blue-200'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#006bff] flex items-center justify-center text-white font-medium mr-3">
                                        {enterprise.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">{enterprise.name}</span>
                                            <span className={`px-2 py-0.5 text-white text-xs rounded ${roleConfig[enterprise.role].bgColor}`}>
                                                {roleConfig[enterprise.role].label}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedEnterprise.id === enterprise.id && (
                                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
