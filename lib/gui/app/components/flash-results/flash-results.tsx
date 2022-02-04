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

import CircleSvg from '@fortawesome/fontawesome-free/svgs/solid/circle.svg';
import * as React from 'react';
import { Flex, FlexProps, Link, TableColumn, Txt } from 'rendition';
import styled from 'styled-components';

import { progress } from '../../../../shared/messages';
import { bytesToMegabytes } from '../../../../shared/units';

import FlashSvg from '../../../assets/flash.svg';
import { getDrives } from '../../models/available-drives';
import { resetState } from '../../models/flash-state';
import * as selection from '../../models/selection-state';
import { middleEllipsis } from '../../utils/middle-ellipsis';
import { Modal, Table } from '../../styled-components';
import { SVGIcon } from '../svg-icon/svg-icon';
import i18n from '../../../../shared/i18n';
import { useTranslation } from 'react-i18next';

const ErrorsTable = styled((props) => <Table<FlashError> {...props} />)`
	&&& [data-display='table-head'],
	&&& [data-display='table-body'] {
		> [data-display='table-row'] {
			> [data-display='table-cell'] {
				&:first-child {
					width: 30%;
				}

				&:nth-child(2) {
					width: 20%;
				}

				&:last-child {
					width: 50%;
				}
			}
		}
	}
`;
export interface FlashError extends Error {
	description: string;
	device: string;
	code: string;
}

function formattedErrors(errors: FlashError[]) {
	return errors
		.map((error) => `${error.device}: ${error.message || error.code}`)
		.join('\n');
}

const columns: Array<TableColumn<FlashError>> = [
	{
		field: 'description',
		label: i18n.t('gui.flash-results.descriptionLabel'),
	},
	{
		field: 'device',
		label: i18n.t('gui.flash-results.deviceLabel'),
	},
	{
		field: 'message',
		label: i18n.t('gui.flash-results.messageLabel'),
		render: (message: string, { code }: FlashError) => {
			return message ?? code;
		},
	},
];

function getEffectiveSpeed(results: {
	sourceMetadata: {
		size: number;
		blockmappedSize?: number;
	};
	averageFlashingSpeed: number;
}) {
	const flashedSize =
		results.sourceMetadata.blockmappedSize ?? results.sourceMetadata.size;
	const timeSpent = flashedSize / results.averageFlashingSpeed;
	return results.sourceMetadata.size / timeSpent;
}

export function FlashResults({
	goToMain,
	image = '',
	imageLogo = '',
	errors,
	results,
	skip,
	...props
}: {
	goToMain: () => void;
	image?: string;
	imageLogo?: string;
	errors: FlashError[];
	skip: boolean;
	results: {
		sourceMetadata: {
			size: number;
			blockmappedSize?: number;
		};
		averageFlashingSpeed: number;
		devices: { failed: number; successful: number };
	};
} & FlexProps) {
	const [showErrorsInfo, setShowErrorsInfo] = React.useState(false);
	const allFailed = !skip && results.devices.successful === 0;
	const effectiveSpeed = bytesToMegabytes(getEffectiveSpeed(results)).toFixed(
		1,
	);
	const { t } = useTranslation();
	return (
		<Flex flexDirection="column" {...props}>
			<Flex alignItems="center" flexDirection="column">
				<Flex
					alignItems="center"
					mt="50px"
					mb="32px"
					color="#7e8085"
					flexDirection="column"
				>
					<SVGIcon
						width="40px"
						height="40px"
						contents={imageLogo}
						fallback={FlashSvg}
					/>
					<Txt>{middleEllipsis(image, 24)}</Txt>
				</Flex>
				<Txt fontSize={24} mb="17px">
					{allFailed
						? t('gui.flash-results.flashFail')
						: t('gui.flash-results.flashSuccess')}
				</Txt>
				{skip ? <Txt color="#7e8085">Varmistus ohitettiin</Txt> : null}
			</Flex>
			<Flex flexDirection="column" color="#7e8085">
				{results.devices.successful !== 0 ? (
					<Flex alignItems="center">
						<CircleSvg width="14px" fill="#1ac135" />
						<Txt ml="10px" color="#121212">
							{results.devices.successful}
						</Txt>
						<Txt ml="10px">
							{progress.successful(results.devices.successful)}
						</Txt>
					</Flex>
				) : null}
				{errors.length !== 0 ? (
					<Flex alignItems="center">
						<CircleSvg width="14px" fill="#ff4444" />
						<Txt ml="10px" color="#121212">
							{errors.length}
						</Txt>
						<Txt ml="10px" tooltip={formattedErrors(errors)}>
							{progress.failed(errors.length)}
						</Txt>
						<Link ml="10px" onClick={() => setShowErrorsInfo(true)}>
							{t('gui.flash-results.details')}
						</Link>
					</Flex>
				) : null}
				{!allFailed && (
					<Txt
						fontSize="10px"
						style={{
							fontWeight: 500,
							textAlign: 'center',
						}}
						tooltip={t('gui.flash-results.speedCalculationExplanation')}
					>
						{t('gui.flash-results.effectiveSpeed', { effectiveSpeed })}
					</Txt>
				)}
			</Flex>

			{showErrorsInfo && (
				<Modal
					titleElement={
						<Flex alignItems="baseline" mb={18}>
							<Txt fontSize={24} align="left">
								{t('gui.flash-results.failedTargets')}
							</Txt>
						</Flex>
					}
					action={t('gui.flash-results.retryFailedTargets')}
					cancel={() => setShowErrorsInfo(false)}
					done={() => {
						setShowErrorsInfo(false);
						resetState();
						getDrives()
							.map((drive) => {
								selection.deselectDrive(drive.device);
								return drive.device;
							})
							.filter((driveDevice) =>
								errors.some((error) => error.device === driveDevice),
							)
							.forEach((driveDevice) => selection.selectDrive(driveDevice));
						goToMain();
					}}
				>
					<ErrorsTable columns={columns} data={errors} />
				</Modal>
			)}
		</Flex>
	);
}
