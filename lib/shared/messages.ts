/*
 * Copyright 2016 balena.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Dictionary } from 'lodash';
import { outdent } from 'outdent';
import * as prettyBytes from 'pretty-bytes';

export const progress: Dictionary<(quantity: number) => string> = {
	successful: (quantity: number) => {
		const plural = quantity === 1 ? 'de' : 'eet';
		const plural2 = quantity === 1 ? 'u' : 'ee';
		return `Onnistun${plural2}t koh${plural}`;
	},

	failed: (quantity: number) => {
		const plural = quantity === 1 ? 'de' : 'eet';
		const plural2 = quantity === 1 ? 'u' : 'ee';
		return `Epäonnistun${plural2}t koh${plural}`;
	},
};

export const info = {
	flashComplete: (
		imageBasename: string,
		[drive]: [{ description: string; displayName: string }],
		{ failed, successful }: { failed: number; successful: number },
	) => {
		const targets = [];
		if (failed + successful === 1) {
			targets.push(`kohteeseen ${drive.description} (${drive.displayName})`);
		} else {
			if (successful) {
				const plural = successful === 1 ? 'teeseen' : 'eisiin';
				targets.push(`${successful} koh${plural}`);
			}
			if (failed) {
				const plural = failed === 1 ? 'teeseen' : 'teisiin';
				targets.push(`ja ${failed} koh${plural} kirjoittaminen epäonnistui`);
			}
		}
		return `${imageBasename} onnistuneesti kirjoitettiin ${targets.join(' ')}`;
	},
};

export const compatibility = {
	sizeNotRecommended: () => {
		return 'Ei suositella';
	},

	tooSmall: () => {
		return 'Liian pieni';
	},

	locked: () => {
		return 'Lukittu';
	},

	system: () => {
		return 'Järjestelmälevy';
	},

	containsImage: () => {
		return 'Lähdelevy';
	},

	// The drive is large and therefore likely not a medium you want to write to.
	largeDrive: () => {
		return 'Suuri levy';
	},
} as const;

export const warning = {
	tooSmall: (source: { size: number }, target: { size: number }) => {
		return outdent({ newline: ' ' })`
			Lähde on ${prettyBytes(source.size - target.size)}
			suurempi kuin levy
		`;
	},

	exitWhileFlashing: () => {
		return [
			'Kirjoitus tikulle on meneillään.',
			'Abitikun sulkeminen voi johtaa tikun korruptoitumiseen tai/ja hajoamiseen.',
		].join(' ');
	},

	looksLikeWindowsImage: () => {
		return [
			'Vaikuttaa siltä, että olet kirjoittamassa Windows-levykuvaa\n\n',
			'Toisin kuin muut levyt, Windowsin levykuvat tarvitsevat erityistä käsittelyä, jotta niistä saataisiin käynnistettäviä.',
			'Suosittelemme seuraavia työkaluja, kehitetty tähän tektävään:',
			'<a href="https://rufus.akeo.ie">Rufus</a> (Windows),',
			'<a href="https://github.com/slacka/WoeUSB">WoeUSB</a> (Linux),',
			'tai Boot Camp Assistant (macOS).',
		].join(' ');
	},

	missingPartitionTable: () => {
		return [
			'Vaikuttaa siltä, että laite ei ole käynnistettävä\n\n',
			'Laitteesta vaikuttaa puuttuvan osiotaulu,',
			'ja voi olla tunnistamaton käynnistyksessä.',
		].join(' ');
	},

	driveMissingPartitionTable: () => {
		return outdent({ newline: ' ' })`
			Tämä levy ei vaikuta olevan käynnistettävä.
			Laitteesta vaikuttaa puuttuvan osiotaulu,
			ja voi olla tunnistamaton käynnistyksessä.
		`;
	},

	largeDriveSize: () => {
		return 'Tämä on suuri laite! Varmista ettei levyllä ole mitään tarkeää!';
	},

	systemDrive: () => {
		return 'Järjestelmälevyn valitseminen on vaarallista ja voi tehdä järjestelmästä käyttäkelvottoman!';
	},

	sourceDrive: () => {
		return 'Sisältää levykuvan jota yrität kirjoittaa';
	},
};

export const error = {
	notEnoughSpaceInDrive: () => {
		return [
			'Ei riittävästi tallennustilaa tikulla',
			'Liitä isompi tikku ja yritä uudelleen',
		].join(' ');
	},

	genericFlashError: (err: Error) => {
		return `Jokin meni pieleen. Jos kyseessä on puristettu levykuva, tarkista ettei se ole korruptoitunut.\n${err.message}`;
	},

	validation: () => {
		return [
			'Levykuva kirjoitettiin onnistuneesti, mutta Abitikku havaitsi',
			'korruptointiongemia tarkistaessa tikkua.',
			'\n\nHarkitse toisen tikun käyttöä.',
		].join(' ');
	},

	openSource: (sourceName: string, errorMessage: string) => {
		return outdent`
			Jokin meni pieleen avattaessa ${sourceName}

			Virhe: ${errorMessage}
		`;
	},

	flashFailure: (
		imageBasename: string,
		drives: Array<{ description: string; displayName: string }>,
	) => {
		const target =
			drives.length === 1
				? `${drives[0].description} (${drives[0].displayName})`
				: `${drives.length} kohdetta`;
		return `Jokin meni pieleen kirjoittaessa ${imageBasename} kohteeseen ${target}.`;
	},

	driveUnplugged: () => {
		return [
			'Abitikku ei saa yhteyttä tikkuun.',
			'Irroititko tikun vahingossa irti?',
			'\n\nJoskus virhe johtuu huonosta lukijasta, joka ei tarjoa vakaata pääsyä levylle.',
		].join(' ');
	},

	inputOutput: () => {
		return [
			'Abitikku ei pysty kirjoittamaan tikulle.',
			'Tämä virhe johtuu usein viallisesta lukijasta tai portista.',
			'\n\nYritä uudelleen toisella tikulla, lukijalla ja/tai portilla.',
		].join(' ');
	},

	childWriterDied: () => {
		return [
			'Kirjoitusprosessi pysähtyi yllättäen.',
			'Yritä uudelleen, ja ota yhteyttä kehitystiimiin jos ongelma jatkuu.',
		].join(' ');
	},

	unsupportedProtocol: () => {
		return 'Vain http:// ja https:// URL-osoitteet ovat tuettuja.';
	},
};
