export type FormRequest<T extends object> = T & {
  [key: string]: any
}

export type DefaultFieldOptions = {
  [key: string]: FieldOptions
}

export interface FieldOptions {
  name: string
  required: boolean
  validation: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  errorMessage?: string
}
