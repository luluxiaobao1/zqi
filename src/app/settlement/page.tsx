"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 访问控制菜单项
const accessControlMenus = [
    { id: "resource-group", name: "资源组管理", icon: "folder" },
    { id: "settlement", name: "结算单元", icon: "credit-card" },
    { id: "resource", name: "资源管理", icon: "cube" },
    { id: "permission", name: "权限管理", icon: "shield" },
    { id: "key", name: "密钥管理", icon: "key" },
    { id: "audit", name: "操作审计", icon: "document-text" },
    { id: "quota", name: "配额管理", icon: "chart-bar" },
];

// 模拟资源组数据
const resourceGroupData = [
    { id: 6214, name: "网信销售组", resourceCount: 0, department: "360集团/数字安全集团-监管军团-战支一部" },
    { id: 6210, name: "法务中心龙虾资源", resourceCount: 0, department: "360集团/法务中心" },
    { id: 6208, name: "定制项目", resourceCount: 1, department: "360集团/本脑产品部" },
    { id: 6207, name: "创新协同推进组", resourceCount: 0, department: "360集团/创新协同推进部课题组" },
    { id: 6201, name: "龙虾测试", resourceCount: 0, department: "360集团/IOT_公共服务" },
    { id: 6198, name: "流量安全产品部-产品研发组", resourceCount: 1, department: "360集团/流量安全产品部" },
    { id: 6195, name: "openclaw测试", resourceCount: 0, department: "360集团/AI安全研究院" },
    { id: 6189, name: "GEO专项", resourceCount: 2, department: "360集团/商业化业务线" },
    { id: 6180, name: "文库短信通知", resourceCount: 0, department: "360集团/移动产品事业部" },
    { id: 6179, name: "mlops", resourceCount: 4, department: "360集团/AI数据中台" },
];

// 模拟结算单元数据 - 与参考页面一致
const settlementUnitData = [
    { id: '6046', name: '技术中心结算单元', managers: ['张三', '李四'], department: '360集团/技术中心', resourceCount: 5, createTime: '2024-01-20', status: 'active' },
    { id: '5657', name: '产品中心结算单元', managers: ['王五'], department: '360集团/产品中心', resourceCount: 3, createTime: '2024-02-15', status: 'active' },
    { id: '5133', name: '运营中心结算单元', managers: ['赵六'], department: '360集团/运营中心', resourceCount: 4, createTime: '2024-03-01', status: 'active' },
    { id: '2094', name: '综合管理结算单元', managers: ['张三'], department: '360集团', resourceCount: 0, createTime: '2024-05-01', status: 'active' },
];

// 获取菜单图标
const getMenuIcon = (icon: string, className: string = "w-5 h-5") => {
    switch (icon) {
        case "folder":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            );
        case "cube":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            );
        case "shield":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            );
        case "key":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            );
        case "document-text":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        case "chart-bar":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case "credit-card":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            );
        default:
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            );
    }
};

export default function AccessControlPage() {
    const [currentMenu, setCurrentMenu] = useState("settlement");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // 资源组管理筛选 - 结算单元ID
    const [selectedSettlementId, setSelectedSettlementId] = useState("");
    
    // 结算单元相关状态
    const [settlementSearch, setSettlementSearch] = useState("");
    const [addSettlementDialogOpen, setAddSettlementDialogOpen] = useState(false);
    const [newSettlement, setNewSettlement] = useState({ name: '', managers: [] as string[] });
    const [managerDropdownOpen, setManagerDropdownOpen] = useState(false);
    const [settlementList, setSettlementList] = useState(settlementUnitData);
    
    // 编辑结算单元状态
    const [editSettlementDialogOpen, setEditSettlementDialogOpen] = useState(false);
    const [editingSettlement, setEditingSettlement] = useState<{ id: string; name: string; managers: string[] }>({ id: '', name: '', managers: [] });
    const [editManagerDropdownOpen, setEditManagerDropdownOpen] = useState(false);
    
    // 删除确认弹框状态
    const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
    const [deletingSettlement, setDeletingSettlement] = useState<{ id: string; name: string } | null>(null);

    // 筛选数据
    const filteredData = resourceGroupData.filter(item => {
        const matchSearch = searchKeyword === "" || 
            item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.id.toString().includes(searchKeyword);
        const matchDept = departmentFilter === "" || item.department.includes(departmentFilter);
        return matchSearch && matchDept;
    });

    return (
        <div className="min-h-screen bg-[#F0F5F7] flex flex-col">
            {/* 顶部导航栏 - 360智汇云设计规范 */}
            <header className="bg-white h-[50px] flex items-center justify-between px-5 flex-shrink-0" style={{ boxShadow: '0 2px 6px rgba(49, 49, 71, 0.26)' }}>
                <div className="flex items-center gap-4">
                    {/* Logo区域 */}
                    <div className="flex items-center gap-3">
                        <div className="h-7 flex items-center">
                            <img 
                                src="/assets/image.png" 
                                alt="360智汇云" 
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    </div>
                    {/* 工作台总览按钮 */}
                    <button className="h-8 px-3 bg-[#F8F9FA] text-[#202020] text-sm rounded flex items-center hover:bg-gray-100 transition-colors">
                        工作台总览
                    </button>
                    {/* 租户选择 */}
                    <div className="flex items-center gap-1 bg-[#F8F9FA] px-3 py-1.5 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm text-[#202020]">360集团</span>
                        <svg className="w-4 h-4 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <span className="text-sm text-[#202020] hover:text-[#0066FF] cursor-pointer transition-colors">费用</span>
                    <span className="text-sm text-[#202020] hover:text-[#0066FF] cursor-pointer transition-colors">工单</span>
                    <div className="relative">
                        <span className="text-sm text-[#202020] hover:text-[#0066FF] cursor-pointer transition-colors">消息</span>
                        <span className="absolute -top-1 -right-2 bg-[#FF4D4F] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none">98</span>
                    </div>
                    <span className="text-sm text-[#202020] hover:text-[#0066FF] cursor-pointer transition-colors">帮助</span>
                    <div className="flex items-center gap-2 ml-2 pl-4 border-l border-[#D8E0E8]">
                        <div className="w-7 h-7 bg-[#0066FF] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">L</span>
                        </div>
                        <div className="text-sm">
                            <div className="text-[#202020] leading-tight">lujingbao</div>
                            <div className="text-xs text-[#8C9AAE] leading-tight">子账号</div>
                        </div>
                        <svg className="w-4 h-4 text-[#8C9AAE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* 左侧图标栏 */}
                <aside className="w-[50px] bg-[#2e8cff] flex flex-col items-center py-1 flex-shrink-0">
                    {/* 全部/最近/收藏 */}
                    <button
                        className="w-[50px] h-[50px] flex flex-col items-center justify-center text-white bg-[#0066FF]"
                        title="全部"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className="text-[9px] mt-0.5">全部</span>
                    </button>
                    <button
                        className="w-[50px] h-[50px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="最近"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[9px] mt-0.5">最近</span>
                    </button>
                    <button
                        className="w-[50px] h-[50px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="收藏"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className="text-[9px] mt-0.5">收藏</span>
                    </button>
                    {/* 分隔线 */}
                    <div className="w-8 h-px bg-[#0066FF] my-1 opacity-30"></div>
                    {/* 产品图标 */}
                    <button
                        className="w-[50px] h-[40px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="APIMKT"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[9px] mt-0.5">APIMKT</span>
                    </button>
                    <button
                        className="w-[50px] h-[40px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="对话AIMI"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-[9px] mt-0.5">对话AIMI</span>
                    </button>
                    <button
                        className="w-[50px] h-[40px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="互动RTC"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[9px] mt-0.5">互动RTC</span>
                    </button>
                    <button
                        className="w-[50px] h-[40px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="直播LIVE"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[9px] mt-0.5">直播LIVE</span>
                    </button>
                    <button
                        className="w-[50px] h-[40px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="大数据DI"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-[9px] mt-0.5">大数据DI</span>
                    </button>
                    <button
                        className="w-[50px] h-[40px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="对象OBS"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span className="text-[9px] mt-0.5">对象OBS</span>
                    </button>
                    <button
                        className="w-[50px] h-[40px] flex flex-col items-center justify-center text-[#E5EAF3] hover:bg-[#0066FF] hover:text-white transition-colors"
                        title="容器CRS"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-[9px] mt-0.5">容器CRS</span>
                    </button>
                </aside>

                {/* 中间菜单栏 */}
                <aside className="w-[200px] bg-white flex flex-col flex-shrink-0 shadow-[2px_0_6px_rgba(0,0,0,0.08)]" style={{ position: 'relative', zIndex: 10 }}>
                    {/* 访问控制菜单 */}
                    <div className="flex-1 overflow-auto py-2">
                        <div className="px-4 py-3 text-sm font-medium text-[#202020]">访问控制</div>
                        {accessControlMenus.map((menu) => (
                            <button
                                key={menu.id}
                                onClick={() => setCurrentMenu(menu.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                    currentMenu === menu.id
                                        ? "bg-[#EEF6FF] text-[#0066FF] font-medium"
                                        : "text-[#202020] hover:bg-[#F5F7FA]"
                                }`}
                            >
                                <span className={currentMenu === menu.id ? "text-[#0066FF]" : "text-[#666666]"}>
                                    {getMenuIcon(menu.icon, "w-5 h-5")}
                                </span>
                                <span>{menu.name}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* 主内容区 */}
                <main className="flex-1 overflow-auto">
                    {currentMenu === "resource-group" && (
                        <div className="p-6">
                            {/* 面包屑 */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <span>访问控制</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-900">资源组管理</span>
                                {selectedSettlementId && (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span className="text-blue-600">
                                            {settlementList.find(s => s.id === selectedSettlementId)?.name || `结算单元 ${selectedSettlementId}`}
                                        </span>
                                        <button 
                                            className="ml-2 text-gray-400 hover:text-gray-600"
                                            onClick={() => setSelectedSettlementId("")}
                                            title="清除筛选"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* 搜索和筛选区 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {/* 搜索框 */}
                                    <div className="relative">
                                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="请输入资源组ID或名称搜索"
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            className="h-9 pl-9 pr-4 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    {/* 部门选择 */}
                                    <select
                                        value={departmentFilter}
                                        onChange={(e) => setDepartmentFilter(e.target.value)}
                                        className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">全部部门</option>
                                        <option value="数字安全集团">数字安全集团</option>
                                        <option value="法务中心">法务中心</option>
                                        <option value="本脑产品部">本脑产品部</option>
                                        <option value="流量安全产品部">流量安全产品部</option>
                                        <option value="AI安全研究院">AI安全研究院</option>
                                        <option value="商业化业务线">商业化业务线</option>
                                    </select>
                                </div>
                                {/* 创建按钮 */}
                                <button className="h-9 px-4 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    创建资源组
                                </button>
                            </div>

                            {/* 资源组列表表格 */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">资源组名称</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">资源组ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">资源数量</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">所属结算单元</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredData.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{item.id}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{item.resourceCount}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button className="text-blue-600 hover:text-blue-700 mr-3">管理</button>
                                                    <button className="text-blue-600 hover:text-blue-700 mr-3">编辑</button>
                                                    <button className="text-blue-600 hover:text-blue-700">删除</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* 分页 */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
                                    <div className="text-sm text-gray-500">
                                        共 <span className="font-medium">1442</span> 条记录 第 <span className="font-medium">{currentPage}</span> / 145 页
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select 
                                            value={pageSize}
                                            onChange={(e) => setPageSize(Number(e.target.value))}
                                            className="h-8 px-2 border border-gray-300 rounded text-sm"
                                        >
                                            <option value={10}>10条/页</option>
                                            <option value={20}>20条/页</option>
                                            <option value={50}>50条/页</option>
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                                                disabled={currentPage === 1}
                                            >
                                                ‹
                                            </button>
                                            {[1, 2, 3, 4, 5].map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                                                        currentPage === page
                                                            ? "bg-blue-600 text-white"
                                                            : "border border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <span className="text-gray-400">...</span>
                                            <button 
                                                onClick={() => setCurrentPage(145)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50"
                                            >
                                                145
                                            </button>
                                            <button 
                                                onClick={() => setCurrentPage(Math.min(145, currentPage + 1))}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                                                disabled={currentPage === 145}
                                            >
                                                ›
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                            <span className="text-sm text-gray-500">跳至</span>
                                            <input 
                                                type="number" 
                                                className="w-12 h-8 px-2 border border-gray-300 rounded text-sm text-center"
                                                min={1}
                                                max={145}
                                                value={currentPage}
                                                onChange={(e) => setCurrentPage(Math.min(145, Math.max(1, Number(e.target.value))))}
                                            />
                                            <span className="text-sm text-gray-500">页</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 结算单元页面 */}
                    {currentMenu === "settlement" && (
                        <div className="p-6">
                            {/* 搜索和筛选区 - 参考页面样式 */}
                            <div className="bg-white rounded border border-gray-200">
                                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="请输入结算单元ID或名称搜索"
                                                value={settlementSearch}
                                                onChange={(e) => setSettlementSearch(e.target.value)}
                                                className="h-8 pl-9 pr-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        className="h-8 px-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                                        onClick={() => setAddSettlementDialogOpen(true)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        创建结算单元
                                    </button>
                                </div>
                                
                                {/* 表格 */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">结算单元名称</th>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">负责人</th>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">资源组数量</th>
                                                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {settlementList.filter(unit => {
                                                const matchSearch = unit.name.includes(settlementSearch) || unit.id.includes(settlementSearch);
                                                return matchSearch;
                                            }).map((unit) => (
                                                <tr key={unit.id} className="hover:bg-gray-50">
                                                    <td className="px-5 py-3 whitespace-nowrap">
                                                        <span className="text-sm text-gray-900">{unit.name}</span>
                                                    </td>
                                                    <td className="px-5 py-3 whitespace-nowrap">
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                            {unit.managers.map((manager, idx) => (
                                                                <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                                                    {manager}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 whitespace-nowrap">
                                                        <a 
                                                            href="#" 
                                                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                                        >
                                                            {unit.resourceCount}
                                                        </a>
                                                    </td>
                                                    <td className="px-5 py-3 whitespace-nowrap">
                                                        <div className="flex items-center gap-1">
                                                            <button 
                                                                className="text-blue-600 hover:text-blue-700 text-sm"
                                                                onClick={() => {
                                                                    setEditingSettlement({
                                                                        id: unit.id,
                                                                        name: unit.name,
                                                                        managers: [...unit.managers]
                                                                    });
                                                                    setEditSettlementDialogOpen(true);
                                                                }}
                                                            >编辑</button>
                                                            <span className="text-gray-300">|</span>
                                                            <button 
                                                                className="text-blue-600 hover:text-blue-700 text-sm"
                                                                onClick={() => {
                                                                    // 跳转到资源组管理页面并带上结算单元参数
                                                                    setSelectedSettlementId(unit.id);
                                                                    setCurrentMenu("resource-group");
                                                                }}
                                                            >
                                                                资源组管理
                                                            </button>
                                                            <span className="text-gray-300">|</span>
                                                            <button 
                                                                className={`text-sm ${unit.resourceCount > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-600'}`}
                                                                disabled={unit.resourceCount > 0}
                                                                onClick={() => {
                                                                    if (unit.resourceCount === 0) {
                                                                        setDeletingSettlement({ id: unit.id, name: unit.name });
                                                                        setDeleteConfirmDialogOpen(true);
                                                                    }
                                                                }}
                                                            >
                                                                删除
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* 分页 */}
                                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                                    <div className="text-sm text-gray-500">
                                        共 {settlementUnitData.length} 条记录 第 1 / 1 页
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            disabled
                                        >
                                            上一页
                                        </button>
                                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                                        <button 
                                            className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                            disabled
                                        >
                                            下一页
                                        </button>
                                        <select className="h-8 px-2 border border-gray-200 rounded text-sm text-gray-600">
                                            <option value="10">10条/页</option>
                                            <option value="20">20条/页</option>
                                            <option value="50">50条/页</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 其他菜单占位 */}
                    {currentMenu !== "resource-group" && currentMenu !== "settlement" && (
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    {accessControlMenus.find(m => m.id === currentMenu)?.name}
                                </h3>
                                <p className="text-gray-500">功能开发中...</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* 创建结算单元弹窗 */}
            <Dialog open={addSettlementDialogOpen} onOpenChange={(open) => {
                setAddSettlementDialogOpen(open);
                if (!open) {
                    setNewSettlement({ name: '', managers: [] });
                    setManagerDropdownOpen(false);
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>创建结算单元</DialogTitle>
                        <DialogDescription>填写结算单元信息</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                <span className="text-red-500 mr-0.5">*</span>
                                结算单元名称
                                <span className="text-gray-400 text-xs ml-1">（100个字符以内）</span>
                            </label>
                            <input
                                type="text"
                                value={newSettlement.name}
                                onChange={(e) => setNewSettlement({ ...newSettlement, name: e.target.value })}
                                placeholder="请输入结算单元名称"
                                maxLength={100}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {newSettlement.name.length}/100
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm text-gray-700 mb-1">
                                <span className="text-red-500 mr-0.5">*</span>
                                负责人
                            </label>
                            <div
                                className={`w-full min-h-[32px] px-3 py-1 border rounded text-sm cursor-pointer flex items-center flex-wrap gap-1 ${newSettlement.managers.length === 0 ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500`}
                                onClick={() => setManagerDropdownOpen(!managerDropdownOpen)}
                            >
                                {newSettlement.managers.length === 0 ? (
                                    <span className="text-gray-400">请选择负责人</span>
                                ) : (
                                    newSettlement.managers.map(manager => (
                                        <span
                                            key={manager}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                                        >
                                            {manager}
                                            <span
                                                className="hover:bg-blue-100 rounded cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNewSettlement({
                                                        ...newSettlement,
                                                        managers: newSettlement.managers.filter(id => id !== manager)
                                                    });
                                                }}
                                            >
                                                ×
                                            </span>
                                        </span>
                                    ))
                                )}
                                <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {managerDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'].map(name => (
                                        <div
                                            key={name}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newManagers = newSettlement.managers.includes(name)
                                                    ? newSettlement.managers.filter(id => id !== name)
                                                    : [...newSettlement.managers, name];
                                                setNewSettlement({ ...newSettlement, managers: newManagers });
                                            }}
                                        >
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${newSettlement.managers.includes(name) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                                {newSettlement.managers.includes(name) && (
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {newSettlement.managers.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">请选择负责人</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setAddSettlementDialogOpen(false);
                            setNewSettlement({ name: '', managers: [] });
                            setManagerDropdownOpen(false);
                        }}>取消</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700" 
                            disabled={!newSettlement.name.trim() || newSettlement.managers.length === 0}
                            onClick={() => {
                                const newUnit = {
                                    id: Date.now().toString().slice(-4),
                                    name: newSettlement.name.trim(),
                                    managers: newSettlement.managers,
                                    department: '360集团',
                                    resourceCount: 0,
                                    createTime: new Date().toISOString().split('T')[0],
                                    status: 'active' as const,
                                };
                                setSettlementList(prev => [...prev, newUnit]);
                                setAddSettlementDialogOpen(false);
                                setNewSettlement({ name: '', managers: [] });
                                setManagerDropdownOpen(false);
                            }}
                        >确认创建</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 编辑结算单元弹窗 */}
            <Dialog open={editSettlementDialogOpen} onOpenChange={(open) => {
                setEditSettlementDialogOpen(open);
                if (!open) {
                    setEditingSettlement({ id: '', name: '', managers: [] });
                    setEditManagerDropdownOpen(false);
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>编辑结算单元</DialogTitle>
                        <DialogDescription>修改结算单元信息</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                <span className="text-red-500 mr-0.5">*</span>
                                结算单元名称
                                <span className="text-gray-400 text-xs ml-1">（100个字符以内）</span>
                            </label>
                            <input
                                type="text"
                                value={editingSettlement.name}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 100);
                                    setEditingSettlement({ ...editingSettlement, name: value });
                                }}
                                placeholder="请输入结算单元名称"
                                maxLength={100}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {editingSettlement.name.length}/100
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm text-gray-700 mb-1">
                                <span className="text-red-500 mr-0.5">*</span>
                                负责人
                            </label>
                            <div
                                className={`w-full min-h-[32px] px-3 py-1 border rounded text-sm cursor-pointer flex items-center flex-wrap gap-1 ${editingSettlement.managers.length === 0 ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500`}
                                onClick={() => setEditManagerDropdownOpen(!editManagerDropdownOpen)}
                            >
                                {editingSettlement.managers.length === 0 ? (
                                    <span className="text-gray-400">请选择负责人</span>
                                ) : (
                                    editingSettlement.managers.map(manager => (
                                        <span
                                            key={manager}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                                        >
                                            {manager}
                                            <span
                                                className="hover:bg-blue-100 rounded cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingSettlement({
                                                        ...editingSettlement,
                                                        managers: editingSettlement.managers.filter(id => id !== manager)
                                                    });
                                                }}
                                            >
                                                ×
                                            </span>
                                        </span>
                                    ))
                                )}
                                <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {editManagerDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'].map(name => (
                                        <div
                                            key={name}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newManagers = editingSettlement.managers.includes(name)
                                                    ? editingSettlement.managers.filter(id => id !== name)
                                                    : [...editingSettlement.managers, name];
                                                setEditingSettlement({ ...editingSettlement, managers: newManagers });
                                            }}
                                        >
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${editingSettlement.managers.includes(name) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                                {editingSettlement.managers.includes(name) && (
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {editingSettlement.managers.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">请选择负责人</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setEditSettlementDialogOpen(false);
                            setEditingSettlement({ id: '', name: '', managers: [] });
                            setEditManagerDropdownOpen(false);
                        }}>取消</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700" 
                            disabled={!editingSettlement.name.trim() || editingSettlement.managers.length === 0}
                            onClick={() => {
                                setSettlementList(prev => prev.map(item => 
                                    item.id === editingSettlement.id 
                                        ? { ...item, name: editingSettlement.name.trim(), managers: editingSettlement.managers }
                                        : item
                                ));
                                setEditSettlementDialogOpen(false);
                                setEditingSettlement({ id: '', name: '', managers: [] });
                                setEditManagerDropdownOpen(false);
                            }}
                        >保存</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 删除确认弹框 */}
            <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>确认删除</DialogTitle>
                        <DialogDescription>
                            确定要删除结算单元「{deletingSettlement?.name}」吗？此操作不可恢复。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setDeleteConfirmDialogOpen(false);
                            setDeletingSettlement(null);
                        }}>取消</Button>
                        <Button 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => {
                                if (deletingSettlement) {
                                    setSettlementList(prev => prev.filter(item => item.id !== deletingSettlement.id));
                                }
                                setDeleteConfirmDialogOpen(false);
                                setDeletingSettlement(null);
                            }}
                        >确认删除</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 悬浮帮助按钮 */}
            <button className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>
        </div>
    );
}
