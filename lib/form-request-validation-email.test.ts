import { describe, it, expect } from '@jest/globals'
import { validateFormRequest } from './form-request-validation'
import type { DefaultFieldOptions, FormRequest } from './types'
import { ValidationRules } from './form-pattern'

const fieldOptions: DefaultFieldOptions = {
  emailFrom: {
    name: 'Email',
    required: true,
    validation: true,
    minLength: 5,
    maxLength: 100,
    pattern: ValidationRules.EmailPattern,
  },
  firstName: {
    name: 'First Name',
    required: true,
    validation: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    name: 'Last Name',
    required: false,
    validation: true,
    minLength: 2,
    maxLength: 50,
  },
  preferredContactMethod: {
    name: 'Preferred Contact Method',
    required: false,
    validation: true,
  },
}

describe('Validate Email Request', () => {
  it('should return no errors for a valid request', () => {
    const emailRequest = createRequest()
    const errors = validateFormRequest(emailRequest, fieldOptions)
    expect(errors).toEqual([])
  })

  it('should return an error when email is missing', () => {
    const emailRequest = createRequest({
      emailFrom: undefined,
    })
    const errors = validateFormRequest(emailRequest as any, fieldOptions)
    expect(errors).toEqual([
      { field: 'emailFrom', errorMessage: 'Email is required.' },
    ])
  })

  it('should return an error when email is invalid', () => {
    const emailRequest = createRequest({
      emailFrom: 'invalid-email',
    })
    const errors = validateFormRequest(emailRequest, fieldOptions)
    expect(errors).toEqual([
      {
        field: 'emailFrom',
        errorMessage: 'Email is invalid.',
      },
    ])
  })

  it('should return an error when first name is too short', () => {
    const emailRequest = createRequest({
      firstName: 'J',
    })
    const errors = validateFormRequest(emailRequest, fieldOptions)
    expect(errors).toEqual([
      {
        field: 'firstName',
        errorMessage: 'First Name should be at least 2 characters long.',
      },
    ])
  })

  it('should return an error when first name is missing', () => {
    const emailRequest = createRequest({
      firstName: undefined,
    })
    const errors = validateFormRequest(emailRequest, fieldOptions)
    expect(errors).toEqual([
      { field: 'firstName', errorMessage: 'First Name is required.' },
    ])
  })

  it('should return an error when last name is too long', () => {
    const emailRequest = createRequest({
      lastName: 'A very long last name that exceeds the maximum allowed length',
    })
    const errors = validateFormRequest(emailRequest, fieldOptions)
    expect(errors).toEqual([
      {
        field: 'lastName',
        errorMessage: 'Last Name should be no more than 50 characters long.',
      },
    ])
  })

  it('should return multiple errors for multiple invalid fields', () => {
    const emailRequest = createRequest({
      emailFrom: 'invalid-email',
      firstName: 'J',
      lastName: '',
      preferredContactMethod: ['unknown'] as any,
    })
    const errors = validateFormRequest(emailRequest, fieldOptions)
    expect(errors).toEqual([
      {
        field: 'emailFrom',
        errorMessage: 'Email is invalid.',
      },
      {
        field: 'firstName',
        errorMessage: 'First Name should be at least 2 characters long.',
      },
    ])
  })

  it('should return an error for an empty request', () => {
    const emailRequest = {}
    const errors = validateFormRequest(emailRequest as any, fieldOptions)
    expect(errors).toEqual([
      { field: 'emailFrom', errorMessage: 'Email is required.' },
      { field: 'firstName', errorMessage: 'First Name is required.' },
    ])
  })
})

const createRequest = (emailRequest?: Partial<FormRequest<any>>) => {
  return {
    emailFrom: 'user@example.com',
    firstName: 'John',
    phoneNumber: '+1234567890',
    companyName: '666',
    preferredContactMethod: ['email'],
    ...emailRequest,
  }
}
