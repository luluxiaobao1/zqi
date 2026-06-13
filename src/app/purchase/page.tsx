"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package } from "@/lib/packages-data";

import {
    Check,
    X,
    Building2,
    Users,
    ChevronDown,
    Sparkles,
} from "lucide-react";

export default function PurchasePage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<"monthly" | "addon">("monthly");
    const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [showCompare, setShowCompare] = useState(false);

    // 获取套餐数据
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/packages?status=active');
                const result = await response.json();
                if (result.success) {
                    setPackages(result.data);
                }
            } catch (error) {
                console.error('获取套餐失败:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    // 根据类型过滤套餐
    const filteredPackages = packages.filter(pkg => pkg.type === selectedType);

    // 格式化价格
    const formatPrice = (price: number) => {
        if (price === 0) return "0";
        return price.toLocaleString();
    };

    // 格式化数字
    const formatNumber = (num: number) => {
        if (num >= 100000000) {
            return `${(num / 100000000).toFixed(1)}亿`;
        } else if (num >= 10000) {
            return `${(num / 10000).toFixed(0)}万`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K`;
        }
        return num.toLocaleString();
    };

    // 处理购买
    const handlePurchase = (pkg: Package) => {
        setSelectedPackage(pkg);
        setPurchaseDialogOpen(true);
    };

    // 确认购买
    const confirmPurchase = () => {
        console.log("购买套餐:", selectedPackage?.name);
        setPurchaseDialogOpen(false);
    };

    // 判断是否为推荐套餐
    const isRecommended = (pkg: Package) => {
        if (pkg.type === "monthly") {
            return pkg.name.includes("专业");
        }
        return pkg.name.includes("专业");
    };

    return (
        <div className="min-h-screen bg-[#f5f6f8]">
            {/* 顶部导航栏 */}
            <header className="fixed top-0 left-0 right-0 h-[56px] bg-white z-[1000] border-b border-gray-100">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">智</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">360智汇云</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/platform" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            控制台
                        </Link>
                        <Link href="/purchase" className="text-sm text-blue-600 font-medium">
                            套餐购买
                        </Link>
                        <Link href="/enterprise" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            企业入口
                        </Link>
                    </nav>
                </div>
            </header>

            {/* 主内容区 */}
            <main className="pt-[56px]">
                {/* 标题区域 */}
                <section className="py-12 px-6 text-center">
                    <h1 className="text-[28px] font-bold text-gray-900 mb-3">
                        360智汇云订阅套餐
                    </h1>
                    <p className="text-base text-gray-500">
                        请选择适合你的方案，如已购买请登录后继续
                    </p>
                </section>

                {/* 套餐类型切换 */}
                <section className="px-6 mb-8">
                    <div className="flex items-center justify-center">
                        <div className="inline-flex bg-gray-100 rounded-full p-1">
                            <button
                                onClick={() => setSelectedType("monthly")}
                                className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
                                    selectedType === "monthly"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    月包
                                </span>
                            </button>
                            <button
                                onClick={() => setSelectedType("addon")}
                                className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${
                                    selectedType === "addon"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4" />
                                    加油包
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* 套餐卡片 */}
                <section className="px-6 pb-16">
                    <div className="max-w-6xl mx-auto">
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">加载中...</div>
                        ) : filteredPackages.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">暂无套餐</div>
                        ) : (
                            <div className={`grid gap-5 ${
                                filteredPackages.length <= 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' :
                                filteredPackages.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                                'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                            }`}>
                                {filteredPackages.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className={`relative bg-white rounded-2xl p-6 transition-all hover:shadow-lg ${
                                            isRecommended(pkg)
                                                ? 'ring-2 ring-blue-500 shadow-lg'
                                                : 'border border-gray-100 shadow-sm'
                                        }`}
                                    >
                                        {/* 推荐标签 */}
                                        {isRecommended(pkg) && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full shadow-lg">
                                                最受欢迎
                                            </div>
                                        )}

                                        {/* 套餐名称 */}
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                                        </div>

                                        {/* 价格 */}
                                        <div className="text-center mb-5 py-4 border-b border-gray-100">
                                            <div className="flex items-baseline justify-center gap-0.5">
                                                <span className="text-sm text-gray-500">¥</span>
                                                <span className="text-[40px] font-bold text-gray-900 leading-none">
                                                    {formatPrice(pkg.price)}
                                                </span>
                                                <span className="text-sm text-gray-500">{pkg.type === 'monthly' ? '/月' : ''}</span>
                                            </div>
                                            {/* 折扣信息 */}
                                            {pkg.officialDiscount < 10 && (
                                                <div className="mt-2 text-xs text-gray-400">
                                                    原价 ¥{Math.round(pkg.price / (pkg.officialDiscount / 10))}{pkg.type === 'monthly' ? '/月' : ''}
                                                </div>
                                            )}
                                        </div>

                                        {/* 权益列表 */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-start gap-2.5 text-sm">
                                                <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600">
                                                    {pkg.lobsterCount} 个龙虾
                                                </span>
                                            </div>
                                            {pkg.memberCount > 0 && (
                                                <div className="flex items-start gap-2.5 text-sm">
                                                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-600">
                                                        支持 {pkg.memberCount} 人团队
                                                    </span>
                                                </div>
                                            )}
                                            {/* 可用模型 */}
                                            {pkg.availableModels && pkg.availableModels.length > 0 && (
                                                <div className="flex items-start gap-2.5 text-sm">
                                                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-600">
                                                        全部模型支持
                                                    </span>
                                                </div>
                                            )}
                                            {/* 额外权益 */}
                                            {pkg.features.slice(2).map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 text-sm">
                                                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-600">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 折扣标签 */}
                                        {(pkg.officialDiscount < 10 || pkg.internalDiscount < 10 || pkg.svipDiscount < 10 || pkg.vipDiscount < 10) && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {pkg.officialDiscount < 10 && (
                                                    <span className="px-2 py-0.5 text-xs bg-orange-50 text-orange-600 rounded">
                                                        官方{pkg.officialDiscount}折
                                                    </span>
                                                )}
                                                {pkg.internalDiscount < 10 && (
                                                    <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
                                                        内部{pkg.internalDiscount}折
                                                    </span>
                                                )}
                                                {pkg.svipDiscount < 10 && (
                                                    <span className="px-2 py-0.5 text-xs bg-purple-50 text-purple-600 rounded">
                                                        SVIP{pkg.svipDiscount}折
                                                    </span>
                                                )}
                                                {pkg.vipDiscount < 10 && (
                                                    <span className="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded">
                                                        VIP{pkg.vipDiscount}折
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* 购买按钮 */}
                                        <button
                                            onClick={() => handlePurchase(pkg)}
                                            className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                                                pkg.price === 0
                                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                                    : isRecommended(pkg)
                                                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25'
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            {pkg.price === 0 ? '免费开通' : '立即购买'}
                                        </button>

                                        {/* 限购信息 */}
                                        {pkg.purchaseLimit && (
                                            <div className="text-center text-xs text-gray-400 mt-2">
                                                每人限购 {pkg.purchaseLimit} 个
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* 功能对比 */}
                <section className="px-6 pb-16">
                    <div className="max-w-6xl mx-auto">
                        <button
                            onClick={() => setShowCompare(!showCompare)}
                            className="flex items-center justify-center gap-2 w-full py-4 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">功能对比</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCompare ? 'rotate-180' : ''}`} />
                        </button>

                        {showCompare && (
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mt-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                                                    套餐版本
                                                </th>
                                                {filteredPackages.map(pkg => (
                                                    <th key={pkg.id} className="text-center py-4 px-4 text-sm font-medium text-gray-900 min-w-[120px]">
                                                        {pkg.name}
                                                    </th>
                                                ))}
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="py-3 px-6 text-sm text-gray-500">价格（月）</td>
                                                {filteredPackages.map(pkg => (
                                                    <td key={pkg.id} className="text-center py-3 px-4 text-sm text-gray-900 font-medium">
                                                        ¥{formatPrice(pkg.price)}
                                                    </td>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-50">
                                                <td className="py-3 px-6 text-sm text-gray-500">龙虾数量</td>
                                                {filteredPackages.map(pkg => (
                                                    <td key={pkg.id} className="text-center py-3 px-4 text-sm text-gray-900">
                                                        {pkg.lobsterCount}个
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b border-gray-50">
                                                <td className="py-3 px-6 text-sm text-gray-500">成员数</td>
                                                {filteredPackages.map(pkg => (
                                                    <td key={pkg.id} className="text-center py-3 px-4 text-sm text-gray-900">
                                                        {pkg.memberCount === 0 ? '不限' : `${pkg.memberCount}人`}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b border-gray-50">
                                                <td className="py-3 px-6 text-sm text-gray-500">可用模型</td>
                                                {filteredPackages.map(pkg => (
                                                    <td key={pkg.id} className="text-center py-3 px-4 text-sm text-gray-900">
                                                        {pkg.availableModels && pkg.availableModels.length > 0 ? '全部' : '基础'}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="border-b border-gray-50">
                                                <td className="py-3 px-6 text-sm text-gray-500">每人限购</td>
                                                {filteredPackages.map(pkg => (
                                                    <td key={pkg.id} className="text-center py-3 px-4 text-sm text-gray-900">
                                                        {pkg.purchaseLimit ? `${pkg.purchaseLimit}个` : '不限'}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 套餐说明 */}
                <section className="px-6 pb-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">套餐说明</h3>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p>1. 套餐购买后立即生效，有效期内可使用相应额度。</p>
                                <p>2. 套餐到期后，未使用的额度将自动清零，请合理安排使用时间。</p>
                                <p>3. 企业版套餐支持多人协作，可根据团队规模选择合适套餐。</p>
                                <p>4. 所有价格均为税前价格，如有疑问请联系客服。</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 购买确认弹窗 */}
            {purchaseDialogOpen && selectedPackage && (
                <div 
                    className="fixed inset-0 z-[2000] flex items-center justify-center"
                    onClick={() => setPurchaseDialogOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div 
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">确认购买</h3>
                            <button
                                onClick={() => setPurchaseDialogOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-500">套餐名称</span>
                                    <span className="font-medium text-gray-900">{selectedPackage.name}</span>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-500">套餐类型</span>
                                    <span className={`px-2 py-0.5 text-xs rounded ${
                                        selectedPackage.type === "monthly" 
                                            ? "bg-purple-50 text-purple-700" 
                                            : "bg-green-50 text-green-700"
                                    }`}>
                                        {selectedPackage.type === "monthly" ? "月包" : "加油包"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-500">龙虾数量</span>
                                    <span className="text-sm text-gray-900">{selectedPackage.lobsterCount}个</span>
                                </div>
                                {selectedPackage.memberCount > 0 && (
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-gray-500">成员数</span>
                                        <span className="text-sm text-gray-900">{selectedPackage.memberCount}人</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">价格</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            ¥{formatPrice(selectedPackage.price)}
                                            {selectedPackage.type === "monthly" && (
                                                <span className="text-sm font-normal text-gray-500">/月</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPurchaseDialogOpen(false)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={confirmPurchase}
                                    className="flex-1 py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                                >
                                    确认购买
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
