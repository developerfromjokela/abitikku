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
import * as prettyBytes from 'pretty-bytes';
import i18n from './i18n';

export const progress: Dictionary<(quantity: number) => string> = {
	successful: (quantity: number) => {
		return i18n.t('shared.messages.progress.success', { count: quantity });
	},

	failed: (quantity: number) => {
		return i18n.t('shared.messages.progress.failure', { count: quantity });
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
			targets.push(
				i18n.t('shared.messages.info.singleTarget', {
					description: drive.description,
					displayName: drive.displayName,
				}),
			);
		} else {
			if (successful) {
				targets.push(
					i18n.t('shared.messages.info.successfulTargets', {
						count: successful,
					}),
				);
			}
			if (failed) {
				targets.push(
					i18n.t('shared.messages.info.failedTargets', {
						count: successful,
					}),
				);
			}
		}
		return i18n.t('shared.messages.info.header', {
			imageBasename,
			targets: targets.join(' '),
		});
	},
};

export const compatibility = {
	sizeNotRecommended: () => {
		return i18n.t('shared.messages.compatibility.sizeNotRecommended');
	},

	tooSmall: () => {
		return i18n.t('shared.messages.compatibility.tooSmall');
	},

	locked: () => {
		return i18n.t('shared.messages.compatibility.locked');
	},

	system: () => {
		return i18n.t('shared.messages.compatibility.system');
	},

	containsImage: () => {
		return i18n.t('shared.messages.compatibility.containsImage');
	},

	// The drive is large and therefore likely not a medium you want to write to.
	largeDrive: () => {
		return i18n.t('shared.messages.compatibility.largeDrive');
	},
} as const;

export const warning = {
	tooSmall: (source: { size: number }, target: { size: number }) => {
		return i18n.t('shared.messages.warning.tooSmall', {
			bytes: prettyBytes(source.size - target.size),
		});
	},

	exitWhileFlashing: () => {
		return i18n
			.t<string[]>('shared.messages.warning.exitWhileFlashing')
			.join(' ');
	},

	looksLikeWindowsImage: () => {
		return i18n
			.t<string[]>('shared.messages.warning.looksLikeWindowsImage')
			.join(' ');
	},

	missingPartitionTable: () => {
		return i18n
			.t<string[]>('shared.messages.warning.missingPartitionTable')
			.join(' ');
	},

	driveMissingPartitionTable: () => {
		return i18n.t('shared.messages.warning.driveMissingPartitionTable');
	},

	largeDriveSize: () => {
		return i18n.t('shared.messages.warning.largeDriveSize');
	},

	systemDrive: () => {
		return i18n.t('shared.messages.warning.systemDrive');
	},

	betaVersion: () => {
		return i18n.t('shared.messages.warning.betaVersion');
	},

	sourceDrive: () => {
		return i18n.t('shared.messages.warning.sourceDrive');
	},
};

export const error = {
	notEnoughSpaceInDrive: () => {
		return i18n
			.t<string[]>('shared.messages.error.notEnoughSpaceInDrive')
			.join(' ');
	},

	genericFlashError: (err: Error) => {
		return i18n.t('shared.messages.error.genericFlashError', {
			message: err.message,
		});
	},

	validation: () => {
		return i18n.t<string[]>('shared.messages.error.validation').join(' ');
	},

	openSource: (sourceName: string, errorMessage: string) => {
		return i18n.t('shared.messages.error.openSource', {
			sourceName,
			errorMessage,
		});
	},

	flashFailure: (
		imageBasename: string,
		drives: Array<{ description: string; displayName: string }>,
	) => {
		return i18n.t('shared.messages.error.flashFailure', {
			imageBasename,
			targets: drives,
		});
	},

	driveUnplugged: () => {
		return i18n.t<string[]>('shared.messages.error.driveUnplugged').join(' ');
	},

	inputOutput: () => {
		return i18n.t<string[]>('shared.messages.error.inputOutput').join(' ');
	},

	childWriterDied: () => {
		return i18n.t<string[]>('shared.messages.error.childWriterDied').join(' ');
	},

	unsupportedProtocol: () => {
		return i18n.t('shared.messages.error.unsupportedProtocol');
	},
};
