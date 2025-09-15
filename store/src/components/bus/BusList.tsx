import React from 'react';
import BusCard from '@components/bus/BusCard';

interface BusListProps {
    onSelectBus: () => void;
    data?: any[]; // Replace with proper bus data type
}

const BusList: React.FC<BusListProps> = ({ onSelectBus, data }) => {
    return (
        <>
            {(data || []).map((trip) => {
                const departureTime = new Date(trip.departure_time);
                const startTime = departureTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                // Optional: calculate endTime if you want (departure + duration)
                const [hours, minutes] = trip.route.duration.match(/\d+/g)?.map(Number) || [0, 0];
                const endTimeDate = new Date(departureTime);
                endTimeDate.setHours(endTimeDate.getHours() + hours);
                endTimeDate.setMinutes(endTimeDate.getMinutes() + minutes);
                const endTime = endTimeDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                });

                return (
                    <BusCard
                        key={trip.id}
                        startTime={startTime}
                        endTime={endTime}
                        price={`${trip.price.toLocaleString()} VND`}
                        carType={trip.bus.type}
                        availableSeats={trip.total_seats - trip.booked_seats}
                        startLocation={trip.route.origin}
                        endLocation={trip.route.destination}
                        onSelect={() => onSelectBus(trip)}
                    />
                );
            })}
        </>
    );
};

export default BusList;
