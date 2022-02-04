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

import ExclamationTriangleSvg from '@fortawesome/fontawesome-free/svgs/solid/exclamation-triangle.svg';
import NoSelectionSvg from '@fortawesome/fontawesome-free/svgs/solid/question-circle.svg';
import * as React from 'react';
import { Flex, FlexProps, Txt } from 'rendition';

import UsbIcon from '../../../assets/usb.png';

import {
	getDriveImageCompatibilityStatuses,
	DriveStatus,
} from '../../../../shared/drive-constraints';
import { compatibility, warning } from '../../../../shared/messages';
import * as prettyBytes from 'pretty-bytes';
import { getImage, getSelectedDrives } from '../../models/selection-state';
import {
	ChangeButton,
	DetailsText,
	SecondaryStepButton,
	StepNameButton,
} from '../../styled-components';
import { middleEllipsis } from '../../utils/middle-ellipsis';
import { useTranslation } from 'react-i18next';

interface TargetSelectorProps {
	targets: any[];
	disabled: boolean;
	openDriveSelector: () => void;
	reselectDrive: () => void;
	flashing: boolean;
	show: boolean;
	tooltip: string;
}

function getDriveWarning(status: DriveStatus) {
	switch (status.message) {
		case compatibility.containsImage():
			return warning.sourceDrive();
		case compatibility.largeDrive():
			return warning.largeDriveSize();
		case compatibility.system():
			return warning.systemDrive();
		default:
			return '';
	}
}

const DriveCompatibilityWarning = ({
	warnings,
	...props
}: {
	warnings: string[];
} & FlexProps) => {
	const systemDrive = warnings.find(
		(message) => message === warning.systemDrive(),
	);
	return (
		<Flex tooltip={warnings.join(', ')} {...props}>
			<ExclamationTriangleSvg
				fill={systemDrive ? '#e08704' : '#8f9297'}
				height="1em"
			/>
		</Flex>
	);
};

export function TargetSelectorButton(props: TargetSelectorProps) {
	const { t } = useTranslation();
	const targets = getSelectedDrives();

	if (targets.length === 1) {
		const target = targets[0];
		const warnings = getDriveImageCompatibilityStatuses(
			target,
			getImage(),
			true,
		).map(getDriveWarning);
		return (
			<>
				{/*
				<StepNameButton plain tooltip={props.tooltip}>
					{warnings.length > 0 && (
						<DriveCompatibilityWarning warnings={warnings} mr={2} />
					)}
					{middleEllipsis(target.description, 20)}
					{target.size != null && (
					<DetailsText>{prettyBytes(target.size)}</DetailsText>
				)}
				</StepNameButton>
				{!props.flashing && (
					<ChangeButton plain mb={14} onClick={props.reselectDrive}>
						Vaihda
					</ChangeButton>
				)}
				*/}

				<Flex
					flexDirection="row"
					style={{
						justifyContent: 'center',
						alignContent: 'center',
						justifyItems: 'center',
						alignItems: 'center',
					}}
				>
					<img
						src={UsbIcon}
						className={props.disabled ? 'disabled' : ''}
						width="40px"
						alt="USB"
					/>

					<Flex flexDirection="column">
						<DetailsText className={props.disabled ? 'disabled' : ''}>
							{warnings.length > 0 && (
								<DriveCompatibilityWarning warnings={warnings} mr={2} />
							)}
							{middleEllipsis(target.description, 20)}
						</DetailsText>
						{target.size != null && (
							<DetailsText className={props.disabled ? 'disabled' : ''}>
								{prettyBytes(target.size).replace(/GB/, 'Gt')}
							</DetailsText>
						)}
					</Flex>
				</Flex>
				{/*
					<ChangeButton plain mb={14} onClick={props.reselectDrive}>
						Vaihda
					</ChangeButton>
				*/}
				{!props.flashing && (
					<SecondaryStepButton
						primary={true}
						onClick={props.reselectDrive}
						style={{
							marginTop: 30,
							width: '100%',
						}}
					>
						{t('gui.target-selector-button.selectTarget')}
					</SecondaryStepButton>
				)}
			</>
		);
	}

	if (targets.length > 1) {
		const targetsTemplate = [];
		for (const target of targets) {
			const warnings = getDriveImageCompatibilityStatuses(
				target,
				getImage(),
				true,
			).map(getDriveWarning);
			targetsTemplate.push(
				<DetailsText
					key={target.device}
					tooltip={`${target.description} ${target.displayName} ${
						target.size != null ? prettyBytes(target.size) : ''
					}`}
					px={21}
				>
					{warnings.length > 0 ? (
						<DriveCompatibilityWarning warnings={warnings} mr={2} />
					) : null}
					<Txt mr={2}>{middleEllipsis(target.description, 14)}</Txt>
					{target.size != null && <Txt>{prettyBytes(target.size)}</Txt>}
				</DetailsText>,
			);
		}
		return (
			<>
				<StepNameButton plain tooltip={props.tooltip}>
					{t('common.targets', { count: targets.length })}
				</StepNameButton>
				{targetsTemplate}
				{!props.flashing && (
					<ChangeButton plain onClick={props.reselectDrive} mt={14}>
						{t('gui.target-selector-button.selectTarget')}
					</ChangeButton>
				)}
			</>
		);
	}

	return (
		<>
			<Flex
				flexDirection="row"
				style={{
					justifyContent: 'center',
					alignContent: 'center',
					justifyItems: 'center',
					alignItems: 'center',
				}}
				marginBottom={8}
			>
				<NoSelectionSvg
					className={props.disabled ? 'disabled' : ''}
					fill={props.disabled ? undefined : '#7e8085'}
					width="40px"
				/>

				<Flex flexDirection="column" marginLeft={10}>
					<DetailsText className={props.disabled ? 'disabled' : ''}>
						{t('gui.target-selector-button.noTargetSelected')}
					</DetailsText>
				</Flex>
			</Flex>
			<SecondaryStepButton
				primary={true}
				onClick={props.openDriveSelector}
				disabled={props.disabled}
				style={{
					marginTop: 30,
					width: '100%',
				}}
			>
				{t('gui.target-selector-button.selectTarget')}
			</SecondaryStepButton>
		</>
	);
}
