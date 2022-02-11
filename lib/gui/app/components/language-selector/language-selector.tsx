import * as React from 'react';
import * as settings from '../../models/settings';
import { Button, Flex, Txt } from 'rendition';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../shared/i18n';
import styled from 'styled-components';

const setLanguage = (lang: string) => {
	settings.set('language', lang);
	i18n.changeLanguage(lang);
};

const Divider = () => <Txt>|</Txt>;

const LanguageButton = styled(Button)`
	width: auto !important;
	cursor: pointer !important;
	margin: 0 10px;
	position: relative;

	&:hover:enabled {
		color: #2a506f;
		cursor: pointer;
	}
	&:hover:before {
		content: '';
		position: absolute;
		top: -0.2rem;
		left: -0.2rem;
		width: 100%;
		height: 100%;
		padding: 0.2rem;
		background-color: rgba(0, 0, 0, 0.04);
		z-index: 0;
		border-radius: 4rem;
		transition: background-color 0.1s;
	}

	&:focus:enabled {
		color: rgb(0, 110, 210) !important;
	}
`;

export const LanguageSelector = () => {
	const {
		i18n: { language: active },
	} = useTranslation();
	return (
		<Flex>
			<LanguageButton
				plain
				color={
					active === 'fi'
						? theme.colors.primary.background
						: theme.colors.dark.background
				}
				onClick={() => setLanguage('fi')}
			>
				SUOMEKSI
			</LanguageButton>
			<Divider />
			<LanguageButton
				plain
				color={
					active === 'dummy'
						? theme.colors.primary.background
						: theme.colors.dark.background
				}
				onClick={() => setLanguage('dummy')}
			>
				PÅ SVENSKA
			</LanguageButton>
			<Divider />
			<LanguageButton
				plain
				color={
					active === 'en'
						? theme.colors.primary.background
						: theme.colors.dark.background
				}
				onClick={() => setLanguage('en')}
			>
				IN ENGLISH
			</LanguageButton>
		</Flex>
	);
};
