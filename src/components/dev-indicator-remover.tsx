'use client';

import { useEffect } from 'react';

export function DevIndicatorRemover() {
  useEffect(() => {
    // 移除 Next.js 开发指示器
    const removeIndicator = () => {
      // 移除 next-dev-indicator 元素
      const indicators = document.querySelectorAll(
        'next-dev-indicator, [data-nextjs-dialog], #__next-build-indicator, #__next-prerender-indicator, nextjs-portal'
      );
      indicators.forEach((el) => el.remove());

      // 移除 Shadow DOM 中的指示器
      const shadowHosts = document.querySelectorAll('*');
      shadowHosts.forEach((el) => {
        if (el.shadowRoot) {
          const shadowIndicators = el.shadowRoot.querySelectorAll(
            'next-dev-indicator, [data-nextjs-dialog], nextjs-portal'
          );
          shadowIndicators.forEach((shadowEl) => shadowEl.remove());
        }
      });
    };

    // 立即执行一次
    removeIndicator();

    // 使用 MutationObserver 持续监听并移除
    const observer = new MutationObserver(() => {
      removeIndicator();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 清理
    return () => observer.disconnect();
  }, []);

  return null;
}
