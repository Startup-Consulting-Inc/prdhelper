import type { Meta } from '@storybook/react';
import { OptionCard } from '@/components/common/OptionCard';
import { User, Code, FileText, Layers, ListChecks } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Common/OptionCard',
  component: OptionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OptionCard>;

export default meta;

export const Default = {
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <OptionCard
        title="Option Title"
        description="This is a description of the option"
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    );
  },
};

export const Selected = {
  render: () => (
    <OptionCard
      title="Selected Option"
      description="This option is currently selected"
      selected={true}
      onClick={() => {}}
    />
  ),
};

export const WithIcon = {
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <OptionCard
        title="Plain Mode"
        description="Simple language for non-technical stakeholders"
        icon={User}
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    );
  },
};

export const WithoutDescription = {
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <OptionCard
        title="Quick Option"
        icon={Code}
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    );
  },
};

export const LongText = {
  render: () => {
    const [selected, setSelected] = useState(false);
    return (
      <OptionCard
        title="Option with Very Long Title That Might Wrap to Multiple Lines"
        description="This is a very long description that explains the option in great detail. It should wrap nicely and maintain good readability even with multiple lines of text."
        icon={FileText}
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    );
  },
};

// Mode Selection Use Case
export const ModeSelection = {
  render: () => {
    const [mode, setMode] = useState<string>('');
    return (
      <div className="space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold">Choose Your Documentation Mode</h3>
        <div className="grid gap-3">
          <OptionCard
            title="Plain Mode"
            description="Uses simple, easy-to-understand language. Perfect for stakeholders without technical background."
            icon={User}
            selected={mode === 'plain'}
            onClick={() => setMode('plain')}
          />
          <OptionCard
            title="Technical Mode"
            description="Includes detailed technical specifications and terminology. Ideal for development teams."
            icon={Code}
            selected={mode === 'technical'}
            onClick={() => setMode('technical')}
          />
        </div>
      </div>
    );
  },
};

// Document Type Selection
export const DocumentTypeSelection = {
  render: () => {
    const [docType, setDocType] = useState<string>('');
    return (
      <div className="space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold">Select Document Type</h3>
        <div className="grid gap-3">
          <OptionCard
            title="Business Requirements Document (BRD)"
            description="Define business goals, requirements, and success criteria"
            icon={FileText}
            selected={docType === 'brd'}
            onClick={() => setDocType('brd')}
          />
          <OptionCard
            title="Product Requirements Document (PRD)"
            description="Detail product features, specifications, and user stories"
            icon={Layers}
            selected={docType === 'prd'}
            onClick={() => setDocType('prd')}
          />
          <OptionCard
            title="Technical Task List"
            description="Break down work into actionable development tasks"
            icon={ListChecks}
            selected={docType === 'tasks'}
            onClick={() => setDocType('tasks')}
          />
        </div>
      </div>
    );
  },
};

// Wizard Question Use Case
export const WizardQuestion = {
  render: () => {
    const [answer, setAnswer] = useState<string>('');
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">What is the primary goal of your project?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select the option that best describes your project's main objective.
          </p>
        </div>
        <div className="grid gap-3">
          <OptionCard
            title="Improve an existing product"
            description="Enhance features, fix issues, or optimize performance"
            selected={answer === 'improve'}
            onClick={() => setAnswer('improve')}
          />
          <OptionCard
            title="Build a new product from scratch"
            description="Create a brand new application or service"
            selected={answer === 'new'}
            onClick={() => setAnswer('new')}
          />
          <OptionCard
            title="Replace a legacy system"
            description="Modernize and migrate from an old solution"
            selected={answer === 'replace'}
            onClick={() => setAnswer('replace')}
          />
        </div>
      </div>
    );
  },
};

// Accessibility Demo
export const AccessibilityDemo = {
  render: () => {
    const [selected, setSelected] = useState<string>('');
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          OptionCard is fully keyboard accessible with proper focus states:
        </p>
        <div className="grid gap-3 max-w-xl">
          <OptionCard
            title="Keyboard Accessible"
            description="Use Tab to focus, Enter or Space to select"
            selected={selected === 'keyboard'}
            onClick={() => setSelected('keyboard')}
          />
          <OptionCard
            title="Screen Reader Friendly"
            description="Button role with clear label and state"
            selected={selected === 'sr'}
            onClick={() => setSelected('sr')}
          />
        </div>
      </div>
    );
  },
};

