import { ComboBox } from '@/components/ui/ComboBox';
import { TechPreferences, TECH_OPTIONS } from '@shared/types.js';

interface TechPreferencesSectionProps {
  techPreferences: TechPreferences;
  onChange: (field: keyof TechPreferences, value: string) => void;
}

export function TechPreferencesSection({
  techPreferences,
  onChange,
}: TechPreferencesSectionProps) {
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
          <ComboBox
            label="Frontend"
            value={techPreferences.frontend || ''}
            onChange={(val) => onChange('frontend', val)}
            options={TECH_OPTIONS.frontend}
            placeholder="Select or type..."
            helperText="e.g., React (Vite), Vue.js, Angular"
          />
          <ComboBox
            label="Backend"
            value={techPreferences.backend || ''}
            onChange={(val) => onChange('backend', val)}
            options={TECH_OPTIONS.backend}
            placeholder="Select or type..."
            helperText="e.g., Node.js (Express), Python (FastAPI)"
          />
          <ComboBox
            label="Database"
            value={techPreferences.database || ''}
            onChange={(val) => onChange('database', val)}
            options={TECH_OPTIONS.database}
            placeholder="Select or type..."
            helperText="e.g., Google Cloud Firestore, PostgreSQL"
          />
          <ComboBox
            label="Authentication"
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
        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Infrastructure
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComboBox
            label="Cloud Platform"
            value={techPreferences.cloudPlatform || ''}
            onChange={(val) => onChange('cloudPlatform', val)}
            options={TECH_OPTIONS.cloudPlatform}
            placeholder="Select or type..."
            helperText="e.g., Google Cloud Platform (GCP), AWS"
          />
          <ComboBox
            label="Infrastructure Build"
            value={techPreferences.infrastructureBuild || ''}
            onChange={(val) => onChange('infrastructureBuild', val)}
            options={TECH_OPTIONS.infrastructureBuild}
            placeholder="Select or type..."
            helperText="e.g., Terraform, AWS CloudFormation"
          />
          <ComboBox
            label="Deployment"
            value={techPreferences.deployment || ''}
            onChange={(val) => onChange('deployment', val)}
            options={TECH_OPTIONS.deployment}
            placeholder="Select or type..."
            helperText="e.g., Cloud Run, Kubernetes"
          />
          <ComboBox
            label="Containerization"
            value={techPreferences.containerization || ''}
            onChange={(val) => onChange('containerization', val)}
            options={TECH_OPTIONS.containerization}
            placeholder="Select or type..."
            helperText="e.g., Docker, Podman"
          />
          <ComboBox
            label="Secret Management"
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
        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          AI/ML
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComboBox
            label="AI/LLM Model"
            value={techPreferences.aiLlmModel || ''}
            onChange={(val) => onChange('aiLlmModel', val)}
            options={TECH_OPTIONS.aiLlmModel}
            placeholder="Select or type..."
            helperText="e.g., OpenRouter, OpenAI, Anthropic Claude"
          />
          <ComboBox
            label="AI Agentic Framework"
            value={techPreferences.aiAgenticFramework || ''}
            onChange={(val) => onChange('aiAgenticFramework', val)}
            options={TECH_OPTIONS.aiAgenticFramework}
            placeholder="Select or type..."
            helperText="e.g., LangChain, LlamaIndex, AutoGen"
          />
        </div>
      </div>
    </div>
  );
}
