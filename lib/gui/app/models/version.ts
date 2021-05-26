export interface Version {
	latest: boolean;
	versionName: string;
	versionCode: number;
	releaseDate: string;
	url: string;
}

export class ImageVersion implements Version {
	releaseDate: string;
	url: string;
	versionCode: number;
	versionName: string;
	latest: boolean;

	constructor(
		versionName: string,
		versionCode: number,
		releaseDate: string,
		url: string,
		latest: boolean,
	) {
		this.versionName = versionName;
		this.versionCode = versionCode;
		this.releaseDate = releaseDate;
		this.url = url;
		this.latest = latest;
	}
}

export interface VersionResponse {
	ktp: Version[];
	koe: Version[];
}
