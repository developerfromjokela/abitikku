export interface Version {
	latest: boolean;
	versionName: string;
	versionCode: number;
	releaseDate: string;
	url: string;
	beta: boolean;
}

export class ImageVersion implements Version {
	releaseDate: string;
	url: string;
	versionCode: number;
	versionName: string;
	latest: boolean;
	beta: boolean;

	constructor(
		versionName: string,
		versionCode: number,
		releaseDate: string,
		url: string,
		latest: boolean,
		beta: boolean,
	) {
		this.versionName = versionName;
		this.versionCode = versionCode;
		this.releaseDate = releaseDate;
		this.url = url;
		this.latest = latest;
		this.beta = beta;
	}
}

export interface VersionResponse {
	ktp: Version[];
	koe: Version[];
}
