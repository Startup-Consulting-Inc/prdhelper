/**
 * Schedule Demo Modal Component
 *
 * Modal form for scheduling a demo call from the landing page.
 * Collects user information and sends demo request to admin.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Alert } from '../ui/Alert';
import { trpc } from '../../lib/trpc';

// Client-side validation schema (matches server schema)
const scheduleDemoSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().max(200, 'Company name must be less than 200 characters').optional(),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),
});

type ScheduleDemoFormData = z.infer<typeof scheduleDemoSchema>;

export interface ScheduleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleDemoModal({ isOpen, onClose }: ScheduleDemoModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScheduleDemoFormData>({
    resolver: zodResolver(scheduleDemoSchema),
  });

  const scheduleDemoMutation = trpc.demo.scheduleDemo.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      reset();
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3000);
    },
  });

  const onSubmit = async (data: ScheduleDemoFormData) => {
    try {
      await scheduleDemoMutation.mutateAsync(data);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    if (!scheduleDemoMutation.isPending) {
      onClose();
      setIsSuccess(false);
      reset();
      scheduleDemoMutation.reset();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-950 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={scheduleDemoMutation.isPending}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Schedule a Demo Call
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tell us about yourself and we'll get back to you shortly to schedule a personalized
            demo.
          </p>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6">
              <Alert variant="success" title="Request Submitted!">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>
                    Thank you for your interest! We'll contact you at the email you provided to
                    schedule your demo.
                  </span>
                </div>
              </Alert>
            </div>
          )}

          {/* Error Message */}
          {scheduleDemoMutation.isError && (
            <div className="mb-6">
              <Alert variant="error" title="Submission Failed">
                {scheduleDemoMutation.error?.message ||
                  'Failed to submit your request. Please try again.'}
              </Alert>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div>
                <Input
                  {...register('name')}
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  errorText={errors.name?.message}
                  disabled={scheduleDemoMutation.isPending}
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <Input
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  placeholder="john@company.com"
                  errorText={errors.email?.message}
                  disabled={scheduleDemoMutation.isPending}
                  required
                />
              </div>

              {/* Company Field (Optional) */}
              <div>
                <Input
                  {...register('company')}
                  type="text"
                  label="Company"
                  placeholder="Acme Inc. (optional)"
                  errorText={errors.company?.message}
                  disabled={scheduleDemoMutation.isPending}
                />
              </div>

              {/* Message Field (Optional) */}
              <div>
                <Textarea
                  {...register('message')}
                  label="Message / Requirements"
                  placeholder="Tell us about your project or specific requirements... (optional)"
                  errorText={errors.message?.message}
                  disabled={scheduleDemoMutation.isPending}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={scheduleDemoMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={scheduleDemoMutation.isPending}
                  disabled={scheduleDemoMutation.isPending}
                >
                  {scheduleDemoMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
