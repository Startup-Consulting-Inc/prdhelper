import { ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils/cn';

export interface Tab {
  value: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const Tabs = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
}: TabsProps) => {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue || tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      <TabsPrimitive.List
        className={cn(
          'flex items-center border-b border-gray-200 dark:border-gray-800',
          'overflow-x-auto'
        )}
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors',
              'border-b-2 border-transparent',
              'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'data-[state=active]:border-primary-600 data-[state=active]:text-primary-600',
              'dark:data-[state=active]:border-primary-500 dark:data-[state=active]:text-primary-500',
              '-mb-px'
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className="mt-4 focus:outline-none"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};

Tabs.displayName = 'Tabs';

export { Tabs };

