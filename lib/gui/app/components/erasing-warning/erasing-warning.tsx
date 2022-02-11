import ExclamationTriangleSvg from '@fortawesome/fontawesome-free/svgs/solid/exclamation-triangle.svg';
import * as React from 'react';
import { Flex, Txt, ModalProps } from 'rendition';
import { Modal } from '../../styled-components';
import { getSelectedDrives } from '../../models/selection-state';
import { useTranslation } from 'react-i18next';

const ErasingWarningModal = ({ done, cancel }: ModalProps) => {
	const { t } = useTranslation();
	const warningSubtitle = t('gui.erasing-warning.subtitle', {
		count: getSelectedDrives().length,
	});
	const warningCta = t('gui.erasing-warning.cta', {
		count: getSelectedDrives().length,
	});

	return (
		<Modal
			position={'center'}
			footerShadow={false}
			reverseFooterButtons={false}
			done={done} // we switch these around, because we can't configure this components coloring any further
			cancel={cancel}
			style={{
				height: 'unset',
			}}
			width={'unset'}
			action={t('gui.erasing-warning.confirm')}
		>
			<Flex flexDirection="column" alignItems="center" justifyContent="center">
				<Flex flexDirection="column">
					<ExclamationTriangleSvg height="2em" fill="#e08704" />
					<Txt fontSize="24px" color="#e08704">
						{t('gui.erasing-warning.warning')}
					</Txt>
				</Flex>
				<Txt fontSize="24px">{warningSubtitle}</Txt>
				<Txt>{warningCta}</Txt>
			</Flex>
		</Modal>
	);
};

export default ErasingWarningModal;
