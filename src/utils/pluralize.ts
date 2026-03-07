export function pluralize(number: number, singular: string, plural: string) {
  const translationKey = number === 1 ? singular : plural;

  return number + " " + translationKey;
}
