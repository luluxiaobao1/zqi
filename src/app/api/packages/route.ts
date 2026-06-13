import { NextResponse } from 'next/server';
import { getPackages } from '@/lib/packages-data';

// GET /api/packages - 获取套餐列表
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // 如果 status=active，只返回已上架套餐
    // 否则返回所有套餐
    const packages = status === 'active' ? getPackages().filter(p => p.status === 'active') : getPackages();
    
    return NextResponse.json({
        success: true,
        data: packages
    });
}
