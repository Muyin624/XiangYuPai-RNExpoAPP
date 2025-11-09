/**
 * PurchaseDetailPage - 类型定义（客户视角）
 */

import type { PurchaseStatus } from '../MyPurchasesPage/types';

// 购买订单详情
export interface PurchaseDetail {
  id: string;
  orderNo: string;
  status: PurchaseStatus;
  skillName: string;
  skillDesc: string;                  // 技能描述
  price: number;                      // 单价（金币）
  quantity: number;                   // 数量
  totalPrice: number;                 // 总价（金币）
  
  // 服务提供者信息
  providerInfo: {
    userId: string;
    nickname: string;
    avatar: string;
    gender: 1 | 2;                    // 1=男 2=女
    phone?: string;                   // 手机号（脱敏）
    wechat?: string;                  // 微信号
  };
  
  appointmentTime?: number;           // 预约时间
  createdAt: number;                  // 创建时间
  updatedAt: number;                  // 更新时间
  acceptedAt?: number;                // 接单时间
  startedAt?: number;                 // 开始时间
  completedAt?: number;               // 完成时间
  cancelledAt?: number;               // 取消时间
  cancelReason?: string;              // 取消原因
  rating?: number;                    // 评分（1-5）
  comment?: string;                   // 评价内容
  
  timeline: TimelineItem[];           // 订单时间轴
}

// 时间轴项
export interface TimelineItem {
  time: number;
  title: string;
  desc?: string;
}

