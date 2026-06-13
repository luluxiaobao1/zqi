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
    Tag,
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

// 预设企业列表 - zhangsan账号在不同企业的角色
const enterpriseList = [
    { 
        id: 1, 
        name: "张三", 
        icon: "企", 
        role: 'owner' as UserRole,  // 主账号
        active: true,
        currentPackage: 2,  // 基础开发包的id
        adminAccount: null,
        quotaExhausted: false
    },
    { 
        id: 2, 
        name: "李四", 
        icon: "企", 
        role: 'admin' as UserRole,  // 管理员
        active: false,
        currentPackage: null,  // 未购买套餐
        adminAccount: null,
        quotaExhausted: false
    },
    { 
        id: 3, 
        name: "王五", 
        icon: "企", 
        role: 'member' as UserRole,  // 成员
        active: false,
        currentPackage: null,  // 未购买套餐
        adminAccount: 'zhaoliu',  // 管理员账号
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

export default function CostPage() {
    const router = useRouter();
    const [username, setUsername] = useState('未登录');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(enterpriseList[0]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // 左侧菜单展开状态
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['资金管理', '账单管理', '商品订单']));
    const [activeMenu, setActiveMenu] = useState("资金概览");
    
    // 资金数据
    const [availableBalance, setAvailableBalance] = useState(-15011657.59);
    const [cashBalance, setCashBalance] = useState(0.00);
    const [unsettledAmount, setUnsettledAmount] = useState(15011657.59);
    
    // 充值相关
    const [rechargeAmount, setRechargeAmount] = useState(100);
    const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat'>('alipay');
    const [agreementChecked, setAgreementChecked] = useState(false);

    // 当前用户角色
    const currentUserRole = selectedEnterprise.role;

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

    // 格式化金额
    const formatMoney = (amount: number) => {
        return amount.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem('zhiqi_logged_in');
        localStorage.removeItem('zhiqi_user_info');
        setUserMenuOpen(false);
        window.location.href = '/zhiqi/login';
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
                    {/* 页面标题 */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-gray-400">资金管理</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900">资金概览</span>
                        </div>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            帮助文档
                        </Link>
                    </div>

                    {/* 资金卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* 可用金额 */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="text-sm text-gray-500 mb-2">可用金额</div>
                            <div className={`text-3xl font-bold ${availableBalance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                                {availableBalance < 0 ? '-' : ''}¥{formatMoney(Math.abs(availableBalance))}
                            </div>
                        </div>

                        {/* 现金余额 */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-500">现金余额</span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <HelpCircle className="w-4 h-4" />
                                    </button>
                                </div>
                                <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">退款</Link>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">¥{formatMoney(cashBalance)}</div>
                        </div>

                        {/* 未结清金额 */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-500">未结清金额</span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <HelpCircle className="w-4 h-4" />
                                    </button>
                                </div>
                                <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">查看</Link>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">¥{formatMoney(unsettledAmount)}</div>
                        </div>
                    </div>

                    {/* 充值区域 */}
                    <div className="flex gap-6">
                        {/* 充值表单 */}
                        <div className="flex-1 bg-white rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">充值</h2>
                            
                            {/* 金额输入 */}
                            <div className="mb-6">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                                    <input
                                        type="number"
                                        value={rechargeAmount}
                                        onChange={(e) => setRechargeAmount(Number(e.target.value))}
                                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg text-xl focus:outline-none focus:border-blue-500"
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* 支付方式 */}
                            <div className="mb-6">
                                <div className="text-sm text-gray-700 mb-3">支付方式</div>
                                <div className="flex gap-4">
                                    <label 
                                        className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                                            paymentMethod === 'alipay' 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === 'alipay'}
                                            onChange={() => setPaymentMethod('alipay')}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">支</span>
                                            </div>
                                            <span className="text-sm text-gray-700">支付宝支付</span>
                                        </div>
                                    </label>
                                    <label 
                                        className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                                            paymentMethod === 'wechat' 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === 'wechat'}
                                            onChange={() => setPaymentMethod('wechat')}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">微</span>
                                            </div>
                                            <span className="text-sm text-gray-700">微信支付</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* 充值按钮 */}
                            <Button 
                                className="w-full h-10 bg-blue-600 hover:bg-blue-700"
                                disabled={!agreementChecked || rechargeAmount <= 0}
                            >
                                立即充值
                            </Button>

                            {/* 协议 */}
                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="agreement"
                                    checked={agreementChecked}
                                    onChange={(e) => setAgreementChecked(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="agreement" className="text-sm text-gray-600">
                                    我已阅读并同意
                                    <Link href="#" className="text-blue-600 hover:text-blue-700">《支付协议》</Link>
                                </label>
                            </div>
                        </div>

                        {/* 温馨提示 */}
                        <div className="w-80 bg-blue-50 rounded-lg p-6 border border-blue-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">i</span>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900">温馨提示</h3>
                            </div>
                            <div className="space-y-3 text-sm text-gray-600">
                                <p>
                                    1. 充值完成后，如您有未结清账单（欠费），充值资金将优先抵扣未结清账单，剩余资金将保留在您的账户内。
                                </p>
                                <p>
                                    2. 如需查看具体云产品及计费项消费详情，可前往
                                    <Link href="#" className="text-blue-600 hover:text-blue-700">账单明细</Link>
                                    查看账单详情。
                                </p>
                                <p>
                                    3. 账户欠费后再充值，自动优先结算未结清的账单。
                                </p>
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
