function getCurrentLocale() {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language
  }
  return 'en-US'
}
export { getCurrentLocale }
