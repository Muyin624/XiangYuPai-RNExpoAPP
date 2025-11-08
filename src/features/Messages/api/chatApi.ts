/**
 * Chat API - 聊天接口
 * 
 * 处理私聊相关的API调用
 */

import { api } from '@/services/api/client';
import { API_ENDPOINTS, PAGINATION_CONFIG } from '../constants';
import type { ApiResponse, MessagesResponse } from '../types';
import {
    getMockMessagesResponse,
    simulateDelay,
} from './mockData';

// 开关：是否使用虚拟数据
const USE_MOCK_DATA = true;

/**
 * 聊天模块API接口
 */
export const chatApi = {
  /**
   * 获取聊天消息列表
   */
  getMessages: async (
    chatId: string,
    page: number = PAGINATION_CONFIG.INITIAL_PAGE
  ): Promise<MessagesResponse> => {
    try {
      // 使用虚拟数据
      if (USE_MOCK_DATA) {
        await simulateDelay(300);
        return getMockMessagesResponse(chatId);
      }

      const response = await api.get<MessagesResponse>(
        API_ENDPOINTS.MESSAGES(chatId),
        {
          params: {
            page,
            pageSize: PAGINATION_CONFIG.PAGE_SIZE,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('[chatApi] getMessages error:', error);
      throw error;
    }
  },

  /**
   * 发送消息
   */
  sendMessage: async (
    chatId: string,
    content: string
  ): Promise<ApiResponse> => {
    try {
      // 使用虚拟数据
      if (USE_MOCK_DATA) {
        await simulateDelay(500);
        return { success: true, message: '发送成功' };
      }

      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.SEND_MESSAGE(chatId),
        { content }
      );
      return response.data;
    } catch (error) {
      console.error('[chatApi] sendMessage error:', error);
      throw error;
    }
  },

  /**
   * 标记消息为已读
   */
  markMessagesAsRead: async (
    chatId: string,
    messageIds: string[]
  ): Promise<ApiResponse> => {
    try {
      // 使用虚拟数据
      if (USE_MOCK_DATA) {
        await simulateDelay(200);
        return { success: true, message: '标记成功' };
      }

      const response = await api.patch<ApiResponse>(
        API_ENDPOINTS.MARK_MESSAGES_READ(chatId),
        { messageIds }
      );
      return response.data;
    } catch (error) {
      console.error('[chatApi] markMessagesAsRead error:', error);
      throw error;
    }
  },
};
