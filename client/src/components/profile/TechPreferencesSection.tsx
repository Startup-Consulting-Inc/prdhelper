import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { ComboBox } from '@/components/ui/ComboBox';
import { Button } from '@/components/ui/Button';
import { TechPreferences, TECH_OPTIONS } from '@shared/types.js';
import { TechGuideDialog } from './TechGuideDialog';
import { TECH_GUIDANCE } from '@/data/techGuidance';

interface TechPreferencesSectionProps {
  techPreferences: TechPreferences;
  onChange: (field: keyof TechPreferences, value: string) => void;
}

export function TechPreferencesSection({
  techPreferences,
  onChange,
}: TechPreferencesSectionProps) {
  const [guideCategory, setGuideCategory] = useState<keyof typeof TECH_GUIDANCE | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Development Preferences
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Specify your preferred technologies to tailor AI-generated documents
        </p>
      </div>

      {/* Group 1: Core Stack */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Core Stack
          </h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGuideCategory('frontend')}
            className="h-8"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" />
            Learn More
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComboBox
            label="Frontend"
            tooltipContent={TECH_GUIDANCE.frontend?.description}
            value={techPreferences.frontend || ''}
            onChange={(val) => onChange('frontend', val)}
            options={TECH_OPTIONS.frontend}
            placeholder="Select or type..."
            helperText="e.g., React (Vite), Vue.js, Angular"
          />
          <ComboBox
            label="Backend"
            tooltipContent={TECH_GUIDANCE.backend?.description}
            value={techPreferences.backend || ''}
            onChange={(val) => onChange('backend', val)}
            options={TECH_OPTIONS.backend}
            placeholder="Select or type..."
            helperText="e.g., Node.js (Express), Python (FastAPI)"
          />
          <ComboBox
            label="Database"
            tooltipContent={TECH_GUIDANCE.database?.description}
            value={techPreferences.database || ''}
            onChange={(val) => onChange('database', val)}
            options={TECH_OPTIONS.database}
            placeholder="Select or type..."
            helperText="e.g., Google Cloud Firestore, PostgreSQL"
          />
          <ComboBox
            label="Authentication"
            tooltipContent={TECH_GUIDANCE.authentication?.description}
            value={techPreferences.authentication || ''}
            onChange={(val) => onChange('authentication', val)}
            options={TECH_OPTIONS.authentication}
            placeholder="Select or type..."
            helperText="e.g., Firebase Authentication, Auth0"
          />
        </div>
      </div>

      {/* Group 2: Infrastructure */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Infrastructure
          </h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGuideCategory('cloudPlatform')}
            className="h-8"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" />
            Learn More
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComboBox
            label="Cloud Platform"
            tooltipContent={TECH_GUIDANCE.cloudPlatform?.description}
            value={techPreferences.cloudPlatform || ''}
            onChange={(val) => onChange('cloudPlatform', val)}
            options={TECH_OPTIONS.cloudPlatform}
            placeholder="Select or type..."
            helperText="e.g., Google Cloud Platform (GCP), AWS"
          />
          <ComboBox
            label="Infrastructure Build"
            tooltipContent={TECH_GUIDANCE.infrastructureBuild?.description}
            value={techPreferences.infrastructureBuild || ''}
            onChange={(val) => onChange('infrastructureBuild', val)}
            options={TECH_OPTIONS.infrastructureBuild}
            placeholder="Select or type..."
            helperText="e.g., Terraform, AWS CloudFormation"
          />
          <ComboBox
            label="Deployment"
            tooltipContent={TECH_GUIDANCE.deployment?.description}
            value={techPreferences.deployment || ''}
            onChange={(val) => onChange('deployment', val)}
            options={TECH_OPTIONS.deployment}
            placeholder="Select or type..."
            helperText="e.g., Cloud Run, Kubernetes"
          />
          <ComboBox
            label="Containerization"
            tooltipContent={TECH_GUIDANCE.containerization?.description}
            value={techPreferences.containerization || ''}
            onChange={(val) => onChange('containerization', val)}
            options={TECH_OPTIONS.containerization}
            placeholder="Select or type..."
            helperText="e.g., Docker, Podman"
          />
          <ComboBox
            label="Secret Management"
            tooltipContent={TECH_GUIDANCE.secretManagement?.description}
            value={techPreferences.secretManagement || ''}
            onChange={(val) => onChange('secretManagement', val)}
            options={TECH_OPTIONS.secretManagement}
            placeholder="Select or type..."
            helperText="e.g., Google Secret Manager, HashiCorp Vault"
          />
        </div>
      </div>

      {/* Group 3: AI/ML */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            AI/ML
          </h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGuideCategory('aiLlmModel')}
            className="h-8"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" />
            Learn More
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComboBox
            label="AI/LLM Model"
            tooltipContent={TECH_GUIDANCE.aiLlmModel?.description}
            value={techPreferences.aiLlmModel || ''}
            onChange={(val) => onChange('aiLlmModel', val)}
            options={TECH_OPTIONS.aiLlmModel}
            placeholder="Select or type..."
            helperText="e.g., OpenRouter, OpenAI, Anthropic Claude"
          />
          <ComboBox
            label="AI Agentic Framework"
            tooltipContent={TECH_GUIDANCE.aiAgenticFramework?.description}
            value={techPreferences.aiAgenticFramework || ''}
            onChange={(val) => onChange('aiAgenticFramework', val)}
            options={TECH_OPTIONS.aiAgenticFramework}
            placeholder="Select or type..."
            helperText="e.g., LangChain, LlamaIndex, AutoGen"
          />
        </div>
      </div>

      {/* Tech Guide Dialog */}
      <TechGuideDialog
        open={guideCategory !== null}
        onOpenChange={(open) => !open && setGuideCategory(null)}
        category={guideCategory}
      />
    </div>
  );
}
