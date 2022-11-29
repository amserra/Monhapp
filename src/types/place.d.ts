export interface Place {
	title: string;
	description: string;
	coordinate: {
		latitude: number;
		longitude: number;
	};
	image: string;
	rating: number;
	reviews: number;
}

export interface PlaceObject {
	[id: string]: Place;
}
