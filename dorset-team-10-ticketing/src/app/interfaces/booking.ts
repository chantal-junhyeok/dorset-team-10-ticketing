export interface Booking {
    ticketCounts: {
        adult: number;
        child: number;
        family: number;
    };
    totalPrice: number;
    customer: {
        firstname: string;
        lastname: string;
        email: string;
    };
    eventId: string;
    seats: string[];
}
