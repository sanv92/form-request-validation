import { describe, it, expect } from '@jest/globals'
import { validateFormRequest } from './form-request-validation'
import type { DefaultFieldOptions, FormRequest } from './types'
import {
  LanguageValidationRules,
  ValidationRules,
  createValidationRegex,
} from './form-pattern'

const fieldOptions: DefaultFieldOptions = {
  emailFrom: {
    name: 'Email',
    required: true,
    validation: true,
    pattern: ValidationRules.EmailPattern,
  },
  message: {
    name: 'Message',
    required: false,
    validation: true,
    pattern: createValidationRegex(
      ValidationRules.NumericPattern,
      ValidationRules.SpecialCharacterPattern,
      LanguageValidationRules.LatinAlphabetPattern,
      LanguageValidationRules.CyrillicPattern,
      LanguageValidationRules.EstonianPattern,
    ),
  },
  companyName: {
    name: 'Company Name',
    required: false,
    validation: true,
    pattern: createValidationRegex(ValidationRules.NumericPattern),
  },
}

describe('Validate Email Request for Message and CompanyName fields', () => {
  it('should validate the message field correctly with different patterns', () => {
    const validMessageRequests = [
      createRequest({ message: '123Specialäöü', companyName: '123' }),
      createRequest({
        message: '456!@#LatinQWERTYUIOasdfghjk',
        companyName: '123',
      }),
      createRequest({
        message: '789_CyrillicЙЦУКЕНГШЩЗфывапролд',
        companyName: '123',
      }),
    ]

    validMessageRequests.forEach((request) => {
      const errors = validateFormRequest(request, fieldOptions)
      expect(errors).toEqual([])
    })

    const invalidMessageRequests1 = [
      createRequest({
        message: '[!"№%:,.;()_ЪХЗЖЭЖДБЮ?~!@#$%^&*()_}{":>?<]',
        companyName: '123',
      }),
    ]

    invalidMessageRequests1.forEach((request) => {
      const errors = validateFormRequest(request, fieldOptions)
      if (request.message !== '') {
        expect(errors).toEqual([
          {
            field: 'message',
            errorMessage: 'Message is invalid.',
          },
        ])
      } else {
        expect(errors).toEqual([])
      }
    })

    const invalidMessageRequests2 = [
      createRequest({
        message: 'ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž',
        companyName: '123',
      }),
    ]

    invalidMessageRequests2.forEach((request) => {
      const errors = validateFormRequest(request, fieldOptions)
      if (request.message !== '') {
        expect(errors).toEqual([
          {
            field: 'message',
            errorMessage: 'Message is invalid.',
          },
        ])
      } else {
        expect(errors).toEqual([])
      }
    })
  })

  it('should validate the companyName field correctly with numeric pattern', () => {
    const validCompanyNameRequests = [
      createRequest({ message: 'ValidMessage', companyName: '123456' }),
      createRequest({ message: 'ValidMessage', companyName: '987654' }),
    ]

    validCompanyNameRequests.forEach((request) => {
      const errors = validateFormRequest(request, fieldOptions)
      expect(errors).toEqual([])
    })

    const invalidCompanyNameRequests = [
      createRequest({ message: 'ValidMessage', companyName: 'ABC' }),
      createRequest({
        message: 'ValidMessage',
        companyName: 'CompanyName!',
      }),
      createRequest({ message: 'ValidMessage', companyName: '' }),
    ]

    invalidCompanyNameRequests.forEach((request) => {
      const errors = validateFormRequest(request, fieldOptions)
      if (request.companyName !== '') {
        expect(errors).toEqual([
          {
            errorMessage: 'Company Name is invalid.',
            field: 'companyName',
          },
        ])
      } else {
        expect(errors).toEqual([])
      }
    })
  })
})

const createRequest = (emailRequest?: Partial<FormRequest<any>>) => {
  return {
    emailFrom: 'user@example.com',
    firstName: 'John',
    phoneNumber: '+1234567890',
    companyName: '666',
    preferredContactMethod: ['email'],
    message: '',
    ...emailRequest,
  }
}
