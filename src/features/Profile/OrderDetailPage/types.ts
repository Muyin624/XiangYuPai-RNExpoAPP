/**
 * OrderDetailPage - 类型定义
 */

// 订单状态
export type OrderStatus = 
  | 'pending'      // 待接单
  | 'accepted'     // 已接单（待开始）
  | 'in_progress'  // 进行中
  | 'completed'    // 已完成
  | 'cancelled';   // 已取消

// 订单详情
export interface OrderDetail {
  id: string;
  orderNo: string;                    // 订单号
  status: OrderStatus;                // 订单状态
  skillName: string;                  // 技能名称
  skillDesc: string;                  // 技能描述
  price: number;                      // 单价（金币）
  quantity: number;                   // 数量
  totalPrice: number;                 // 总价（金币）
  
  // 客户信息（下单的人）
  customerInfo: {
    userId: string;
    nickname: string;
    avatar: string;
    gender: 1 | 2;                    // 1=男 2=女
    phone?: string;                   // 手机号（脱敏）
    wechat?: string;                  // 微信号
  };
  
  // 时间信息
  appointmentTime: number;            // 预约时间
  createdAt: number;                  // 创建时间
  updatedAt: number;                  // 更新时间
  acceptedAt?: number;                // 接单时间
  startedAt?: number;                 // 开始时间
  completedAt?: number;               // 完成时间
  cancelledAt?: number;               // 取消时间
  
  // 取消信息
  cancelReason?: string;              // 取消原因
  cancelledBy?: 'customer' | 'provider' | 'system'; // 取消方
  
  // 评价信息
  rating?: number;                    // 评分（1-5）
  comment?: string;                   // 评价内容
  ratedAt?: number;                   // 评价时间
  
  // 订单时间轴
  timeline: Array<{
    time: number;
    title: string;
    desc: string;
  }>;
}

// 订单状态配置
export interface OrderStatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

