import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as settings from '../gui/app/models/settings';

import en from '../../i18n/en.json';
import fi from '../../i18n/fi.json';
import se from '../../i18n/se.json';

export const resources = {
	en: {
		translation: en,
	},
	fi: {
		translation: fi,
	},
	// DO NOT USE THIS FIELD! literally cursed and will not work
	se: {
		translation: se,
	},
	dummy: {
		translation: se,
	},
};

export const initPromise = i18n
	.use(initReactI18next)
	.init({
		lng: 'fi',
		fallbackLng: 'fi',
		resources,
	})
	.then(() => {
		settings.get('language').then(i18n.changeLanguage);
	});

export default i18n;
