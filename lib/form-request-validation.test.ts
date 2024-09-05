import { describe, it, expect } from '@jest/globals'
import { validateFormRequest } from './form-request-validation'
import {
  ValidationRules,
  LanguageValidationRules,
  createValidationRegex,
} from './form-pattern.ts'
import type { DefaultFieldOptions, FormRequest } from './types.ts'

const fieldOptions: DefaultFieldOptions = {
  emailFrom: {
    name: 'Email',
    required: true,
    validation: true,
    pattern: ValidationRules.PhonePattern,
  },
  firstName: {
    name: 'First Name',
    required: false,
    validation: true,
    pattern: createValidationRegex(
      LanguageValidationRules.LatinAlphabetPattern,
    ),
  },
  lastName: {
    name: 'Last Name',
    required: false,
    validation: false,
    pattern: createValidationRegex(
      LanguageValidationRules.LatinAlphabetPattern,
    ),
  },
  message: {
    name: 'Message',
    required: true,
    validation: false,
  },
  address: {
    name: 'Address Name',
    required: true,
    validation: true,
    minLength: 5,
    maxLength: 10,
  },
}

describe('Validate Request', () => {
  it('should pass with valid data', () => {
    const request = createRequest()
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return no error when we use custom pattern property', () => {
    const request = createRequest({
      emailFrom: '+37258433383',
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return an error when we use custom pattern property', () => {
    const request = createRequest({
      emailFrom: 'user@example.com',
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([
      {
        field: 'emailFrom',
        errorMessage: 'Email is invalid.',
      },
    ])
  })

  it('should return no error when "first name" is required:false, validation:true', () => {
    const request = createRequest({
      firstName: '',
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return an error when "first name" is required:false, validation:true', () => {
    const request = createRequest({
      firstName: 'test',
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return no error when "last name" is required:false, validation:false', () => {
    const request = createRequest({
      lastName: '',
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return no error when "last name" is required:false, validation:false', () => {
    const request = createRequest({
      lastName: '~!@#$%^&*()_+}|}{:"?><M1234567890-=qwertyuiop[]',
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return an error when "message" is required:true, validation:false', () => {
    const request = createRequest({
      lastName: '',
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return an error when "address" is too short, with options required:true, validation:true', () => {
    const request = createRequest({
      lastName: createNinesString(4),
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return no error when "address" is required:true, validation:true', () => {
    const request = createRequest({
      lastName: createNinesString(10),
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return an error when "address" is too long, with options required:true, validation:true', () => {
    const request = createRequest({
      lastName: createNinesString(11),
    })
    const errors = validateFormRequest(request, fieldOptions)
    expect(errors).toEqual([])
  })
})

const createNinesString = (length: number) => {
  return Array.from({ length })
    .map(() => '9')
    .join('')
}

const createRequest = (emailRequest?: Partial<FormRequest<any>>) => {
  return {
    emailFrom: '+1234567890',
    firstName: 'John',
    phoneNumber: '+1234567890',
    companyName: '123456790013',
    address: createNinesString(5),
    message: '666',
    preferredContactMethod: ['email'],

    ...emailRequest,
  }
}
