
import en from './en.json' with { type: 'json' };
import fr from './fr.json' with { type: 'json' };

const messages = { en, fr };

function i({locale, id}: {locale: string, id: string}): string {
    //@ts-expect-error TS2345
    return messages[locale as 'en' | 'fr'][id] || id;
}

export default { i };