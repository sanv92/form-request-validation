# Form Request Validation

A simple and flexible form validation library that allows you to send any request and validate it against customizable field options. Easily define validation rules, patterns, and error handling for various forms and fields.

## Installation
To install the package, use npm:
```bash
npm install form-request-validation
```

or with yarn:
```bash
yarn add form-request-validation
```

## Usage
First, you need to configure your AWS credentials to allow the package to send emails using AWS SES. This can be done by setting up environment variables:
```typescript
import { validateEmailRequest } from 'form-request-validation'

const fieldOptions = {
  emailFrom: {
    name: 'Email From',
    required: true,
    validation: true,
    minLength: 1,
    maxLength: 500,
    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
    errorMessage: 'Please provide a valid email address',
  },
  subject: {
    name: 'Subject',
    required: false,
    validation: true,
    pattern: createValidationRegex([LatinAlphabetPattern, EstonianPattern, SpecialCharacterPattern]),
    errorMessage: 'Please provide a valid subject',
  },
}

const emailRequest = {
  emailFrom: 'user@example.com',
  subject: 'Contact Us Form Submission',
  message: 'This is a test message from the contact form.',
}

const validationErrors = validateEmailRequest(fieldOptions)
if (validationErrors.length > 0) {
  throw Error(JSON.stringify(validationErrors))
}
```

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue on GitHub if you find a bug or have a suggestion for improvement.
