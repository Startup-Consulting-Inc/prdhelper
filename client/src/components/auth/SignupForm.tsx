import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { RadioGroup } from '../common/RadioGroup';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    modePreference: z.enum(['plain', 'technical']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  error?: string;
  isLoading?: boolean;
}

const SignupForm = ({ onSubmit, error, isLoading = false }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');
  const modePreference = watch('modePreference');

  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const onSubmitHandler = async (data: SignupFormData) => {
    await onSubmit(data);
  };

  const modeOptions = [
    {
      value: 'plain',
      label: 'Plain Mode',
      description: 'For non-technical stakeholders and business users',
    },
    {
      value: 'technical',
      label: 'Technical Mode',
      description: 'For developers and technical teams with detailed task lists',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {error && (
        <Alert variant="error" title="Sign Up Failed">
          {error}
        </Alert>
      )}

      <div>
        <Input
          {...register('name')}
          type="text"
          label="Full Name"
          placeholder="John Doe"
          errorText={errors.name?.message}
          disabled={isLoading}
          autoComplete="name"
        />
      </div>

      <div>
        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="you@example.com"
          errorText={errors.email?.message}
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div>
        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="••••••••"
            errorText={errors.password?.message}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {password && (
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Password strength:
            </p>
            <div className="space-y-1 text-xs">
              <PasswordRequirement
                met={passwordStrength.hasMinLength}
                text="At least 8 characters"
              />
              <PasswordRequirement
                met={passwordStrength.hasUppercase}
                text="One uppercase letter"
              />
              <PasswordRequirement
                met={passwordStrength.hasLowercase}
                text="One lowercase letter"
              />
              <PasswordRequirement met={passwordStrength.hasNumber} text="One number" />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="relative">
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="••••••••"
            errorText={errors.confirmPassword?.message}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <RadioGroup
          label="Mode Preference"
          options={modeOptions}
          value={modePreference}
          onValueChange={(value) => setValue('modePreference', value as 'plain' | 'technical')}
        />
        {errors.modePreference && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {errors.modePreference.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

const PasswordRequirement = ({ met, text }: PasswordRequirementProps) => (
  <div className="flex items-center gap-1.5">
    {met ? (
      <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
    ) : (
      <XCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
    )}
    <span
      className={cn(
        'text-xs',
        met ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
      )}
    >
      {text}
    </span>
  </div>
);

SignupForm.displayName = 'SignupForm';

export { SignupForm };
