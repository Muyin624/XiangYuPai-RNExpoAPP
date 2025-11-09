/**
 * Publish Event Screen - 发布组局页面路由适配器
 */

import { ErrorBoundary } from '@/src/components';
import PublishEventPage from '@/src/features/Homepage/EventFlow/PublishEventPage';
import React from 'react';

export default function PublishEventScreen() {
  return (
    <ErrorBoundary>
      <PublishEventPage />
    </ErrorBoundary>
  );
}

