export interface Option {
    label: string;
    value: string;
}

export interface BookingData {
    from: string | null;
    to: string | null;
    day: Date | null;
    dayBack: Date | null;
    numberOfTickets: string | null;
}
