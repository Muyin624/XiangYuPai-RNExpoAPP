/**
 * SignupDetailPage - 类型定义（报名详情）
 */

import type { SignupStatus } from '../MySignupsPage/types';

// 报名详情
export interface SignupDetail {
  id: string;
  signupNo: string;
  status: SignupStatus;
  activityName: string;
  activityDesc: string;            // 活动描述
  activityType: string;            // 活动类型
  
  // 公司信息
  companyInfo: {
    companyId: string;
    companyName: string;
    companyLogo: string;
    contactPhone?: string;         // 联系电话
    contactEmail?: string;         // 联系邮箱
  };
  
  location: string;                // 活动地点
  detailedAddress: string;         // 详细地址
  activityTime: number;            // 活动时间
  duration: number;                // 活动时长（分钟）
  
  signupTime: number;              // 报名时间
  confirmedAt?: number;            // 确认时间
  completedAt?: number;            // 完成时间
  cancelledAt?: number;            // 取消时间
  cancelReason?: string;           // 取消原因
  
  isCheckedIn?: boolean;           // 是否已签到
  checkedInAt?: number;            // 签到时间
  
  participantCount: number;        // 参与人数
  maxParticipants: number;         // 最大参与人数
  
  requirements?: string;           // 参与要求
  notes?: string;                  // 注意事项
  
  rating?: number;                 // 评分（1-5）
  comment?: string;                // 评价内容
  
  timeline: TimelineItem[];        // 时间轴
}

// 时间轴项
export interface TimelineItem {
  time: number;
  title: string;
  desc?: string;
}

