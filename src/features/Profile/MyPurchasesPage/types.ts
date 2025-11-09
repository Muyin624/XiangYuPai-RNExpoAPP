/**
 * MyPurchasesPage - 类型定义（客户视角）
 */

// 订单状态
export type PurchaseStatus = 
  | 'pending'      // 待接单
  | 'accepted'     // 已接单（待开始）
  | 'in_progress'  // 进行中
  | 'completed'    // 已完成
  | 'cancelled';   // 已取消

// Tab类型
export type TabType = 'all' | PurchaseStatus;

// 购买订单信息
export interface Purchase {
  id: string;
  orderNo: string;              // 订单号
  status: PurchaseStatus;       // 订单状态
  skillName: string;            // 技能名称
  price: number;                // 单价（金币）
  quantity: number;             // 数量
  totalPrice: number;           // 总价（金币）
  providerInfo: {               // 服务提供者信息
    userId: string;
    nickname: string;
    avatar: string;
    gender: 1 | 2;              // 1=男 2=女
  };
  createdAt: number;            // 创建时间
  updatedAt: number;            // 更新时间
  acceptedAt?: number;          // 接单时间
  startedAt?: number;           // 开始时间
  completedAt?: number;         // 完成时间
  cancelledAt?: number;         // 取消时间
  cancelReason?: string;        // 取消原因
  rating?: number;              // 评分（1-5）
  comment?: string;             // 评价内容
}

// Tab配置
export interface TabConfig {
  key: TabType;
  label: string;
}

// 订单状态配置
export interface PurchaseStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  actions: Array<{
    label: string;
    type: 'default' | 'primary';
  }>;
}

