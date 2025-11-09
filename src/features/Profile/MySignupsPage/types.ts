/**
 * MySignupsPage - 类型定义（报名客户视角）
 */

// 报名状态
export type SignupStatus = 
  | 'pending'      // 待确认
  | 'confirmed'    // 已确认（待参加）
  | 'completed'    // 已完成
  | 'cancelled';   // 已取消

// Tab类型
export type TabType = 'all' | SignupStatus;

// 报名信息
export interface Signup {
  id: string;
  signupNo: string;             // 报名编号
  status: SignupStatus;         // 报名状态
  activityName: string;         // 活动名称
  activityType: string;         // 活动类型（如：线下活动、培训课程等）
  companyInfo: {                // 公司信息
    companyId: string;
    companyName: string;
    companyLogo: string;
  };
  location: string;             // 活动地点
  activityTime: number;         // 活动时间
  signupTime: number;           // 报名时间
  confirmedAt?: number;         // 确认时间
  completedAt?: number;         // 完成时间
  cancelledAt?: number;         // 取消时间
  cancelReason?: string;        // 取消原因
  participantCount?: number;    // 参与人数
  maxParticipants?: number;     // 最大参与人数
}

// Tab配置
export interface TabConfig {
  key: TabType;
  label: string;
}

// 报名状态配置
export interface SignupStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  actions: Array<{
    label: string;
    type: 'default' | 'primary';
  }>;
}

