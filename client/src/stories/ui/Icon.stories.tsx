import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/components/ui/Icon';
import {
  FileText,
  Layers,
  ListChecks,
  Code,
  User,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Info,
  TrendingUp,
  Calendar,
  Settings,
  Download,
  Upload,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const meta = {
  title: 'UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: FileText,
    size: 'md',
  },
};

// Different sizes
export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon={FileText} size="xs" />
      <Icon icon={FileText} size="sm" />
      <Icon icon={FileText} size="md" />
      <Icon icon={FileText} size="lg" />
      <Icon icon={FileText} size="xl" />
    </div>
  ),
};

// Document type icons
export const DocumentTypeIcons = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <Icon icon={FileText} size="lg" className="text-blue-600" />
        <span className="text-xs text-gray-600">BRD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Layers} size="lg" className="text-green-600" />
        <span className="text-xs text-gray-600">PRD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={ListChecks} size="lg" className="text-purple-600" />
        <span className="text-xs text-gray-600">Tasks</span>
      </div>
    </div>
  ),
};

// Mode icons
export const ModeIcons = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-2">
        <Icon icon={User} size="lg" className="text-gray-600" />
        <span className="text-xs text-gray-600">Plain Mode</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Code} size="lg" className="text-primary-600" />
        <span className="text-xs text-gray-600">Technical Mode</span>
      </div>
    </div>
  ),
};

// Action icons
export const ActionIcons = {
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Edit} size="md" />
        <span className="text-xs text-gray-600">Edit</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Download} size="md" />
        <span className="text-xs text-gray-600">Download</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Upload} size="md" />
        <span className="text-xs text-gray-600">Upload</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Trash2} size="md" />
        <span className="text-xs text-gray-600">Delete</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Settings} size="md" />
        <span className="text-xs text-gray-600">Settings</span>
      </div>
    </div>
  ),
};

// Status icons
export const StatusIcons = {
  render: () => (
    <div className="flex gap-6">
      <div className="flex items-center gap-2">
        <Icon icon={CheckCircle} size="md" className="text-green-600" />
        <span className="text-sm">Success</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={AlertCircle} size="md" className="text-red-600" />
        <span className="text-sm">Error</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={AlertTriangle} size="md" className="text-yellow-600" />
        <span className="text-sm">Warning</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={Info} size="md" className="text-blue-600" />
        <span className="text-sm">Info</span>
      </div>
    </div>
  ),
};

// Navigation icons
export const NavigationIcons = {
  render: () => (
    <div className="flex gap-4">
      <Icon icon={ChevronRight} size="md" />
      <Icon icon={Check} size="md" />
      <Icon icon={X} size="md" />
      <Icon icon={TrendingUp} size="md" />
      <Icon icon={Calendar} size="md" />
    </div>
  ),
};

// With colors
export const WithColors = {
  render: () => (
    <div className="flex gap-4">
      <Icon icon={FileText} size="lg" className="text-blue-600" />
      <Icon icon={FileText} size="lg" className="text-green-600" />
      <Icon icon={FileText} size="lg" className="text-red-600" />
      <Icon icon={FileText} size="lg" className="text-yellow-600" />
      <Icon icon={FileText} size="lg" className="text-purple-600" />
    </div>
  ),
};

// Dark mode support
export const DarkModeSupport = {
  render: () => (
    <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
      <Icon icon={FileText} size="lg" className="text-white" />
      <Icon icon={Layers} size="lg" className="text-gray-300" />
      <Icon icon={ListChecks} size="lg" className="text-gray-400" />
      <Icon icon={Code} size="lg" className="text-primary-400" />
    </div>
  ),
};

