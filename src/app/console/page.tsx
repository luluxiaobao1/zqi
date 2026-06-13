'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Menu, X, User, LogOut, Settings, Eye, EyeOff } from 'lucide-react';

// 产品分类数据
const productCategories = [
  {
    name: '热门产品',
    icon: '🔥',
    items: [
      { name: 'API市场 APIMKT', desc: '图片、文本、音频、视频等多场景的API服务', url: 'https://zyun.360.cn/product/apimarket' },
      { name: '大模型广场 TLG', desc: '前沿普惠的大模型、助力AI快速落地', url: 'https://zyun.360.cn/product/tlg' },
      { name: '云舟观测 GC', desc: '一站式数据采集与应用监控观测平台', url: 'https://console.zyun.360.cn/guance/intro' },
      { name: 'API协作云 APICloud', desc: 'API文档、调试、MOCK一体化协作平台', url: 'https://apicloud.360.cn/user/promanage/mylist' },
      { name: 'MCP市场 MCPMKT', desc: '企业级MCP 工具集成与托管平台', url: 'https://console.zyun.360.cn/mcpmkt' },
    ]
  },
  {
    name: 'Serverless',
    icon: '',
    items: [
      { name: 'API市场 APIMKT', desc: '图片、文本、音频、视频等多场景的API服务', badge: 'Hot', url: 'https://zyun.360.cn/product/apimarket' },
      { name: '分布式数据库 TiDB', desc: '国产分布式数据库，兼容Mysql，支持高可用', url: 'https://zyun.360.cn/product/tidb' },
      { name: 'KV数据库 ZestKV', desc: '360开源兼容Redis协议的高性能存储服务', url: 'https://zyun.360.cn/product/zestkv' },
      { name: '向量数据库 Milvus', desc: '专为大规模向量数据检索和分析而生', url: 'https://console.zyun.360.cn/milvus/' },
      { name: '对象存储 OBS', desc: '稳定、安全、可靠的云存储服务', url: 'https://zyun.360.cn/product/obs' },
      { name: '消息队列 Pulsar', desc: '开源的企业级分布式消息系统', url: 'https://console.zyun.360.cn/pulsar/' },
      { name: '内容分发网络 CDN', desc: '安全、稳定、低延时的分发加速服务', url: 'https://zyun.360.cn/product/cdn' },
      { name: 'P2P内容分发 PCDN', desc: '利用闲置资源而构建的低成本高品质CDN', url: 'https://zyun.360.cn/product/pcdn' },
    ]
  },
  {
    name: 'API市场',
    icon: '',
    items: [
      { name: 'API市场 APIMKT', desc: '图片、文本、音频、视频等多场景的API服务', badge: 'Hot', url: 'https://zyun.360.cn/product/apimarket' },
      { name: '大语言模型 LLM', desc: '标准的OpenAI API格式访问各种大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/llm' },
      { name: '图像理解 IU', desc: '图像理解大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/visual' },
      { name: '图像生成 IC', desc: '图像生成大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/image-create' },
      { name: '语音识别 ASR', desc: '语音识别大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/transcriptions' },
      { name: '语音合成 TTS', desc: '语音合成大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/tts' },
      { name: '视频生成 VS', desc: '视频生成大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/video' },
      { name: 'OCR识别 OCR', desc: '卡证识别 | 通用文本识别 | 车牌识别', url: 'https://zyun.360.cn/product/apimarketitem/image-ocr' },
      { name: '内容审核 CM', desc: '图片审核 | 文本审核 | 音频审核 | 视频审核', url: 'https://zyun.360.cn/product/ai' },
    ]
  },
  {
    name: '大模型',
    icon: '',
    items: [
      { name: '大模型广场 TLG', desc: '前沿普惠的大模型、助力AI快速落地', url: 'https://zyun.360.cn/product/tlg' },
      { name: '大模型开发 TLM', desc: '大模型微调、训练', url: 'https://zyun.360.cn/product/tlm' },
      { name: 'AI标注平台 TLP', desc: '集成大模型标注和机器学习标注', url: 'https://zyun.360.cn/product/tlp' },
      { name: 'AI评测平台 TEP', desc: '评估大模型和智能体', url: 'https://console.zyun.360.cn/tep' },
      { name: '大语言模型 LLM', desc: '标准的OpenAI API格式访问各种大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/llm' },
      { name: '图像理解 IU', desc: '图像理解大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/visual' },
      { name: '图像生成 IC', desc: '图像生成大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/image-create' },
      { name: '语音识别 ASR', desc: '语音识别大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/transcriptions' },
      { name: '语音合成 TTS', desc: '语音合成大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/tts' },
      { name: '视频生成 VS', desc: '视频生成大模型服务', url: 'https://zyun.360.cn/product/apimarketitem/video' },
      { name: 'OCR识别 OCR', desc: '卡证识别 | 通用文本识别 | 车牌识别', url: 'https://zyun.360.cn/product/apimarketitem/image-ocr' },
      { name: '内容审核 CM', desc: '图片审核 | 文本审核 | 音频审核 | 视频审核', url: 'https://zyun.360.cn/product/ai' },
    ]
  },
  {
    name: '智能体',
    icon: '',
    items: [
      { name: '智能体对话 AIMI', desc: '重塑人机沟通方式，让沟通更自然、更高效', badge: 'New', url: 'https://zyun.360.cn/product/aimi' },
      { name: 'MCP市场 MCPMKT', desc: '企业级MCP 工具集成与托管平台', badge: 'New', url: 'https://console.zyun.360.cn/mcpmkt' },
      { name: 'AI沙箱 Sandbox', desc: '提供安全隔离的云端沙箱环境执行AI生成的代码', url: 'https://console.zyun.360.cn/sandbox' },
      { name: '智能体记忆 AMS', desc: '为大模型应用设计的记忆层，让AI具备持久记忆', url: 'https://console.zyun.360.cn/ams' },
    ]
  },
  {
    name: '存储',
    icon: '',
    items: [
      { name: '对象存储 OBS', desc: '稳定、安全、可靠的云存储服务', url: 'https://zyun.360.cn/product/obs' },
      { name: '文件系统 PoleFS', desc: '可大规模共享访问，弹性扩展的分布式文件系统', url: 'https://zyun.360.cn/product/polefs' },
      { name: '域名管理 DNS', desc: '外网域名和内网域名便捷统一管理', url: 'https://console.zyun.360.cn/dns/' },
      { name: '证书管理 SSL', desc: '为您提供 SSL 证书的上传、管理、部署等服务', url: 'https://console.zyun.360.cn/ssl/' },
    ]
  },
  {
    name: '计算',
    icon: '',
    items: [
      { name: '云服务器 ECS', desc: '弹性可伸缩的计算服务', url: 'https://zyun.360.cn/product/ecs' },
    ]
  },
  {
    name: '数据库',
    icon: '',
    items: [
      { name: '云数据库 MySQL', desc: '稳定可靠、可弹性伸缩的关系型云数据库', url: 'https://zyun.360.cn/product/mysql' },
      { name: '分布式数据库 TiDB', desc: '国产分布式数据库，兼容Mysql，支持高可用', url: 'https://zyun.360.cn/product/tidb' },
      { name: 'KV数据库 ZestKV', desc: '360开源兼容Redis协议的高性能存储服务', url: 'https://zyun.360.cn/product/zestkv' },
      { name: '向量数据库 Milvus', desc: '专为大规模向量数据检索和分析而生', url: 'https://console.zyun.360.cn/milvus/' },
      { name: '云数据库 PGSQL', desc: 'PostgreSQL关系型数据库', url: 'https://console.zyun.360.cn/postgresql' },
    ]
  },
  {
    name: '视频云',
    icon: '',
    items: [
      { name: '智能体对话 AIMI', desc: '重塑人机沟通方式，让沟通更自然、更高效', badge: 'New', url: 'https://zyun.360.cn/product/aimi' },
      { name: '视频会议 VCS', desc: '稳定安全的低延迟互动会议解决方案', url: 'https://zyun.360.cn/product/vcs' },
      { name: '视频直播 LIVE', desc: '大规模实时转码、低延时的直播服务', url: 'https://zyun.360.cn/product/live' },
      { name: '视频点播 VOD', desc: '视频流畅播放服务', url: 'https://zyun.360.cn/product/vod' },
      { name: '音视频通话 RTC', desc: '便捷的跨平台实时音视频互动直播服务', url: 'https://zyun.360.cn/product/interact' },
      { name: '媒体处理 MPC', desc: '简洁的云媒体转码及内容合成处理服务', url: 'https://zyun.360.cn/product/media' },
      { name: '视频工具 VTK', desc: '视频剪辑SDK | 播放SDK', url: 'https://zyun.360.cn/product/sdk' },
    ]
  },
  {
    name: '研发运维',
    icon: '',
    items: [
      { name: '云舟观测 GC', desc: '一站式数据采集与应用监控观测平台', badge: 'Hot', url: 'https://console.zyun.360.cn/guance/intro' },
      { name: '统一身份认证 IAM', desc: '统一的身份认证、授权管理', url: 'https://console.idaas.360.cn/' },
      { name: 'API协作云 APICloud', desc: 'API文档、调试、MOCK一体化协作平台', badge: 'Hot', url: 'https://apicloud.360.cn/user/promanage/mylist' },
      { name: '三六零天御加固保 JiaGu', desc: '提供安全可靠的加固防护产品及服务', url: 'https://jiagu.360.cn/#/' },
      { name: '宙视资产监测与漏洞扫描平台 ZhouShi', desc: '描绘资产画像，多维挖掘资产漏洞', url: 'https://zyun.360.cn/product/zhoushi' },
      { name: '360宙合流量威胁分析平台 Zhouhe', desc: '提供安全可靠的流量威胁鉴定服务', url: 'https://zyun.360.cn/product/zhouhe' },
    ]
  },
  {
    name: '数智应用',
    icon: '',
    items: [
      { name: '视图计算 VEC', desc: '云边融合 AI赋能的智能视图计算', url: 'https://aimonitor.360.cn/' },
      { name: '幕印企业学堂 MuYin', desc: '企业培训|内容付费|知识营销', url: 'https://muyin.360.cn/' },
      { name: '易讲教室直播 YiJiang', desc: '视频技术与传统教室融合', url: 'https://yj.360.cn/' },
      { name: '知识中心 GeeDoc', desc: '安全可靠的智能知识管理平台', url: 'https://geedoc.geelib.360.cn/' },
    ]
  },
  {
    name: '物联网',
    icon: '',
    items: [
      { name: '企业物联网平台 IOT', desc: '设备管理 | 设备接入 | 规则引擎 | 应用开发', url: 'https://zyun.360.cn/product/iotdevicemanage' },
      { name: '生活物联网 LifeIOT', desc: '针对消费级智能设备的物联网平台', url: 'https://zyun.360.cn/product/livingiot' },
    ]
  },
  {
    name: '专有部署',
    icon: '',
    items: [
      { name: '360云计算管理平台 Stack', desc: '规划、建设、运维一体的云计算解决方案', url: 'https://zyun.360.cn/solution/apsarastack' },
      { name: '奇麟大数据 QiLin', desc: '企业级一站式大数据平台', url: 'https://zyun.360.cn/solution/Qilin' },
      { name: '360容器管理平台 Container', desc: '可对外私有化的容器云平台', url: 'https://zyun.360.cn/solution/Container' },
      { name: '360AI开发平台专有版 Prophet', desc: '全流程机器学习开发平台', url: 'https://zyun.360.cn/product/prophet' },
    ]
  },
];

// Banner数据
const bannerItems = [
  { title: '天纪大模型开发 TLM', subtitle: '大模型微调、训练', bgImage: 'https://p1.ssl.qhimg.com/t011c03ee0e2de94dd4.png', url: 'https://zyun.360.cn/product/tlm' },
  { title: '幕印企业学堂', subtitle: '快速创造属于自己的直播店铺', badge: '免费试用', bgImage: 'https://p2.ssl.qhimg.com/t0169907de726bb33cd.png', url: 'https://muyin.360.cn/' },
  { title: '对象存储 OBS', subtitle: '稳定、安全、可靠的云存储服务', bgImage: 'https://p3.ssl.qhimg.com/t01961c9e42d095b2aa.png', url: 'https://zyun.360.cn/product/obs' },
  { title: '云舟观测 GC', subtitle: '一站式数据采集、监控告警、APM 产品', bgImage: 'https://p2.ssl.qhimg.com/t01b75f00d5e1ebdd0b.png', url: 'https://guance.360.cn/' },
];

// 新闻动态数据
const newsItems = [
  { title: '【公司动态】"赛博龙虾"爆火却风险频发，360发布首份OpenClaw安全部署指南', date: '2026-03-16', url: 'https://zyun.360.cn/aboutus#lists' },
  { title: '【公司动态】教育部AI教育新政落地，360 ADE认证成产教融合关键抓手', date: '2026-01-26', url: 'https://zyun.360.cn/aboutus#lists' },
  { title: '【产品动态】AI沙箱产品上线！', date: '2026-01-13', url: 'https://zyun.360.cn/aboutus#lists' },
  { title: '【公司动态】360集团入选全国"智能体互联协议首批试点单位"', date: '2026-01-07', url: 'https://zyun.360.cn/aboutus#lists' },
  { title: '【公司动态】榜首加冕！360登顶"2025中国网络安全企业20强"', date: '2025-12-29', url: 'https://zyun.360.cn/aboutus#lists' },
  { title: '【公司动态】实力登榜！360与纳米AI入选年度AI双榜单', date: '2025-12-12', url: 'https://zyun.360.cn/aboutus#lists' },
  { title: '【公司动态】智能体何以颠覆软件产业？周鸿祎在数博会发表演讲', date: '2025-10-23', url: 'https://zyun.360.cn/aboutus#lists' },
  { title: '360牵头成立智能体生态联合体 开启产业协同发展新篇章', date: '2025-08-14', url: 'https://zyun.360.cn/aboutus#lists' },
];

// 解决方案数据
const solutions = [
  { title: '儿童手表音视频', tags: ['功耗低', '流畅稳定'], desc: '为儿童手表提供低功耗、流畅稳定、优质画质的音视频通话能力', url: 'https://zyun.360.cn/solution/solvechildwatch' },
  { title: '通用直播', tags: ['超低延时', '千万级并发'], desc: '提供超低延时、高清流畅、千万级并发的高清晰音视频直播方案', url: 'https://zyun.360.cn/solution/solvecommonlive' },
  { title: '短视频', tags: ['多功能集成', '一站式解决方案'], desc: '集拍摄、编辑、特效、合成、上传、存储、转码、分发、播放等功能于一体的一站式解决方案', url: 'https://zyun.360.cn/solution/solveshortvideo' },
  { title: '支付平台', tags: ['云上支付', '多重安全机制'], desc: '帮助商家快速搭建满足用户各种支付需求的支付平台', url: 'https://zyun.360.cn/solution/solvecollection' },
  { title: '360账号体系', tags: ['单点登录', '个性化配置'], desc: '专为360体系打造，体系内产品可通行。支持多种主流登录方式', url: 'https://zyun.360.cn/solution/solveusercenter' },
];

// 认证数据
const certifications = [
  { title: '网络安全等级保护认证', items: ['健全有效的网络安全保障体系', '防御系统被入侵和攻击', '保障用户信息安全'] },
  { title: '可信云认证', items: ['服务指标的完备性和规范性', '安全可信的云产品', '客户放心选购'] },
  { title: '中国认可产品', items: ['具备检测和校准的技术能力', '获得签署互认协议机构的承认', '列入获准认可机构名录'] },
  { title: 'ISO9001', items: ['完善的质量管理体系', '良好的质量信誉', '强大的企业竞争力'] },
  { title: 'ISO27001', items: ['保证信息的保密、完整和可用性', '符合相关法律法规', '承诺信息安全'] },
];

export default function ConsolePage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoverCategory, setHoverCategory] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginAccount, setLoginAccount] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 登录处理
  const handleLogin = () => {
    if (!loginAccount.trim()) {
      setLoginError('请输入账号');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('请输入密码');
      return;
    }
    if (!agreeTerms) {
      setLoginError('请先同意服务条款和隐私政策');
      return;
    }
    setUsername(loginAccount);
    setIsLoggedIn(true);
    setLoginDialogOpen(false);
    setLoginPassword('');
    setLoginError('');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', loginAccount);
  };

  // 退出登录
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  // 初始化时检查登录状态
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (storedLoggedIn === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // Banner轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 获取当前显示的产品列表
  const currentItems = hoverCategory >= 0 ? productCategories[hoverCategory].items : productCategories[activeCategory].items;

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/console" className="flex items-center">
                <div className="w-[90px] h-[32px] bg-[url('https://p1.ssl.qhimg.com/t01a8d3a5e2bd7d6071.png')] bg-contain bg-no-repeat" />
              </Link>

              {/* 导航菜单 */}
              <nav className="hidden lg:flex items-center ml-8">
                {/* 产品 */}
                <div 
                  className="relative"
                  onMouseEnter={() => setProductMenuOpen(true)}
                  onMouseLeave={() => { setProductMenuOpen(false); setHoverCategory(-1); }}
                >
                  <button className="flex items-center h-16 px-4 text-gray-700 hover:text-blue-600 font-medium">
                    产品
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  
                  {/* 下拉菜单 */}
                  {productMenuOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[820px] bg-white shadow-2xl rounded-lg border border-gray-100 overflow-hidden">
                      <div className="flex">
                        {/* 左侧分类 */}
                        <ul className="w-[160px] bg-gray-50 py-2">
                          {productCategories.map((cat, idx) => (
                            <li 
                              key={idx}
                              className={`flex items-center px-4 py-3 cursor-pointer text-sm transition-colors ${
                                hoverCategory === idx || (hoverCategory === -1 && activeCategory === idx)
                                  ? 'bg-white text-blue-600 border-l-2 border-blue-600' 
                                  : 'text-gray-700 hover:bg-white hover:text-blue-600'
                              }`}
                              onMouseEnter={() => setHoverCategory(idx)}
                              onClick={() => setActiveCategory(idx)}
                            >
                              {cat.name}
                            </li>
                          ))}
                        </ul>
                        
                        {/* 右侧产品列表 */}
                        <div className="flex-1 p-4 max-h-[450px] overflow-y-auto">
                          <div className="mb-3 text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100">
                            {productCategories[hoverCategory >= 0 ? hoverCategory : activeCategory].name}
                          </div>
                          <ul className="grid grid-cols-2 gap-x-4">
                            {currentItems.map((item, idx) => (
                              <li key={idx} className="py-3 border-b border-gray-50 last:border-0">
                                <Link href={item.url} className="group block">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {item.name}
                                    </span>
                                    {item.badge && (
                                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                                        item.badge === 'Hot' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                      }`}>
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 line-clamp-1">{item.desc}</p>
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
              {/* 控制台按钮 */}
              <Link 
                href="/enterprise" 
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
                控制台
              </Link>
              
              {/* 分隔线 */}
              <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1"></div>
              
              {isLoggedIn ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">
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
                        <Settings className="w-4 h-4" />
                        控制台
                      </Link>
                      <button 
                        onClick={handleLogout}
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
                  <button onClick={() => setLoginDialogOpen(true)}>
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
              
              {/* 移动端菜单按钮 */}
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
        <div className="relative h-[436px] bg-[#e7eff9] overflow-hidden">
          {/* 轮播 */}
          <div className="absolute inset-0">
            {bannerItems.map((item, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-500 ${currentBanner === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                style={{
                  backgroundImage: `url(${item.bgImage})`,
                  backgroundSize: 'auto 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="max-w-[1180px] mx-auto px-4 h-full flex items-center">
                  <div className="pt-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-3 leading-tight">{item.title}</h1>
                    {item.badge && (
                      <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm rounded mb-3">
                        {item.badge}
                      </span>
                    )}
                    <p className="text-xl text-gray-600 mb-8">{item.subtitle}</p>
                    <Link href={item.url}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-8">
                        了解详情
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 轮播指示器 */}
          <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center gap-3">
            {bannerItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`w-8 h-1 rounded transition-all ${currentBanner === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          {/* 新闻动态栏 */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm h-20 border-t border-gray-200">
            <div className="max-w-[1180px] mx-auto px-4 h-full flex items-center">
              <div className="flex items-center gap-6 overflow-hidden">
                <Link href="https://zyun.360.cn/aboutus" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 whitespace-nowrap shrink-0">
                  <span className="font-medium text-sm">查看全部</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <div className="flex gap-6 overflow-hidden">
                  {newsItems.map((news, idx) => (
                    <Link
                      key={idx}
                      href={news.url}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap"
                    >
                      <span className="text-gray-300">-</span>
                      <span>{news.title}</span>
                      <span className="text-gray-400">{news.date}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 解决方案 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1180px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">解决方案</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {solutions.map((solution, idx) => (
              <Link
                key={idx}
                href={solution.url}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {solution.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {solution.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{solution.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 安全认证 */}
      <section className="py-16 bg-white">
        <div className="max-w-[1180px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">安全认证</h2>
          <p className="text-gray-600 text-center mb-12">多重安全保障，为您的业务保驾护航</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{cert.title}</h3>
                <ul className="text-xs text-gray-500 space-y-1">
                  {cert.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://zyun.360.cn/product/apimarket" className="hover:text-white">API市场</Link></li>
                <li><Link href="https://zyun.360.cn/product/tlg" className="hover:text-white">大模型广场</Link></li>
                <li><Link href="https://zyun.360.cn/product/obs" className="hover:text-white">对象存储</Link></li>
                <li><Link href="https://zyun.360.cn/product/ecs" className="hover:text-white">云服务器</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">解决方案</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://zyun.360.cn/solution/solvecommonlive" className="hover:text-white">通用直播</Link></li>
                <li><Link href="https://zyun.360.cn/solution/solveshortvideo" className="hover:text-white">短视频</Link></li>
                <li><Link href="https://zyun.360.cn/solution/solvecollection" className="hover:text-white">支付平台</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://zyun.360.cn/help" className="hover:text-white">文档中心</Link></li>
                <li><Link href="https://zyun.360.cn/help/faq" className="hover:text-white">常见问题</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关于</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://zyun.360.cn/aboutus" className="hover:text-white">关于我们</Link></li>
                <li><Link href="https://zyun.360.cn/contact" className="hover:text-white">联系我们</Link></li>
              </ul>
            </div>
            <div className="col-span-2">
              <h4 className="font-semibold mb-4">联系我们</h4>
              <p className="text-sm text-gray-400">客服热线：400-669-3600</p>
              <p className="text-sm text-gray-400">工作时间：周一至周五 9:00-18:00</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2026 360智汇云. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 登录弹窗 */}
      {loginDialogOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLoginDialogOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[420px] max-w-[90vw] p-8">
            <button 
              onClick={() => setLoginDialogOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">登录</h3>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">账号</label>
                <input
                  type="text"
                  value={loginAccount}
                  onChange={(e) => setLoginAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入账号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                  我已阅读并同意
                  <Link href="#" className="text-blue-600 hover:underline">服务条款</Link>
                  和
                  <Link href="#" className="text-blue-600 hover:underline">隐私政策</Link>
                </label>
              </div>
              <Button 
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
              >
                登录
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
