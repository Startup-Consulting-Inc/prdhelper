import { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SettingSection {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
}

export interface SettingsPanelProps {
  sections: SettingSection[];
  onSave?: () => void;
  isSaving?: boolean;
  className?: string;
}

const SettingsPanel = ({
  sections,
  onSave,
  isSaving = false,
  className,
}: SettingsPanelProps) => {
  return (
    <div className={cn('space-y-6', className)}>
      {sections.map((section) => (
        <div
          key={section.id}
          className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {section.title}
            </h3>
            {section.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {section.description}
              </p>
            )}
          </div>
          <div className="p-6">{section.content}</div>
        </div>
      ))}

      {onSave && (
        <div className="flex justify-end">
          <Button
            onClick={onSave}
            isLoading={isSaving}
            disabled={isSaving}
            iconLeft={<Save className="h-4 w-4" />}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
};

SettingsPanel.displayName = 'SettingsPanel';

export { SettingsPanel };

