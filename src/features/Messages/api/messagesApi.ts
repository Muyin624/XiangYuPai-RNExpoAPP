/**
 * Messages API - 消息主接口
 * 
 * 基于现有homepageApi模式的简化设计
 * 只实现前端明确需要的接口，遵循YAGNI原则
 */

import { api } from '@/services/api/client';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, ConversationsResponse } from '../types';
import {
    getMockConversationsResponse,
    simulateDelay,
} from './mockData';

// 开关：是否使用虚拟数据
const USE_MOCK_DATA = true;

/**
 * 消息模块API接口
 */
export const messagesApi = {
  /**
   * 获取对话列表
   */
  getConversations: async (): Promise<ConversationsResponse> => {
    try {
      // 使用虚拟数据
      if (USE_MOCK_DATA) {
        await simulateDelay(300);
        return getMockConversationsResponse();
      }

      const response = await api.get<ConversationsResponse>(
        API_ENDPOINTS.CONVERSATIONS
      );
      return response.data;
    } catch (error) {
      console.error('[messagesApi] getConversations error:', error);
      throw error;
    }
  },

  /**
   * 标记对话为已读
   */
  markAsRead: async (conversationId: string): Promise<ApiResponse> => {
    try {
      // 使用虚拟数据
      if (USE_MOCK_DATA) {
        await simulateDelay(200);
        return { success: true, message: '标记成功' };
      }

      const response = await api.patch<ApiResponse>(
        API_ENDPOINTS.MARK_AS_READ(conversationId)
      );
      return response.data;
    } catch (error) {
      console.error('[messagesApi] markAsRead error:', error);
      throw error;
    }
  },

  /**
   * 删除对话
   */
  deleteConversation: async (conversationId: string): Promise<ApiResponse> => {
    try {
      // 使用虚拟数据
      if (USE_MOCK_DATA) {
        await simulateDelay(200);
        return { success: true, message: '删除成功' };
      }

      const response = await api.delete<ApiResponse>(
        API_ENDPOINTS.DELETE_CONVERSATION(conversationId)
      );
      return response.data;
    } catch (error) {
      console.error('[messagesApi] deleteConversation error:', error);
      throw error;
    }
  },

  /**
   * 获取未读消息计数
   */
  getUnreadCount: async (): Promise<{ count: number }> => {
    try {
      // 使用虚拟数据
      if (USE_MOCK_DATA) {
        await simulateDelay(200);
        const mockData = getMockConversationsResponse();
        const count = mockData.conversations.reduce(
          (sum, conv) => sum + (conv.isRead ? 0 : conv.unreadCount),
          0
        );
        return { count };
      }

      const response = await api.get<{ count: number }>(
        API_ENDPOINTS.UNREAD_COUNT
      );
      return response.data;
    } catch (error) {
      console.error('[messagesApi] getUnreadCount error:', error);
      throw error;
    }
  },
};
