import { ReactNode } from 'react';
import { Input, InputProps } from '@/components/ui/Input';
import { Textarea, TextareaProps } from '@/components/ui/Textarea';
import { Select, SelectProps } from '@/components/ui/Select';

type BaseFormFieldProps = {
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
};

type InputFormFieldProps = BaseFormFieldProps & {
  type: 'input';
  inputProps: Omit<InputProps, 'label' | 'helperText' | 'errorText'>;
};

type TextareaFormFieldProps = BaseFormFieldProps & {
  type: 'textarea';
  textareaProps: Omit<TextareaProps, 'label' | 'helperText' | 'errorText'>;
};

type SelectFormFieldProps = BaseFormFieldProps & {
  type: 'select';
  selectProps: Omit<SelectProps, 'label' | 'helperText' | 'errorText'>;
};

export type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps | SelectFormFieldProps;

const FormField = (props: FormFieldProps) => {
  const { label, helperText, errorText, required, type } = props;

  const renderField = (): ReactNode => {
    switch (type) {
      case 'input':
        return (
          <Input
            {...props.inputProps}
            label={label}
            helperText={helperText}
            errorText={errorText}
            required={required}
          />
        );
      case 'textarea':
        return (
          <Textarea
            {...props.textareaProps}
            label={label}
            helperText={helperText}
            errorText={errorText}
            required={required}
          />
        );
      case 'select':
        return (
          <Select
            {...props.selectProps}
            label={label}
            helperText={helperText}
            errorText={errorText}
            required={required}
          />
        );
    }
  };

  return <div className="w-full">{renderField()}</div>;
};

FormField.displayName = 'FormField';

export { FormField };

