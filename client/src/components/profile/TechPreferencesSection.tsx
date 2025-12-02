import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { ComboBox } from '@/components/ui/ComboBox';
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
        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Core Stack
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <ComboBox
              label="Frontend"
              tooltipContent={TECH_GUIDANCE.frontend?.description}
              value={techPreferences.frontend || ''}
              onChange={(val) => onChange('frontend', val)}
              options={TECH_OPTIONS.frontend}
              placeholder="Select or type..."
              helperText="e.g., React (Vite), Vue.js, Angular"
            />
            <button
              onClick={() => setGuideCategory('frontend')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
          <div className="space-y-1">
            <ComboBox
              label="Backend"
              tooltipContent={TECH_GUIDANCE.backend?.description}
              value={techPreferences.backend || ''}
              onChange={(val) => onChange('backend', val)}
              options={TECH_OPTIONS.backend}
              placeholder="Select or type..."
              helperText="e.g., Node.js (Express), Python (FastAPI)"
            />
            <button
              onClick={() => setGuideCategory('backend')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
          <div className="space-y-1">
            <ComboBox
              label="Database"
              tooltipContent={TECH_GUIDANCE.database?.description}
              value={techPreferences.database || ''}
              onChange={(val) => onChange('database', val)}
              options={TECH_OPTIONS.database}
              placeholder="Select or type..."
              helperText="e.g., Google Cloud Firestore, PostgreSQL"
            />
            <button
              onClick={() => setGuideCategory('database')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
          <div className="space-y-1">
            <ComboBox
              label="Authentication"
              tooltipContent={TECH_GUIDANCE.authentication?.description}
              value={techPreferences.authentication || ''}
              onChange={(val) => onChange('authentication', val)}
              options={TECH_OPTIONS.authentication}
              placeholder="Select or type..."
              helperText="e.g., Firebase Authentication, Auth0"
            />
            <button
              onClick={() => setGuideCategory('authentication')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Group 2: Infrastructure */}
      <div>
        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Infrastructure
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <ComboBox
              label="Cloud Platform"
              tooltipContent={TECH_GUIDANCE.cloudPlatform?.description}
              value={techPreferences.cloudPlatform || ''}
              onChange={(val) => onChange('cloudPlatform', val)}
              options={TECH_OPTIONS.cloudPlatform}
              placeholder="Select or type..."
              helperText="e.g., Google Cloud Platform (GCP), AWS"
            />
            <button
              onClick={() => setGuideCategory('cloudPlatform')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
          <div className="space-y-1">
            <ComboBox
              label="Infrastructure Build"
              tooltipContent={TECH_GUIDANCE.infrastructureBuild?.description}
              value={techPreferences.infrastructureBuild || ''}
              onChange={(val) => onChange('infrastructureBuild', val)}
              options={TECH_OPTIONS.infrastructureBuild}
              placeholder="Select or type..."
              helperText="e.g., Terraform, AWS CloudFormation"
            />
            <button
              onClick={() => setGuideCategory('infrastructureBuild')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
          <div className="space-y-1">
            <ComboBox
              label="Deployment"
              tooltipContent={TECH_GUIDANCE.deployment?.description}
              value={techPreferences.deployment || ''}
              onChange={(val) => onChange('deployment', val)}
              options={TECH_OPTIONS.deployment}
              placeholder="Select or type..."
              helperText="e.g., Cloud Run, Kubernetes"
            />
            <button
              onClick={() => setGuideCategory('deployment')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
          <div className="space-y-1">
            <ComboBox
              label="Containerization"
              tooltipContent={TECH_GUIDANCE.containerization?.description}
              value={techPreferences.containerization || ''}
              onChange={(val) => onChange('containerization', val)}
              options={TECH_OPTIONS.containerization}
              placeholder="Select or type..."
              helperText="e.g., Docker, Podman"
            />
            <button
              onClick={() => setGuideCategory('containerization')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
          <div className="space-y-1">
            <ComboBox
              label="Secret Management"
              tooltipContent={TECH_GUIDANCE.secretManagement?.description}
              value={techPreferences.secretManagement || ''}
              onChange={(val) => onChange('secretManagement', val)}
              options={TECH_OPTIONS.secretManagement}
              placeholder="Select or type..."
              helperText="e.g., Google Secret Manager, HashiCorp Vault"
            />
            <button
              onClick={() => setGuideCategory('secretManagement')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Group 3: AI/ML */}
      <div>
        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          AI/ML
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <ComboBox
              label="AI/LLM Model"
              tooltipContent={TECH_GUIDANCE.aiLlmModel?.description}
              value={techPreferences.aiLlmModel || ''}
              onChange={(val) => onChange('aiLlmModel', val)}
              options={TECH_OPTIONS.aiLlmModel}
              placeholder="Select or type..."
              helperText="e.g., OpenRouter, OpenAI, Anthropic Claude"
            />
            <button
              onClick={() => setGuideCategory('aiLlmModel')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
          <div className="space-y-1">
            <ComboBox
              label="AI Agentic Framework"
              tooltipContent={TECH_GUIDANCE.aiAgenticFramework?.description}
              value={techPreferences.aiAgenticFramework || ''}
              onChange={(val) => onChange('aiAgenticFramework', val)}
              options={TECH_OPTIONS.aiAgenticFramework}
              placeholder="Select or type..."
              helperText="e.g., LangChain, LlamaIndex, AutoGen"
            />
            <button
              onClick={() => setGuideCategory('aiAgenticFramework')}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Learn More
            </button>
          </div>
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
