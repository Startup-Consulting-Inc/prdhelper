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
  onGoogleLogin?: () => Promise<void>;
  error?: string;
  isLoading?: boolean;
  isGoogleLoading?: boolean;
}

const SignupForm = ({ onSubmit, onGoogleLogin, error, isLoading = false, isGoogleLoading = false }: SignupFormProps) => {
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
    defaultValues: {
      modePreference: 'plain',
    },
  });

  const password = watch('password', '');
  const modePreference = watch('modePreference', 'plain');

  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
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
              <PasswordRequirement
                met={passwordStrength.hasSpecial}
                text="One special character (!@#$…)"
              />
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
          onValueChange={(value) =>
            setValue('modePreference', value as 'plain' | 'technical', {
              shouldDirty: true,
              shouldTouch: true,
            })
          }
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={onGoogleLogin}
        disabled={isLoading || isGoogleLoading || !onGoogleLogin}
        isLoading={isGoogleLoading}
      >
        {!isGoogleLoading && (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isGoogleLoading ? 'Signing up with Google...' : 'Sign up with Google'}
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
