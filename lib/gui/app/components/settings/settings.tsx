/*
 * Copyright 2019 balena.io
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

import GithubSvg from '@fortawesome/fontawesome-free/svgs/brands/github.svg';
import DiscordSvg from '@fortawesome/fontawesome-free/svgs/brands/discord.svg';
import InstagramSvg from '@fortawesome/fontawesome-free/svgs/brands/instagram.svg';
import YoutubeSvg from '@fortawesome/fontawesome-free/svgs/brands/youtube.svg';
import * as _ from 'lodash';
import * as React from 'react';
import { Checkbox, Flex, Txt } from 'rendition';

import { version, packageType } from '../../../../../package.json';
import * as settings from '../../models/settings';
import { open as openExternal } from '../../os/open-external/services/open-external';
import { Modal } from '../../styled-components';

interface Setting {
	name: string;
	label: string | JSX.Element;
}

async function getSettingsList(): Promise<Setting[]> {
	const list: Setting[] = [
		{
			name: 'betaVersions',
			label: 'Näytä betaversiot',
		},
	];
	if (['appimage', 'nsis', 'dmg'].includes(packageType)) {
		list.push({
			name: 'updatesEnabled',
			label: 'Automaattiset päivitykset',
		});
	}
	return list;
}

interface SettingsModalProps {
	toggleModal: (value: boolean) => void;
}

export function SettingsModal({ toggleModal }: SettingsModalProps) {
	// @ts-ignore
	const [settingsList, setCurrentSettingsList] = React.useState<Setting[]>([]);
	React.useEffect(() => {
		(async () => {
			const list = await getSettingsList();
			if (settingsList.length === 0 && list.length > 0) {
				setCurrentSettingsList(list);
			}
		})();
	});
	const [currentSettings, setCurrentSettings] = React.useState<
		_.Dictionary<boolean>
	>({});
	React.useEffect(() => {
		(async () => {
			const all = await settings.getAll();
			if (_.isEmpty(currentSettings) && all) {
				setCurrentSettings(all);
			}
		})();
	});

	const toggleSetting = async (setting: string) => {
		const value = currentSettings[setting];
		await settings.set(setting, !value);
		setCurrentSettings({
			...currentSettings,
			[setting]: !value,
		});
	};

	return (
		<Modal
			titleElement={
				<Txt fontSize={24} mb={24}>
					Tietoja ja asetukset
				</Txt>
			}
			done={() => toggleModal(false)}
		>
			<Flex flexDirection="column">
				Abitikku on ohjelma, joka mahdollistaa helpon Abitti-järjestelmän
				asennuksen yhdelle tai useammalle tikulle ilman vaivaa ja säätöä.
				{settingsList.map((setting: Setting, i: number) => {
					return (
						<Flex key={setting.name} mb={14} margin={18}>
							<Checkbox
								toggle
								tabIndex={6 + i}
								label={setting.label}
								checked={currentSettings[setting.name]}
								onChange={() => toggleSetting(setting.name)}
							/>
						</Flex>
					);
				})}
				<Flex style={{ flexDirection: 'row' }} mt={18}>
					<Flex
						mr={18}
						alignItems="center"
						color="#0063bd"
						style={{
							width: 'fit-content',
							cursor: 'pointer',
							fontSize: 14,
						}}
						onClick={() =>
							openExternal(
								'https://github.com/Testausserveri/abitikku/blob/master/CHANGELOG.md',
							)
						}
					>
						<GithubSvg
							height="1em"
							fill="currentColor"
							style={{ marginRight: 8 }}
						/>
						<Txt style={{ borderBottom: '1px solid #0063bd' }}>{version}</Txt>
					</Flex>
					<Flex
						mr={18}
						alignItems="center"
						color="#7289DA"
						style={{
							width: 'fit-content',
							cursor: 'pointer',
							fontSize: 14,
						}}
						onClick={() => openExternal('https://discord.testausserveri.fi')}
					>
						<DiscordSvg
							height="1em"
							fill="currentColor"
							style={{ marginRight: 8 }}
						/>
						<Txt style={{ borderBottom: '1px solid #7289DA' }}>Discord</Txt>
					</Flex>
					<Flex
						mr={18}
						alignItems="center"
						color="#833AB4"
						style={{
							width: 'fit-content',
							cursor: 'pointer',
							fontSize: 14,
						}}
						onClick={() => openExternal('https://instagram.com/testausserveri')}
					>
						<InstagramSvg
							height="1em"
							fill="currentColor"
							style={{ marginRight: 8 }}
						/>
						<Txt style={{ borderBottom: '1px solid #833AB4' }}>Instagram</Txt>
					</Flex>
					<Flex
						mr={18}
						alignItems="center"
						color="#FF0000"
						style={{
							width: 'fit-content',
							cursor: 'pointer',
							fontSize: 14,
						}}
						onClick={() =>
							openExternal(
								'https://www.youtube.com/channel/UCax9TBqmRApG3RSspvzyxvA',
							)
						}
					>
						<YoutubeSvg
							height="1em"
							fill="currentColor"
							style={{ marginRight: 8 }}
						/>
						<Txt style={{ borderBottom: '1px solid #FF0000' }}>Youtube</Txt>
					</Flex>
				</Flex>
			</Flex>
		</Modal>
	);
}
