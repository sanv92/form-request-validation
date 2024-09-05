import type { DefaultFieldOptions, FormRequest, FieldOptions } from './types'

interface ValidateFormRequest {
  field: string
  errorMessage: string
}

export const validateFormRequest = <T extends object>(
  emailRequest: FormRequest<T>,
  fieldOptions?: DefaultFieldOptions,
  defaultFieldOptions?: DefaultFieldOptions,
): ValidateFormRequest[] => {
  const newOptions = { ...defaultFieldOptions, ...fieldOptions }
  return Object.entries(newOptions).flatMap(([fieldName]) => {
    const fieldKey = fieldName
    const fieldOption = getFieldOptions<T>(
      fieldKey,
      fieldOptions,
      defaultFieldOptions,
    )
    const fieldValue = emailRequest[fieldKey]
    const error = validateField(fieldValue, fieldOption)
    return error ? [{ field: fieldKey, errorMessage: error }] : []
  })
}

const getFieldOptions = <T extends object>(
  fieldName: keyof FormRequest<T>,
  customFieldOptions: DefaultFieldOptions | undefined,
  defaultFieldOptions: DefaultFieldOptions,
): FieldOptions => {
  if (customFieldOptions && fieldName in customFieldOptions) {
    return customFieldOptions[fieldName as keyof DefaultFieldOptions]
  }

  if (fieldName in defaultFieldOptions) {
    return defaultFieldOptions[fieldName as keyof DefaultFieldOptions]
  }

  throw new Error(
    `Field '${fieldName.toString()}' not found in either custom or default field options.`,
  )
}

const validateField = (
  value: string | string[] | null | undefined,
  fieldOptions: FieldOptions,
): string | null => {
  const { name, required, validation } = fieldOptions

  if (required && isEmpty(value)) {
    return `${name} is required.`
  }

  if (validation && value) {
    const valueStr = Array.isArray(value) ? value.join(',') : String(value)

    return (
      validateLength(valueStr, fieldOptions) ||
      validatePattern(valueStr, fieldOptions)
    )
  }

  return null
}

const validateLength = (
  valueStr: string,
  fieldOptions: FieldOptions,
): string | null => {
  const { name, minLength, maxLength } = fieldOptions

  if (minLength && valueStr.length < minLength) {
    return `${name} should be at least ${minLength} characters long.`
  }

  if (maxLength && valueStr.length > maxLength) {
    return `${name} should be no more than ${maxLength} characters long.`
  }

  return null
}

const validatePattern = (
  valueStr: string,
  fieldOptions: FieldOptions,
): string | null => {
  const { name, pattern, errorMessage } = fieldOptions

  if (pattern && !pattern.test(valueStr)) {
    return errorMessage || `${name} is invalid.`
  }

  return null
}

const isEmpty = (value: string | string[] | null | undefined): boolean =>
  value === null || value === undefined || value === ''
