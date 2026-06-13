'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Building2,
  Check,
  Zap,
  Shield,
  Clock,
  Cpu,
  Database,
  Code2,
  MessageSquare,
  Image,
  Video,
  Mic,
  FileText,
  Brain,
  Rocket,
  Users,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';

// 产品分类数据
const productCategories = [
  {
    name: '热门产品',
    items: [
      { name: 'API市场 APIMKT', desc: '图片、文本、音频、视频等多场景的API服务', url: 'https://zyun.360.cn/product/apimarket' },
      { name: '大模型广场 TLG', desc: '前沿普惠的大模型、助力AI快速落地', url: '/product/tlg' },
      { name: '云舟观测 GC', desc: '一站式数据采集与应用监控观测平台', url: 'https://console.zyun.360.cn/guance/intro' },
      { name: 'API协作云 APICloud', desc: 'API文档、调试、MOCK一体化协作平台', url: 'https://apicloud.360.cn/user/promanage/mylist' },
      { name: 'MCP市场 MCPMKT', desc: '企业级MCP 工具集成与托管平台', url: 'https://console.zyun.360.cn/mcpmkt' },
    ]
  },
  {
    name: '大模型',
    items: [
      { name: '大模型广场 TLG', desc: '前沿普惠的大模型、助力AI快速落地', url: '/product/tlg' },
      { name: '大模型开发 TLM', desc: '大模型微调、训练', url: 'https://zyun.360.cn/product/tlm' },
      { name: 'AI标注平台 TLP', desc: '集成大模型标注和机器学习标注', url: 'https://zyun.360.cn/product/tlp' },
      { name: 'AI评测平台 TEP', desc: '评估大模型和智能体', url: 'https://console.zyun.360.cn/tep' },
    ]
  },
  {
    name: '智能体',
    items: [
      { name: '智能体对话 AIMI', desc: '重塑人机沟通方式，让沟通更自然、更高效', badge: 'New', url: 'https://zyun.360.cn/product/aimi' },
      { name: 'MCP市场 MCPMKT', desc: '企业级MCP 工具集成与托管平台', badge: 'New', url: 'https://console.zyun.360.cn/mcpmkt' },
      { name: 'AI沙箱 Sandbox', desc: '提供安全隔离的云端沙箱环境执行AI生成的代码', url: 'https://console.zyun.360.cn/sandbox' },
    ]
  },
];

// 模型列表数据
const modelList = [
  {
    name: '360智脑',
    desc: '360自研大语言模型，支持多轮对话、文本生成等能力',
    type: '文本',
    icon: Brain,
    color: '#3b82f6',
  },
  {
    name: 'DeepSeek系列',
    desc: '深度求索开源大模型，性能优异，支持多种任务',
    type: '文本',
    icon: Cpu,
    color: '#8b5cf6',
  },
  {
    name: 'Llama系列',
    desc: 'Meta开源大模型，支持多语言文本生成和理解',
    type: '文本',
    icon: FileText,
    color: '#10b981',
  },
  {
    name: 'Qwen系列',
    desc: '阿里通义千问系列模型，强大的文本理解和生成能力',
    type: '文本',
    icon: MessageSquare,
    color: '#f59e0b',
  },
  {
    name: '图像理解模型',
    desc: '支持图像内容理解、物体识别、场景分析等能力',
    type: '多模态',
    icon: Image,
    color: '#ec4899',
  },
  {
    name: '图像生成模型',
    desc: '文生图、图生图，支持多种艺术风格创作',
    type: '多模态',
    icon: Image,
    color: '#06b6d4',
  },
  {
    name: '语音识别模型',
    desc: '高精度语音转文字，支持多语言和方言识别',
    type: '语音',
    icon: Mic,
    color: '#84cc16',
  },
  {
    name: '语音合成模型',
    desc: '文本转语音，自然流畅的语音输出',
    type: '语音',
    icon: Mic,
    color: '#f97316',
  },
  {
    name: '视频生成模型',
    desc: '文生视频、图生视频，AI驱动的视频创作',
    type: '多模态',
    icon: Video,
    color: '#ef4444',
  },
];

// 产品优势数据
const advantages = [
  {
    icon: Database,
    title: '开源模型丰富',
    desc: '平台汇集主流开源基础模型和部分行业模型，第一时间提供最前沿、最热门的模型。',
  },
  {
    icon: Zap,
    title: '多模态支持',
    desc: '文本、语音、多模态等多种模型提供体验，满足不同场景需求。',
  },
  {
    icon: Rocket,
    title: '高性能推理',
    desc: '采用自研+开源架构提升推理性能，模型响应速度快。',
  },
  {
    icon: Cpu,
    title: '灵活算力配置',
    desc: '底层集成多种算力资源，满足不同任务对算力的需求。',
  },
];

// 核心功能数据
const features = [
  {
    title: '模型广场',
    desc: '支持360智脑大模型、国内外开源大模型（DeepSeek系列、Llama系列、Qwen系列），用户可通过模型广场找到符合自身需求的模型。',
    icon: Brain,
  },
  {
    title: '模型体验',
    desc: '支持文本、语音、文生图、文生视频、图像理解等多模态模型的体验。',
    icon: Rocket,
  },
  {
    title: '模型部署',
    desc: '平台提供模型部署功能，用户可将训练好的模型快速部署到生产环境，提供实时与批量部署等模式。',
    icon: Code2,
  },
];

// 应用场景数据
const scenarios = [
  {
    title: '智能算法与软件开发',
    desc: '可以应用于软件开发和应用程序设计，实现智能算法和自动化编程，提高软件开发的效率和质量，加速产品上线和迭代更新。',
    icon: Code2,
  },
  {
    title: '商务智能与决策支持',
    desc: '可以分析商务数据和业务指标，发现商机和业务趋势，为企业的战略规划和业务决策提供数据支持和智能化建议。',
    icon: Database,
  },
  {
    title: '智能办公与企业服务',
    desc: '可以应用于智能办公环境的建设和管理，帮助企业提升办公效率和员工体验。',
    icon: Users,
  },
  {
    title: '科学研究与技术创新',
    desc: '可以帮助科学研究人员和技术服务提供商进行大规模数据分析和预测，发现新的科学规律和商业洞见，加速科学研究和技术创新的进程。',
    icon: Brain,
  },
];

export default function TLGPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(1); // 默认选中"大模型"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const username = 'luxiaobao';

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex items-center">
                  {/* 双环图形Logo */}
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mr-1.5">
                    <path 
                      d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z" 
                      fill="#1a5cff"
                    />
                    <path 
                      d="M22 6L24 10L20 10L22 6Z" 
                      fill="#1a5cff"
                    />
                    <path 
                      d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z" 
                      fill="#00d4aa"
                    />
                    <path 
                      d="M19 3L21 7L17 7L19 3Z" 
                      fill="#00d4aa"
                    />
                  </svg>
                  <span className="text-[17px] font-bold text-[#2c3e50] tracking-tight">360</span>
                  <span className="text-[17px] font-bold text-[#2c3e50] ml-0.5 tracking-tight">智汇云</span>
                </div>
              </Link>

              {/* 导航菜单 */}
              <nav className="hidden lg:flex items-center ml-8">
                {/* 产品 */}
                <div 
                  className="relative"
                  onMouseEnter={() => setProductMenuOpen(true)}
                  onMouseLeave={() => setProductMenuOpen(false)}
                >
                  <button className="flex items-center h-16 px-4 text-gray-700 hover:text-blue-600 font-medium">
                    产品
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  
                  {/* 下拉菜单 */}
                  {productMenuOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden">
                      <div className="flex">
                        {/* 左侧分类 */}
                        <ul className="w-[140px] bg-gray-50 py-2">
                          {productCategories.map((cat, idx) => (
                            <li 
                              key={idx}
                              className={`flex items-center px-4 py-3 cursor-pointer text-sm transition-colors ${
                                activeCategory === idx
                                  ? 'bg-white text-blue-600 border-l-2 border-blue-600' 
                                  : 'text-gray-700 hover:bg-white hover:text-blue-600'
                              }`}
                              onClick={() => setActiveCategory(idx)}
                            >
                              {cat.name}
                            </li>
                          ))}
                        </ul>
                        
                        {/* 右侧产品列表 */}
                        <div className="flex-1 p-4">
                          <ul className="space-y-2">
                            {productCategories[activeCategory].items.map((item, idx) => (
                              <li key={idx}>
                                <Link href={item.url} className="group block py-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                      {item.name}
                                    </span>
                                    {item.badge && (
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-500">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="https://zyun.360.cn/solution/solvecommonlive" className="h-16 px-4 flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  解决方案
                </Link>
                <Link href="https://zyun.360.cn/help" className="h-16 px-4 flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  文档中心
                </Link>
                <Link href="https://zyun.360.cn/aboutus" className="h-16 px-4 flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  关于我们
                </Link>
              </nav>
            </div>

            {/* 右侧按钮 */}
            <div className="flex items-center gap-3">
              <Link 
                href="/enterprise" 
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Building2 className="w-4 h-4" />
                企业入口
              </Link>
              <Link 
                href="/console" 
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
                控制台
              </Link>
              
              <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1"></div>
              
              {isLoggedIn ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-50">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{username}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 w-40 bg-white shadow-lg rounded-lg border border-gray-100 py-1 z-50">
                      <Link 
                        href="/enterprise" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Building2 className="w-4 h-4" />
                        企业入口
                      </Link>
                      <Link 
                        href="/console" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        控制台
                      </Link>
                      <button 
                        onClick={() => setIsLoggedIn(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => setIsLoggedIn(true)}>
                    <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      登录
                    </Button>
                  </button>
                  <Link href="https://zyun.360.cn/signup">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      免费注册
                    </Button>
                  </Link>
                </>
              )}
              
              <button 
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4">
            <div className="max-w-[1180px] mx-auto px-4 space-y-2">
              <Link href="#" className="block py-2 text-gray-700">产品</Link>
              <Link href="#" className="block py-2 text-gray-700">解决方案</Link>
              <Link href="#" className="block py-2 text-gray-700">文档中心</Link>
              <Link href="#" className="block py-2 text-gray-700">关于我们</Link>
            </div>
          </div>
        )}
      </header>

      {/* Banner区域 */}
      <section className="pt-16">
        <div className="relative min-h-[400px] bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#1a365d] overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-[1180px] mx-auto px-4 py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
                <Zap className="w-4 h-4" />
                <span>大模型广场 TLG</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                前沿普惠的大模型
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  助力AI快速落地
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                一站式大模型服务平台，汇集国内外主流开源大模型，提供模型体验、部署、微调等全生命周期服务
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/enterprise">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8">
                    立即使用
                  </Button>
                </Link>
                <Link href="https://zyun.360.cn/help">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-11 px-8">
                    查看文档
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 产品优势 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">产品优势</h2>
            <p className="text-gray-500">为您提供专业、高效的大模型服务</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="py-20 bg-white">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">核心功能</h2>
            <p className="text-gray-500">全方位满足您的大模型需求</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <div className="relative bg-white border border-gray-100 rounded-2xl p-8 hover:border-blue-200 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 模型广场 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">模型广场</h2>
            <p className="text-gray-500">丰富的大模型资源，满足各类业务场景</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelList.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/enterprise">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8">
                查看全部模型
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 应用场景 */}
      <section className="py-20 bg-white">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">应用场景</h2>
            <p className="text-gray-500">助力各行各业智能化转型</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {scenarios.map((item, idx) => (
              <div 
                key={idx} 
                className="flex gap-6 p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center shrink-0 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 咨询区域 */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                1对1咨询专属顾问
              </h2>
              <p className="text-blue-100 mb-6 leading-relaxed">
                1对1免费咨询智汇云专属顾问，为您量身定制产品推荐方案。
                智汇云专业的服务团队，致力于为您提供专业的售前购买咨询服务，及完善的售后技术服务，助您云上无忧。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/enterprise">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 h-11 px-6">
                    立即咨询
                  </Button>
                </Link>
                <Link href="https://zyun.360.cn/help">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-11 px-6">
                    查看文档
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                <Mail className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-sm text-blue-100">官方邮箱</div>
                <div className="text-white font-medium mt-1">zyun@360.cn</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                <Phone className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-sm text-blue-100">服务热线</div>
                <div className="text-white font-medium mt-1">400-669-3600</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                <MessageCircle className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-sm text-blue-100">在线客服</div>
                <div className="text-white font-medium mt-1">7×24小时</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-sm text-blue-100">即刻开始</div>
                <div className="text-white font-medium mt-1">免费试用</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="bg-[#1a1a1a] text-gray-400 py-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mr-1.5">
                  <path d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z" fill="#1a5cff" />
                  <path d="M22 6L24 10L20 10L22 6Z" fill="#1a5cff" />
                  <path d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z" fill="#00d4aa" />
                  <path d="M19 3L21 7L17 7L19 3Z" fill="#00d4aa" />
                </svg>
                <span className="text-white font-bold">360智汇云</span>
              </div>
              <p className="text-sm leading-relaxed">
                智汇云—奇虎360企业应用开放服务平台，为各行各业的业务及应用提供强有力的产品、技术力量。
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">产品服务</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/product/tlg" className="hover:text-white transition-colors">大模型广场</Link></li>
                <li><Link href="https://zyun.360.cn/product/apimarket" className="hover:text-white transition-colors">API市场</Link></li>
                <li><Link href="https://zyun.360.cn/product/obs" className="hover:text-white transition-colors">对象存储</Link></li>
                <li><Link href="https://zyun.360.cn/product/cdn" className="hover:text-white transition-colors">CDN加速</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">支持与服务</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="https://zyun.360.cn/help" className="hover:text-white transition-colors">文档中心</Link></li>
                <li><Link href="https://zyun.360.cn/aboutus" className="hover:text-white transition-colors">关于我们</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">联系客服</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">服务协议</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">友情链接</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="https://www.360.cn" className="hover:text-white transition-colors">360官网</Link></li>
                <li><Link href="https://ai.360.cn" className="hover:text-white transition-colors">360智能体工厂</Link></li>
                <li><Link href="https://yifang.360.cn" className="hover:text-white transition-colors">360亿方智能</Link></li>
                <li><Link href="https://pan.360.cn" className="hover:text-white transition-colors">360AI云盘</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 360智汇云 版权所有</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
