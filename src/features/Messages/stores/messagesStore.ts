/**
 * Messages Store - 消息主状态管理
 * 
 * 基于现有homepageStore模式的简化设计
 * 管理对话列表和未读消息计数
 */

import { createSafeStorage } from '@/stores/storage-config';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { messagesApi } from '../api';
import { ERROR_MESSAGES } from '../constants';
import type { MessagesState } from '../types';

/**
 * 消息Store
 */
export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      // ============================================
      // 状态
      // ============================================
      conversations: [],
      unreadCount: 0,
      categoryUnreadCounts: {
        likes: 0,
        comments: 0,
        followers: 0,
        notifications: 0,
      },
      loading: false,
      error: null,

      // ============================================
      // Actions
      // ============================================

      /**
       * 加载对话列表
       */
      loadConversations: async () => {
        set({ loading: true, error: null });
        
        try {
          const response = await messagesApi.getConversations();
          const conversations = response.conversations || [];
          
          // 计算未读消息总数
          const unreadCount = conversations.reduce(
            (sum, conv) => sum + (conv.isRead ? 0 : conv.unreadCount),
            0
          );
          
          set({
            conversations,
            unreadCount,
            loading: false,
          });
        } catch (error) {
          console.error('[messagesStore] loadConversations error:', error);
          set({
            error: ERROR_MESSAGES.LOAD_CONVERSATIONS_FAILED,
            loading: false,
          });
          throw error;
        }
      },

      /**
       * 标记对话为已读
       */
      markAsRead: (conversationId: string) => {
        const { conversations } = get();
        
        // 乐观更新UI
        const updatedConversations = conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, isRead: true, unreadCount: 0 }
            : conv
        );
        
        // 重新计算未读总数
        const unreadCount = updatedConversations.reduce(
          (sum, conv) => sum + (conv.isRead ? 0 : conv.unreadCount),
          0
        );
        
        set({ conversations: updatedConversations, unreadCount });
        
        // 后台调用API
        messagesApi.markAsRead(conversationId).catch(error => {
          console.error('[messagesStore] markAsRead error:', error);
          // 如果失败，回滚状态
          set({ conversations });
        });
      },

      /**
       * 删除对话
       */
      deleteConversation: (conversationId: string) => {
        const { conversations } = get();
        
        // 乐观更新UI
        const updatedConversations = conversations.filter(
          conv => conv.id !== conversationId
        );
        
        // 重新计算未读总数
        const unreadCount = updatedConversations.reduce(
          (sum, conv) => sum + (conv.isRead ? 0 : conv.unreadCount),
          0
        );
        
        set({ conversations: updatedConversations, unreadCount });
        
        // 后台调用API
        messagesApi.deleteConversation(conversationId).catch(error => {
          console.error('[messagesStore] deleteConversation error:', error);
          // 如果失败，回滚状态
          set({ conversations });
        });
      },

      /**
       * 加载分类未读计数
       */
      loadCategoryUnreadCounts: async () => {
        try {
          // 使用虚拟数据计算各分类未读数
          const { getMockCategoryUnreadCounts } = await import('../api/mockData');
          const categoryUnreadCounts = getMockCategoryUnreadCounts();
          
          set({ categoryUnreadCounts });
        } catch (error) {
          console.error('[messagesStore] loadCategoryUnreadCounts error:', error);
        }
      },

      /**
       * 刷新对话列表
       */
      refreshConversations: async () => {
        // 刷新时不显示loading，避免闪烁
        try {
          const response = await messagesApi.getConversations();
          const conversations = response.conversations || [];
          
          // 计算未读消息总数
          const unreadCount = conversations.reduce(
            (sum, conv) => sum + (conv.isRead ? 0 : conv.unreadCount),
            0
          );
          
          set({ conversations, unreadCount });
        } catch (error) {
          console.error('[messagesStore] refreshConversations error:', error);
          // 刷新失败不显示错误，静默失败
        }
      },

      /**
       * 清空所有对话
       */
      clearAllConversations: () => {
        set({
          conversations: [],
          unreadCount: 0,
        });
      },
      }),
      {
        name: 'messages-storage',
        storage: createSafeStorage(),
        partialize: (state) => ({
          conversations: state.conversations,
          unreadCount: state.unreadCount,
          categoryUnreadCounts: state.categoryUnreadCounts,
        }),
      }
    )
  );


// ============================================
// 选择器导出 (Selector Exports)
// ============================================

/**
 * 获取对话列表
 */
export const useConversations = () => useMessagesStore(state => state.conversations);

/**
 * 获取未读消息总数
 */
export const useUnreadCount = () => useMessagesStore(state => state.unreadCount);

/**
 * 获取分类未读计数
 */
export const useCategoryUnreadCounts = () => useMessagesStore(state => state.categoryUnreadCounts);

/**
 * 获取消息加载状态
 */
export const useMessagesLoading = () => useMessagesStore(state => state.loading);

/**
 * 获取消息错误信息
 */
export const useMessagesError = () => useMessagesStore(state => state.error);
