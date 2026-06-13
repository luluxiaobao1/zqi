// 订单状态类型
export type OrderStatus = 'success' | 'failed' | 'pending';

// 订单数据结构
export interface Order {
    id: number;
    taskId: string;
    orderId: string;
    creator: string;
    createTime: string;
    serviceName: string;
    productName: string;
    orderType: string;
    quantity: number;
    orderAmount: number;
    payableAmount: number;
    payTime: string;
    status: OrderStatus;
    // 资源包特有字段
    packageId?: number;
    packageName?: string;
    validity?: string;
}

// 生成唯一ID
const generateId = (prefix: string) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}${timestamp}${random}`;
};

// 订单存储KEY
const ORDER_STORAGE_KEY = 'zhiqi_orders';

// 获取所有订单
export const getOrders = (): Order[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(ORDER_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [];
        }
    }
    return [];
};

// 保存订单
export const saveOrders = (orders: Order[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
};

// 创建资源包订单
export const createPackageOrder = (params: {
    packageId: number;
    packageName: string;
    quantity: number;
    amount: number;
    validity: string;
    creator: string;
}): Order => {
    const now = new Date();
    const formatTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    };

    const order: Order = {
        id: Date.now(),
        taskId: generateId('ZY'),
        orderId: generateId('ZF'),
        creator: params.creator,
        createTime: formatTime(now),
        serviceName: params.packageName,
        productName: '360智汇云资源包',
        orderType: '新购',
        quantity: params.quantity,
        orderAmount: params.amount,
        payableAmount: params.amount,
        payTime: formatTime(now),
        status: 'success',
        packageId: params.packageId,
        packageName: params.packageName,
        validity: params.validity,
    };

    // 保存到localStorage
    const existingOrders = getOrders();
    saveOrders([order, ...existingOrders]);

    return order;
};

// 获取订单数量
export const getOrderCount = (): number => {
    return getOrders().length;
};

// 清空订单
export const clearOrders = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ORDER_STORAGE_KEY);
};
