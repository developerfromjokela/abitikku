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

import * as React from 'react';
import {
	Flex,
	ModalProps,
	Txt,
	TableColumn,
	Tabs,
	TabsProps,
	Spinner,
	Badge,
} from 'rendition';
import styled from 'styled-components';

type AbiVersion = ImageVersion | Version;

import { store } from '../../models/store';
import { GenericTableProps, Modal, Table } from '../../styled-components';

import { ImageVersion, Version, VersionResponse } from '../../models/version';
import { Tab } from 'rendition/dist/components/Tabs';
import { getVersions } from '../../../../shared/utils';
import { showError } from '../../os/dialog';
import { warning } from '../../../../shared/messages';
import * as settings from '../../models/settings';

const EditionTabs = (props: TabsProps) => (
	<div className="tabframe">
		<Tabs {...props} />
	</div>
);

// @ts-ignore
const VersionsTable = styled((props: GenericTableProps<AbiVersion>) => (
	<Table<AbiVersion> {...props} />
))`
	[data-display='table-head'],
	[data-display='table-body'] {
		> [data-display='table-row'] > [data-display='table-cell'] {
			&:nth-child(2) {
				width: 32%;
			}

			&:nth-child(3) {
				width: 15%;
			}

			&:nth-child(4) {
				width: 15%;
			}

			&:nth-child(5) {
				width: 32%;
			}
		}
	}
`;

export interface VersionSelectorProps
	extends Omit<ModalProps, 'done' | 'cancel'> {
	cancel: () => void;
	done: (version?: Version) => void;
	selectedVersion?: Version;
}

interface VersionSelectorState {
	selectedVersion?: Version;
	loading: boolean;
	versionResult?: VersionResponse;
}

export class VersionSelector extends React.Component<
	VersionSelectorProps,
	VersionSelectorState
> {
	private unsubscribe: (() => void) | undefined;
	tableColumns: Array<TableColumn<Version>>;

	constructor(props: VersionSelectorProps) {
		super(props);

		const selectedVersion = this.props.selectedVersion || undefined;

		this.state = {
			selectedVersion,
			loading: true,
		};

		this.tableColumns = [
			{
				field: 'versionName',
				label: 'Versio',
				render: (versionName: string, row: Version) => {
					return (
						<Txt>
							{versionName}{' '}
							{row.latest && (
								<Badge
									key={'Uusin'}
									shade={18}
									mr="10px"
									tooltip={'Uusin ladattava versio'}
								>
									Uusin
								</Badge>
							)}
							{row.beta && (
								<Badge
									key={'BETA'}
									shade={5}
									mr="10px"
									tooltip={
										'Betaversio, ei suositella ajamaan kouluympäristössä!'
									}
								>
									BETA
								</Badge>
							)}
						</Txt>
					);
				},
			},
			{
				field: 'releaseDate',
				label: 'Julkaistu',
				render: (value: string, row: Version) => {
					if (row !== undefined) {
						return <Txt>{new Date(row.releaseDate).toLocaleDateString()}</Txt>;
					}
					return <Txt>{value}</Txt>;
				},
			},
		];
	}

	componentDidMount() {
		this.unsubscribe = store.subscribe(() => {
			this.setState({
				selectedVersion: this.props.selectedVersion || undefined,
			});
		});
		this.loadVersions();
	}

	loadVersions() {
		getVersions()
			.then(async (versionResult) => {
				versionResult.koe = versionResult.koe.reverse();
				versionResult.ktp = versionResult.ktp.reverse();
				console.log(await settings.get('betaVersions'));
				if (!(await settings.get('betaVersions'))) {
					versionResult.ktp = versionResult.ktp.filter((i) => {
						return !i.beta;
					});
					versionResult.koe = versionResult.koe.filter((i) => {
						return !i.beta;
					});
				}
				if (versionResult.koe.length > 0) {
					let koeLatestMarked = false;
					versionResult.koe.some((item, index) => {
						if (!item.beta && !item.latest && !koeLatestMarked) {
							versionResult.koe[index].latest = true;
							koeLatestMarked = true;
						}
						return koeLatestMarked;
					});
				}
				if (versionResult.ktp.length > 0) {
					let ktpLatestMarked = false;
					versionResult.ktp.some((item, index) => {
						if (!item.beta && !item.latest && !ktpLatestMarked) {
							versionResult.ktp[index].latest = true;
							ktpLatestMarked = true;
						}
						return ktpLatestMarked;
					});
				}
				this.setState({
					loading: false,
					versionResult,
				});
			})
			.catch((error) => {
				this.props.cancel();
				showError(error);
			});
	}

	componentWillUnmount() {
		this.unsubscribe?.();
	}

	render() {
		const { cancel, done, ...props } = this.props;
		const { selectedVersion } = this.state;
		return (
			<Modal
				titleElement={
					<Flex alignItems="baseline">
						<Txt fontSize={24} align="left">
							Valitse versio
						</Txt>
					</Flex>
				}
				cancel={cancel}
				done={() => done(selectedVersion)}
				{...props}
			>
				{!this.state.loading ? (
					<>
						{this.state.selectedVersion?.beta ? (
							<Txt
								color="#e08704"
								style={{
									position: 'absolute',
									bottom: '8px',
								}}
							>
								Varoitus: {warning.betaVersion()}
							</Txt>
						) : null}
						<EditionTabs flex={'grow'} key="versions-tab">
							<Tab title={'Kokelastikku'}>
								<VersionsTable
									refFn={(t) => {
										if (t !== null && selectedVersion !== undefined) {
											t.setRowSelection([selectedVersion]);
										}
									}}
									multipleSelection={false}
									columns={this.tableColumns}
									data={this.state.versionResult?.koe || []}
									rowKey="versionName"
									onCheck={(rows: AbiVersion[]) => {
										const filteredRows = rows.slice(rows.length - 1);
										this.setState({
											selectedVersion: filteredRows[0],
										});
									}}
									onRowClick={(row: AbiVersion) => {
										if (
											selectedVersion?.versionCode !== row.versionCode &&
											selectedVersion?.versionName !== row.versionName
										) {
											// Must be new
											this.setState({
												selectedVersion: row,
											});
										} else {
											this.setState({
												selectedVersion: undefined,
											});
										}
									}}
								/>
							</Tab>
							<Tab title={'Koetilan palvelin'}>
								<VersionsTable
									refFn={(t) => {
										if (t !== null && selectedVersion !== undefined) {
											t.setRowSelection([selectedVersion]);
										}
									}}
									multipleSelection={false}
									columns={this.tableColumns}
									data={this.state.versionResult?.ktp || []}
									rowKey="versionName"
									onCheck={(rows: AbiVersion[]) => {
										const filteredRows = rows.slice(rows.length - 1);
										this.setState({
											selectedVersion: filteredRows[0],
										});
									}}
									onRowClick={(row: AbiVersion) => {
										if (
											selectedVersion?.versionCode !== row.versionCode &&
											selectedVersion?.versionName !== row.versionName
										) {
											// Must be new
											this.setState({
												selectedVersion: row,
											});
										} else {
											this.setState({
												selectedVersion: undefined,
											});
										}
									}}
								/>
							</Tab>
						</EditionTabs>
					</>
				) : (
					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						width="100%"
						height="100%"
					>
						<Spinner />
					</Flex>
				)}
			</Modal>
		);
	}
}
