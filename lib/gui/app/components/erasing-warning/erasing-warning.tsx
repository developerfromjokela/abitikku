import ExclamationTriangleSvg from '@fortawesome/fontawesome-free/svgs/solid/exclamation-triangle.svg';
import * as React from 'react';
import { Flex, Txt, ModalProps } from 'rendition';
import { Modal } from '../../styled-components';
import { getSelectedDrives } from '../../models/selection-state';
import i18n from '../../../../shared/i18n';

const ErasingWarningModal = ({ done, cancel }: ModalProps) => {
	let warningSubtitle = 'Olet alustamassa valitsemasi tikut';
	const warningCta = `Alustamisen jälkeen tieto ${
		getSelectedDrives().length === 1 ? 'tikulta' : 'tikuilta'
	} ei ole enää palautettavissa, kaikki tieto TUHOTAAN PYSYVÄSTI! Haluatko jatkaa?`;
	if (getSelectedDrives().length === 1) {
		warningSubtitle = 'Olet alustamassa valitsemaasi tikkua';
	}
	return (
		<Modal
			position={'center'}
			footerShadow={false}
			reverseFooterButtons={true}
			done={done}
			cancel={cancel}
			cancelButtonProps={{
				primary: false,
				warning: true,
				children: i18n.t('common.action.cancel'),
			}}
			style={{
				height: 'unset',
			}}
			width={'unset'}
			action={'Kyllä, olen varma'}
			primaryButtonProps={{
				primary: false,
				outline: true,
			}}
		>
			<Flex flexDirection="column" alignItems="center" justifyContent="center">
				<Flex flexDirection="column">
					<ExclamationTriangleSvg height="2em" fill="#e08704" />
					<Txt fontSize="24px" color="#e08704">
						VAROITUS!
					</Txt>
				</Flex>
				<Txt fontSize="24px">{warningSubtitle}</Txt>
				<Txt style={{ fontWeight: 600 }}>{warningCta}</Txt>
			</Flex>
		</Modal>
	);
};

export default ErasingWarningModal;
