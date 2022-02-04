import * as React from "react";
import * as settings from '../../models/settings';
import { Button, Flex, Txt } from "rendition";
import { theme } from "../../theme";
import { useTranslation } from "react-i18next";
import i18n from "../../../../shared/i18n";

const setLanguage = (lang: string) => {
	settings.set("language", lang);
	i18n.changeLanguage(lang);
}

const Divider = () => <Txt >|</Txt>;

export const LanguageSelector = () => {
	const { i18n } = useTranslation();
	const active = i18n.language
	return <Flex
		width="75px"
	>
		<Button plain color={active === "fi" ? theme.colors.primary : theme.colors.dark.background} onClick={() => setLanguage("fi")}>FI</Button>
		<Divider />
		<Button plain color={active === "dummy" ? theme.colors.primary : theme.colors.dark.background} onClick={() => setLanguage("dummy")}>SE</Button>
		<Divider />
		<Button plain color={active === "en" ? theme.colors.primary : theme.colors.dark.background} onClick={() => setLanguage("en")}>EN</Button>
	</Flex>
};
