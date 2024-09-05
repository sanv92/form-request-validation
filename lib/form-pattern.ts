export const NumericPattern = '0-9'
export const SpecialCharacterPattern = `!?@#$%*()_;:'|,\\.\\- `

export const LatinAlphabetPattern = 'a-zA-Z'
export const CyrillicPattern = '\\u0400-\\u04FF' // Russian, Bulgarian, Ukrainian
export const EstonianPattern = `${LatinAlphabetPattern}ÕÄÖÜŠŽõäöüšž`
export const FrenchPattern = `${LatinAlphabetPattern}ÉÈÊËÇÀÂÎÏéèêëçàâîï`
export const RomanianPattern = `${LatinAlphabetPattern}ĂȘȚÂÎășțâî`
export const SpanishPattern = `${LatinAlphabetPattern}ÁÉÍÓÚÑÜáéíóúñü`
export const LatvianPattern = `${LatinAlphabetPattern}ĀČĒĢĪĶĻŅŠŪŽāčēģīķļņšūž`
export const LithuanianPattern = `${LatinAlphabetPattern}ĄČĘĖĮŠŲŪŽąčęėįšųūž`
export const PolishPattern = `${LatinAlphabetPattern}ĄĆĘŁŃÓŚŹŻąćęłńóśźż`
export const HungarianPattern = `${LatinAlphabetPattern}ÁÉÍÓÖŐÚÜŰáéíóöőúüű`
export const CroatianPattern = `${LatinAlphabetPattern}ČĆĐŽŠčćđžš`
export const CzechPattern = `${LatinAlphabetPattern}ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýž`
export const SlovenianPattern = `${LatinAlphabetPattern}ČŠŽčšž`
export const ArabicPattern = '\\u0600-\\u06FF'

export const EmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const PhonePattern = /^\+?[1-9]\d{1,14}([-\s()]?\d{1,15})*$/

export const ValidationRules = {
  NumericPattern,
  SpecialCharacterPattern,
  EmailPattern,
  PhonePattern,
}

export const LanguageValidationRules = {
  LatinAlphabetPattern,
  CyrillicPattern,
  EstonianPattern,
  FrenchPattern,
  RomanianPattern,
  SpanishPattern,
  LatvianPattern,
  LithuanianPattern,
  PolishPattern,
  HungarianPattern,
  CroatianPattern,
  CzechPattern,
  SlovenianPattern,
  ArabicPattern,
}

export const createValidationRegex = (
  ...validationRules: (RegExp | string)[]
): RegExp => {
  return new RegExp(`^[${validationRules.join('')}]+$`, 'u')
}
