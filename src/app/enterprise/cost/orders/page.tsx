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
    MessageSquare,
    Wallet,
    Receipt,
    Package,
    Calendar,
    Download,
    ChevronLeft,
    LogOut,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// 用户角色类型
type UserRole = 'owner' | 'admin' | 'member';

// 角色配置
const roleConfig: Record<UserRole, { label: string; bgColor: string }> = {
    owner: { label: '主账号', bgColor: 'bg-blue-500' },
    admin: { label: '管理员', bgColor: 'bg-orange-500' },
    member: { label: '成员', bgColor: 'bg-green-500' },
};

// 用户-企业-角色映射数据
const userEnterpriseRolesMap: Record<string, Array<{ enterpriseId: number; enterpriseName: string; role: UserRole }>> = {
    'zhangsan': [
        { enterpriseId: 1, enterpriseName: '张三企业', role: 'owner' },
        { enterpriseId: 2, enterpriseName: '李四企业', role: 'admin' },
        { enterpriseId: 3, enterpriseName: '王五企业', role: 'member' },
    ],
    'lisi': [
        { enterpriseId: 2, enterpriseName: '李四企业', role: 'owner' },
        { enterpriseId: 3, enterpriseName: '王五企业', role: 'admin' },
        { enterpriseId: 1, enterpriseName: '张三企业', role: 'member' },
    ],
    'wangwu': [
        { enterpriseId: 3, enterpriseName: '王五企业', role: 'owner' },
    ],
};

// 根据用户账号生成企业列表
const getEnterpriseListForUser = (userAccount: string) => {
    const roles = userEnterpriseRolesMap[userAccount] || [];
    return roles.map((item, index) => ({
        id: item.enterpriseId,
        name: item.enterpriseName,
        icon: "企",
        role: item.role,
        active: index === 0,
    }));
};

// 默认企业列表（未登录时使用）
const defaultEnterpriseList = [
    { 
        id: 1, 
        name: "张三企业", 
        icon: "企", 
        role: 'owner' as UserRole,
        active: true,
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
    icon: Receipt,
    desc: "快速查阅产品文档",
    color: "bg-green-500"
}, {
    name: "快捷操作",
    icon: Sparkles,
    desc: "常用功能一键直达",
    color: "bg-orange-500"
}];

// 订单状态类型
type OrderStatus = 'success' | 'failed' | 'timeout';

// 订单状态配置
const orderStatusConfig: Record<OrderStatus, { label: string; color: string }> = {
    success: { label: '支付成功', color: 'text-green-600 bg-green-50' },
    failed: { label: '支付失败', color: 'text-red-600 bg-red-50' },
    timeout: { label: '超时取消', color: 'text-gray-600 bg-gray-100' },
};

// 订单数据
const orderData = [
    {
        id: 1,
        taskId: "ZY0020061692AA9F0BE95617A1F6DDA72EBF7",
        orderId: "ZF00010426927D7C2A6216B8706C824EAB917",
        creator: "zhangsan",
        createTime: "2026.03.17 10:48:57",
        serviceName: "H800-80G-基础版-8卡",
        productName: "大模型",
        orderType: "新购",
        quantity: 1,
        orderAmount: 2970316.80,
        payableAmount: 2970316.80,
        payTime: "2026.03.17 10:48:57",
        status: 'success' as OrderStatus,
    },
    {
        id: 2,
        taskId: "ZY0020061683BBE1DCF04828B2G7EEB83FCG8",
        orderId: "ZF00010426938E8D3B7327C9817D935FBC028",
        creator: "lisi",
        createTime: "2026.03.16 14:32:21",
        serviceName: "A30-24G-标准版-8卡",
        productName: "龙虾",
        orderType: "新购",
        quantity: 5,
        orderAmount: 93002.40,
        payableAmount: 93002.40,
        payTime: "2026.03.16 14:32:21",
        status: 'success' as OrderStatus,
    },
    {
        id: 3,
        taskId: "ZY0020061674CCF2EDG15939C3H8FFC94GDH9",
        orderId: "ZF00010426949F9E4C8438D0928E046GCD139",
        creator: "zhangsan",
        createTime: "2026.03.15 09:15:43",
        serviceName: "A100-40G-专业版-4卡",
        productName: "APICloud",
        orderType: "新购",
        quantity: 22,
        orderAmount: 844280.00,
        payableAmount: 844280.00,
        payTime: "2026.03.15 09:15:43",
        status: 'failed' as OrderStatus,
    },
    {
        id: 4,
        taskId: "ZY0020061665DDG3FEH26040D4I9GGD05HEI0",
        orderId: "ZF00010426950G0F5D9549E1039F157HDE240",
        creator: "wangwu",
        createTime: "2026.03.14 16:28:09",
        serviceName: "V100-32G-高级版-2卡",
        productName: "大模型",
        orderType: "新购",
        quantity: 3,
        orderAmount: 18604.80,
        payableAmount: 18604.80,
        payTime: "2026.03.14 16:28:09",
        status: 'success' as OrderStatus,
    },
    {
        id: 5,
        taskId: "ZY0020061656EEH4GFI37151E5J0HHE16IFJ1",
        orderId: "ZF00010426961H1G6E0650F2140G268IEF351",
        creator: "zhangsan",
        createTime: "2026.03.13 11:42:35",
        serviceName: "H800-80G-基础版-8卡",
        productName: "龙虾",
        orderType: "新购",
        quantity: 2,
        orderAmount: 5940633.60,
        payableAmount: 5940633.60,
        payTime: "2026.03.13 11:42:35",
        status: 'timeout' as OrderStatus,
    },
    {
        id: 6,
        taskId: "ZY0020061647FFI5HGJ48262F6K1IIF27JGK2",
        orderId: "ZF00010426972I2H7F1760G3251H379JFG462",
        creator: "lisi",
        createTime: "2026.03.13 08:05:17",
        serviceName: "A100-80G-企业版-8卡",
        productName: "APICloud",
        orderType: "新购",
        quantity: 8,
        orderAmount: 3760384.00,
        payableAmount: 3760384.00,
        payTime: "2026.03.13 08:05:17",
        status: 'success' as OrderStatus,
    },
    {
        id: 7,
        taskId: "ZY0020061638GGJ6IHK59373G7L2JJG38KHL3",
        orderId: "ZF00010426983J3I8G2871H4362I480KGH573",
        creator: "zhangsan",
        createTime: "2026.03.12 15:33:48",
        serviceName: "T4-16G-入门版-4卡",
        productName: "企业智慧工作平台",
        orderType: "新购",
        quantity: 15,
        orderAmount: 139488.00,
        payableAmount: 139488.00,
        payTime: "2026.03.12 15:33:48",
        status: 'success' as OrderStatus,
    },
    {
        id: 8,
        taskId: "ZY0020061629HHK7JIL60484H8M3KKH49LIM4",
        orderId: "ZF00010426994K4J9H3982I5473J591LHI684",
        creator: "wangwu",
        createTime: "2026.03.11 12:18:26",
        serviceName: "H100-80G-旗舰版-8卡",
        productName: "企业智慧工作平台",
        orderType: "新购",
        quantity: 4,
        orderAmount: 6320448.00,
        payableAmount: 6320448.00,
        payTime: "2026.03.11 12:18:26",
        status: 'failed' as OrderStatus,
    },
    {
        id: 9,
        taskId: "ZY0020061610IIL8KJM71595I9N4LLI50MJN5",
        orderId: "ZF00010426905L5K0I4093J6584K602MIJ795",
        creator: "zhangsan",
        createTime: "2026.03.10 09:45:52",
        serviceName: "A30-24G-标准版-8卡",
        productName: "企业智慧工作平台",
        orderType: "新购",
        quantity: 10,
        orderAmount: 186004.80,
        payableAmount: 186004.80,
        payTime: "2026.03.10 09:45:52",
        status: 'success' as OrderStatus,
    },
    {
        id: 10,
        taskId: "ZY0020061601JJM9LKN82606J0O5MMJ61NKO6",
        orderId: "ZF00010426916M6L1I5104K7695L713NJK806",
        creator: "lisi",
        createTime: "2026.03.09 14:56:31",
        serviceName: "V100-32G-高级版-2卡",
        productName: "企业智慧工作平台",
        orderType: "新购",
        quantity: 6,
        orderAmount: 37209.60,
        payableAmount: 37209.60,
        payTime: "2026.03.09 14:56:31",
        status: 'timeout' as OrderStatus,
    },
];

export default function OrdersPage() {
    const router = useRouter();
    const [username, setUsername] = useState('未登录');
    const [userAccount, setUserAccount] = useState('');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [enterpriseList, setEnterpriseList] = useState(defaultEnterpriseList);
    const [selectedEnterprise, setSelectedEnterprise] = useState(defaultEnterpriseList[0]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // 左侧菜单展开状态
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['资金管理', '账单管理', '商品订单']));
    const [activeMenu, setActiveMenu] = useState("商品订单");
    
    // 筛选条件
    const [taskIdSearch, setTaskIdSearch] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    // 分页
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalRecords = 140;
    const totalPages = Math.ceil(totalRecords / pageSize);

    // 当前用户角色
    const currentUserRole = selectedEnterprise.role;

    // 从localStorage读取动态订单
    const [dynamicOrders, setDynamicOrders] = useState<typeof orderData>([]);

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
                const account = userInfo.account || '';
                const name = userInfo.name || userInfo.phone || '用户';
                setUsername(name);
                setUserAccount(account);
                
                // 根据用户账号动态生成企业列表
                if (account && userEnterpriseRolesMap[account]) {
                    const userEnterpriseList = getEnterpriseListForUser(account);
                    setEnterpriseList(userEnterpriseList);
                    // 默认选中第一个企业
                    setSelectedEnterprise(userEnterpriseList[0]);
                }
            } catch (e) {
                setUsername('用户');
            }
        }
        
        // 读取localStorage中的订单
        const storedOrders = localStorage.getItem('zhiqi_orders');
        if (storedOrders) {
            try {
                const orders = JSON.parse(storedOrders);
                // 转换订单格式
                const formattedOrders = orders.map((order: any) => ({
                    ...order,
                    status: order.status === 'success' ? 'success' as OrderStatus : 'failed' as OrderStatus,
                }));
                setDynamicOrders(formattedOrders);
            } catch (e) {
                console.error('Failed to parse orders:', e);
            }
        }
    }, []);

    // 合并静态订单和动态订单（动态订单在前）
    const allOrderData = [...dynamicOrders, ...orderData];

    // 根据角色过滤订单数据：管理员看所有订单，成员只看自己创建的订单
    const filteredOrderData = currentUserRole === 'member' 
        ? allOrderData.filter(item => item.creator === username)
        : allOrderData;

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

    // 重置筛选
    const handleReset = () => {
        setTaskIdSearch("");
        setOrderStatusFilter("all");
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

    // 订单状态选项
    const orderStatusOptions = [
        { value: "all", label: "全部状态" },
        { value: "success", label: "支付成功" },
        { value: "failed", label: "支付失败" },
        { value: "timeout", label: "超时取消" },
    ];

    // 生成分页按钮
    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        // 上一页
        pages.push(
            <button
                key="prev"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
        );
        
        // 页码
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="ellipsis1" className="px-2 text-gray-400">…</span>);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 flex items-center justify-center border rounded text-sm ${
                        currentPage === i
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    {i}
                </button>
            );
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis2" className="px-2 text-gray-400">…</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                    {totalPages}
                </button>
            );
        }
        
        // 下一页
        pages.push(
            <button
                key="next"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        );
        
        return pages;
    };

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
                            <span className="text-gray-400">商品订单</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900">商品订单</span>
                        </div>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            帮助文档
                        </Link>
                    </div>

                    {/* 筛选栏 */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* 任务ID搜索 */}
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    value={taskIdSearch}
                                    onChange={(e) => setTaskIdSearch(e.target.value)}
                                    placeholder="任务ID搜索"
                                    className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            
                            {/* 订单状态筛选 */}
                            <select
                                value={orderStatusFilter}
                                onChange={(e) => setOrderStatusFilter(e.target.value)}
                                className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            >
                                {orderStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            
                            {/* 提交日期 */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">提交日期:</span>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="提交开始日期"
                                        className="h-9 pl-9 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-36"
                                    />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="提交结束日期"
                                        className="h-9 pl-9 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-36"
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
                            <button className="h-9 px-4 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                导出数据
                            </button>
                        </div>
                    </div>

                    {/* 数据表格 */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 h-10">
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[12%]">任务ID</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[12%]">订单ID</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[8%]">创建人</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[10%]">创建时间</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[14%]">服务名称</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[12%]">所属产品</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[8%]">订单类型</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-[6%]">购买数量</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-[10%]">订单金额（¥）</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-[10%]">应付金额（¥）</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[10%]">支付时间</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-[6%]">订单状态</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-[6%]">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrderData.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 h-12">
                                        <td className="px-3 py-2 text-sm text-gray-900 font-mono">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-left cursor-default">
                                                    {item.taskId}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white max-w-md break-all">
                                                    {item.taskId}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900 font-mono">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-left cursor-default">
                                                    {item.orderId}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white max-w-md break-all">
                                                    {item.orderId}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-left cursor-default">
                                                    {item.creator}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white">
                                                    {item.creator}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-left cursor-default">
                                                    {item.createTime}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white">
                                                    {item.createTime}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-left cursor-default">
                                                    {item.serviceName}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white max-w-xs">
                                                    {item.serviceName}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-left cursor-default">
                                                    {item.productName}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white">
                                                    {item.productName}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-left cursor-default">
                                                    {item.orderType}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white">
                                                    {item.orderType}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                                        <td className="px-3 py-2 text-sm text-gray-900 text-right">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-right cursor-default">
                                                    ¥{formatMoney(item.orderAmount)}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white">
                                                    ¥{formatMoney(item.orderAmount)}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900 text-right">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-right cursor-default">
                                                    ¥{formatMoney(item.payableAmount)}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white">
                                                    ¥{formatMoney(item.payableAmount)}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-900">
                                            <Tooltip>
                                                <TooltipTrigger className="truncate block w-full text-left cursor-default">
                                                    {item.payTime}
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="bg-gray-800 text-white">
                                                    {item.payTime}
                                                </TooltipContent>
                                            </Tooltip>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={`inline-block px-2 py-1 text-xs rounded ${orderStatusConfig[item.status].color}`}>
                                                {orderStatusConfig[item.status].label}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <button className="text-sm text-blue-600 hover:text-blue-700">
                                                详情
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 分页 */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                            共{totalRecords}条记录 第{currentPage}/{totalPages}页
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {renderPagination()}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="h-8 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value={10}>10条/页</option>
                                    <option value={20}>20条/页</option>
                                    <option value={50}>50条/页</option>
                                </select>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-600">跳至</span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={totalPages}
                                        value={currentPage}
                                        onChange={(e) => {
                                            const page = Number(e.target.value);
                                            if (page >= 1 && page <= totalPages) {
                                                setCurrentPage(page);
                                            }
                                        }}
                                        className="w-12 h-8 px-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:border-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">页</span>
                                </div>
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
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
