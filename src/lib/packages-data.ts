// 资源包数据类型定义
export type Package = {
    id: number;
    name: string;
    identifier: string; // 资源包标识
    product: "ai-plan" | "lobster"; // 选择产品：AI计划 or 龙虾
    description: string;
    type: "monthly" | "addon"; // monthly: 月包, addon: 加油包
    price: number;
    costPrice: number; // 成本价
    priceHint: string; // 金额提示语
    hourLimit5: number | null; // 5小时限额
    weekLimit: number | null; // 周限额
    monthLimit: number | null; // 月限额
    capabilityDesc: string; // 套餐能力说明
    lobsterCount: number; // 龙虾数量
    memberCount: number; // 成员数，0表示不限制
    availableModels: string[]; // 可用模型列表
    purchaseLimit: number | null;
    stock: number | null;
    officialDiscount: number;
    internalDiscount: number;
    svipDiscount: number;
    vipDiscount: number;
    soldCount: number;
    totalIncome: number;
    status: "active" | "inactive";
    createTime: string;
    onSaleTime: string;
    features: string[];
};

// 资源包数据初始值
export const initialPackagesData: Package[] = [
    // ==================== 月包（6个）====================
    {
        id: 1,
        name: "免费体验版",
        identifier: "free-trial",
        product: "ai-plan" as const,
        description: "新用户免费体验，快速上手",
        type: "monthly",
        price: 0,
        costPrice: 0,
        priceHint: "免费体验",
        hourLimit5: 10,
        weekLimit: 100,
        monthLimit: 500,
        capabilityDesc: "支持豆包Lite模型；基础技术支持；小量调用额度",
        lobsterCount: 3,
        memberCount: 1,
        availableModels: ["doubao-lite"],
        purchaseLimit: 1,
        stock: 99999,
        officialDiscount: 10,
        internalDiscount: 10,
        svipDiscount: 10,
        vipDiscount: 10,
        soldCount: 15680,
        totalIncome: 0,
        status: "active",
        createTime: "2025-01-01 08:00:00",
        onSaleTime: "2025-01-01 08:00:00",
        features: ["3个龙虾", "豆包Lite模型", "每人限购1个"]
    },
    {
        id: 2,
        name: "个人基础版",
        identifier: "personal-basic",
        product: "ai-plan" as const,
        description: "个人开发者入门首选",
        type: "monthly",
        price: 49,
        costPrice: 25,
        priceHint: "约1.6元/天",
        hourLimit5: 30,
        weekLimit: 500,
        monthLimit: 2000,
        capabilityDesc: "支持豆包系列模型；适配Cursor、VSCode等编码工具；基础技术支持",
        lobsterCount: 10,
        memberCount: 1,
        availableModels: ["doubao-pro", "doubao-lite"],
        purchaseLimit: null,
        stock: null,
        officialDiscount: 9.8,
        internalDiscount: 9.5,
        svipDiscount: 9,
        vipDiscount: 9.5,
        soldCount: 3256,
        totalIncome: 159544,
        status: "active",
        createTime: "2025-02-15 10:30:00",
        onSaleTime: "2025-02-15 10:30:00",
        features: ["10个龙虾", "豆包系列模型"]
    },
    {
        id: 3,
        name: "个人专业版",
        identifier: "personal-pro",
        product: "ai-plan" as const,
        description: "个人开发者专业之选，支持全部模型",
        type: "monthly",
        price: 99,
        costPrice: 50,
        priceHint: "约3.3元/天",
        hourLimit5: 80,
        weekLimit: 1500,
        monthLimit: 6000,
        capabilityDesc: "支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor等编码工具；优先技术支持",
        lobsterCount: 30,
        memberCount: 1,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: null,
        stock: null,
        officialDiscount: 9.5,
        internalDiscount: 9,
        svipDiscount: 8.5,
        vipDiscount: 9,
        soldCount: 4892,
        totalIncome: 484308,
        status: "active",
        createTime: "2025-01-15 10:00:00",
        onSaleTime: "2025-01-15 10:00:00",
        features: ["30个龙虾", "全部模型支持"]
    },
    {
        id: 4,
        name: "团队基础版",
        identifier: "team-basic",
        product: "ai-plan" as const,
        description: "适合5人以下小团队协作",
        type: "monthly",
        price: 299,
        costPrice: 160,
        priceHint: "约10元/天",
        hourLimit5: 200,
        weekLimit: 4000,
        monthLimit: 16000,
        capabilityDesc: "支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor等编码工具；团队协作管理",
        lobsterCount: 50,
        memberCount: 5,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: null,
        stock: null,
        officialDiscount: 9.2,
        internalDiscount: 8.8,
        svipDiscount: 8.2,
        vipDiscount: 8.8,
        soldCount: 1856,
        totalIncome: 554944,
        status: "active",
        createTime: "2025-03-01 09:00:00",
        onSaleTime: "2025-03-01 09:00:00",
        features: ["50个龙虾", "全部模型支持", "5人团队"]
    },
    {
        id: 5,
        name: "团队专业版",
        identifier: "team-pro",
        product: "ai-plan" as const,
        description: "中型团队首选，性价比之选",
        type: "monthly",
        price: 699,
        costPrice: 380,
        priceHint: "约23.3元/天",
        hourLimit5: 500,
        weekLimit: 10000,
        monthLimit: 40000,
        capabilityDesc: "支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor、OpenClaw等编码工具；优先技术支持；团队管理",
        lobsterCount: 120,
        memberCount: 15,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: 10,
        stock: 5000,
        officialDiscount: 9,
        internalDiscount: 8.5,
        svipDiscount: 8,
        vipDiscount: 8.5,
        soldCount: 1234,
        totalIncome: 862866,
        status: "active",
        createTime: "2025-01-20 14:00:00",
        onSaleTime: "2025-01-20 14:00:00",
        features: ["120个龙虾", "全部模型支持", "15人团队", "优先技术支持"]
    },
    {
        id: 6,
        name: "企业旗舰版",
        identifier: "enterprise-flagship",
        product: "lobster" as const,
        description: "大型企业全功能版本，专属服务",
        type: "monthly",
        price: 1999,
        costPrice: 1100,
        priceHint: "约66.6元/天",
        hourLimit5: null,
        weekLimit: null,
        monthLimit: null,
        capabilityDesc: "支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor、OpenClaw等编码工具；专属技术支持；无限调用额度",
        lobsterCount: 500,
        memberCount: 50,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: 3,
        stock: 1000,
        officialDiscount: 8.5,
        internalDiscount: 8,
        svipDiscount: 7.5,
        vipDiscount: 8,
        soldCount: 428,
        totalIncome: 855572,
        status: "active",
        createTime: "2025-02-01 09:00:00",
        onSaleTime: "2025-02-01 09:00:00",
        features: ["500个龙虾", "全部模型支持", "50人团队", "专属技术支持"]
    },
    // ==================== 加油包（4个）====================
    {
        id: 7,
        name: "迷你加油包",
        identifier: "addon-mini",
        product: "ai-plan" as const,
        description: "小额补充，快速救急",
        type: "addon",
        price: 19,
        costPrice: 10,
        priceHint: "",
        hourLimit5: 5,
        weekLimit: null,
        monthLimit: null,
        capabilityDesc: "快速补充龙虾配额，仅限加油包用户",
        lobsterCount: 5,
        memberCount: 0,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: null,
        stock: null,
        officialDiscount: 10,
        internalDiscount: 10,
        svipDiscount: 9.5,
        vipDiscount: 10,
        soldCount: 8956,
        totalIncome: 170164,
        status: "active",
        createTime: "2025-04-01 09:00:00",
        onSaleTime: "2025-04-01 09:00:00",
        features: ["5个龙虾", "全部模型支持"]
    },
    {
        id: 8,
        name: "标准加油包",
        identifier: "addon-standard",
        product: "ai-plan" as const,
        description: "中等额度补充，满足短期需求",
        type: "addon",
        price: 99,
        costPrice: 55,
        priceHint: "",
        hourLimit5: 30,
        weekLimit: null,
        monthLimit: null,
        capabilityDesc: "支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor等编码工具",
        lobsterCount: 30,
        memberCount: 0,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: 20,
        stock: null,
        officialDiscount: 9.5,
        internalDiscount: 9,
        svipDiscount: 8.5,
        vipDiscount: 9,
        soldCount: 3467,
        totalIncome: 343233,
        status: "active",
        createTime: "2025-03-10 11:00:00",
        onSaleTime: "2025-03-10 11:00:00",
        features: ["30个龙虾", "全部模型支持"]
    },
    {
        id: 9,
        name: "专业加油包",
        identifier: "addon-pro",
        product: "lobster" as const,
        description: "大额度补充，适合项目冲刺期",
        type: "addon",
        price: 299,
        costPrice: 170,
        priceHint: "",
        hourLimit5: 80,
        weekLimit: null,
        monthLimit: null,
        capabilityDesc: "支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor、OpenClaw等编码工具；优先技术支持",
        lobsterCount: 100,
        memberCount: 0,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: 10,
        stock: 2000,
        officialDiscount: 9.2,
        internalDiscount: 8.8,
        svipDiscount: 8.2,
        vipDiscount: 8.8,
        soldCount: 1890,
        totalIncome: 565110,
        status: "active",
        createTime: "2025-02-20 15:00:00",
        onSaleTime: "2025-02-20 15:00:00",
        features: ["100个龙虾", "全部模型支持", "优先技术支持"]
    },
    {
        id: 10,
        name: "旗舰加油包",
        identifier: "addon-flagship",
        product: "lobster" as const,
        description: "超大额度补充，团队冲刺必备",
        type: "addon",
        price: 999,
        costPrice: 580,
        priceHint: "",
        hourLimit5: 200,
        weekLimit: null,
        monthLimit: null,
        capabilityDesc: "支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor、OpenClaw等编码工具；专属技术支持",
        lobsterCount: 500,
        memberCount: 0,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: 5,
        stock: 500,
        officialDiscount: 8.8,
        internalDiscount: 8.2,
        svipDiscount: 7.8,
        vipDiscount: 8.2,
        soldCount: 678,
        totalIncome: 677322,
        status: "inactive",
        createTime: "2025-04-15 09:00:00",
        onSaleTime: "",
        features: ["500个龙虾", "全部模型支持", "专属技术支持"]
    },
];

// 内存存储（运行时）
let packagesStore: Package[] = [...initialPackagesData];

// 获取所有资源包
export function getPackages(): Package[] {
    return packagesStore;
}

// 添加资源包
export function addPackage(pkg: Package): void {
    packagesStore = [pkg, ...packagesStore];
}

// 更新资源包
export function updatePackage(id: number, updates: Partial<Package>): Package | null {
    const index = packagesStore.findIndex(p => p.id === id);
    if (index === -1) return null;
    packagesStore[index] = { ...packagesStore[index], ...updates };
    return packagesStore[index];
}

// 更新资源包状态
export function updatePackageStatus(id: number, status: "active" | "inactive"): Package | null {
    const onSaleTime = new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\//g, '-');
    
    return updatePackage(id, { 
        status,
        onSaleTime: status === "active" ? onSaleTime : packagesStore.find(p => p.id === id)?.onSaleTime || ""
    });
}
