export interface Event {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    ageRating: string;
    prices: {
        adult: number;
        child: number;
        family: number;
    };
    datetimes: any[];
}
