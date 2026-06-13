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
    Check,
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

// 套餐数据
const pricingData = [
    {
        id: 1,
        name: "新手体验包",
        originalPrice: 99.00,
        currentPrice: 0.00,
        features: [
            "调用次数 10万次",
            "Token额度 100万token",
            "有效期 30天",
        ],
        capabilities: ["大语言模型", "图像理解", "语音识别"],
        isCurrent: false,
        highlight: false,
    },
    {
        id: 2,
        name: "基础开发包",
        originalPrice: 599.00,
        currentPrice: 299.00,
        features: [
            "调用次数 100万次",
            "Token额度 1000万token",
            "有效期 90天",
        ],
        capabilities: ["全部模型", "API无限调用", "技术支持"],
        isCurrent: true,
        highlight: true,
    },
    {
        id: 3,
        name: "企业级套餐",
        originalPrice: 5999.00,
        currentPrice: 2999.00,
        features: [
            "调用次数 无限次",
            "Token额度 无限token",
            "有效期 365天",
        ],
        capabilities: ["专属服务", "SLA保障", "定制开发"],
        isCurrent: false,
        highlight: false,
    },
    {
        id: 4,
        name: "专业版套餐",
        originalPrice: 1999.00,
        currentPrice: 999.00,
        features: [
            "调用次数 500万次",
            "Token额度 5000万token",
            "有效期 180天",
        ],
        capabilities: ["全部模型", "优先支持", "数据分析"],
        isCurrent: false,
        highlight: false,
    },
];

export default function PricingPage() {
    const router = useRouter();
    const [username, setUsername] = useState('未登录');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(enterpriseList[0]);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // 左侧菜单展开状态
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['资金管理', '账单管理', '商品订单']));
    const [activeMenu, setActiveMenu] = useState("定价和套餐");

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

    // 格式化价格
    const formatPrice = (price: number) => {
        return price.toFixed(2);
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
    // 菜单配置 - 根据角色过滤
    const menuConfig = allMenuConfig.filter(item => item.roles.includes(currentUserRole));

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
                            <span className="text-gray-900">定价和套餐</span>
                        </div>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            帮助文档
                        </Link>
                    </div>

                    {/* 套餐卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pricingData.map((item) => (
                            <div 
                                key={item.id} 
                                className={`bg-white rounded-lg border overflow-hidden transition-all hover:shadow-lg ${
                                    item.highlight 
                                        ? 'border-green-500 ring-2 ring-green-100' 
                                        : 'border-gray-200'
                                }`}
                            >
                                {/* 当前套餐标识 */}
                                {item.isCurrent && (
                                    <div className="bg-green-500 text-white text-xs text-center py-1">
                                        当前套餐
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    {/* 套餐名称 */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{item.name}</h3>
                                    
                                    {/* 价格 */}
                                    <div className="mb-4">
                                        <span className="text-gray-400 line-through text-sm">¥{formatPrice(item.originalPrice)}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-gray-900">¥{formatPrice(item.currentPrice)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* 权益 */}
                                    <div className="space-y-2 mb-4">
                                        {item.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* 支持能力 */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {item.capabilities.map((cap, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                                                {cap}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    {/* 购买按钮 */}
                                    <button 
                                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                                            item.isCurrent
                                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                        disabled={item.isCurrent}
                                    >
                                        {item.isCurrent ? '当前套餐' : '立即购买'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 计费说明 */}
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">计费说明</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p>1. 套餐购买后立即生效，有效期内可无限使用（在额度范围内）。</p>
                            <p>2. 套餐过期后，未使用的额度将自动清零，请合理安排使用时间。</p>
                            <p>3. 企业级套餐支持专属客服、SLA保障及定制开发服务，如需了解详情请联系销售。</p>
                            <p>4. 所有价格均为税前价格，如有疑问请联系客服。</p>
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
