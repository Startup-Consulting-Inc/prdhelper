import type { Meta, StoryObj } from '@storybook/react';
import { Check, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

// All variants
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

// With icons
export const WithIconLeft: Story = {
  args: {
    children: 'Download',
    iconLeft: <Download className="h-4 w-4" />,
  },
};

export const WithIconRight: Story = {
  args: {
    children: 'Continue',
    iconRight: <ChevronRight className="h-4 w-4" />,
  },
};

export const IconOnly: Story = {
  args: {
    iconLeft: <Check className="h-4 w-4" />,
    'aria-label': 'Confirm',
  },
};

// States
export const Loading: Story = {
  args: {
    children: 'Loading',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const LoadingWithIcon: Story = {
  args: {
    children: 'Processing',
    isLoading: true,
  },
};

// Long text wrap
export const LongText: Story = {
  args: {
    children: 'This is a button with very long text that should wrap properly',
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button>Keyboard accessible (Tab to focus)</Button>
      <Button iconLeft={<Check className="h-4 w-4" />} aria-label="Confirm action">
        With aria-label
      </Button>
      <Button disabled>Disabled state prevents interaction</Button>
    </div>
  ),
};

