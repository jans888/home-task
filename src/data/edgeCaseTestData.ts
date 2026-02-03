export const edgeCaseData = {
  // ZIP rules
  validZipServiceAvailable: '68901', // per requirements: service available
  validZipOutOfArea: '11111',        // per requirements: out-of-area
  validZipLeadingZeros: '01234',     // ZIP with leading zeros
  invalidZipTooShort: '1234',
  invalidZipTooLong: '123456',
  invalidZipNonDigits: '12a45',
  invalidZipWithSpaces: '12 345',

  // Email rules (native HTML5 validation)
  invalidEmail: 'not-an-email',
  invalidEmailMissingTld: 'jan@test',
  invalidEmailMissingAt: 'jan.test.example.com',

  // Phone rules
  validPhone: '3135551212',          // exactly 10 digits
  validPhoneFormatted: '(313)555-1212',  // formatted phone
  validPhoneWithSpaces: '313 555 1212',  // phone with spaces
  validPhoneWithLeadingOne: '13135551212',  // 11 digits with leading 1
  invalidPhoneEmpty: '',               // empty phone
  invalidPhoneTooShort: '31355512',   // less than 10 digits
  invalidPhoneTooLong: '313555121234', // more than 10 digits
  invalidPhoneNonDigits: '31355abcde', // non-digit characters
} as const;
