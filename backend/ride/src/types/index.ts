export type RequestRideInput = {
    passengerId: string,
    from: { lat: number, long: number },
    to: { lat: number, long: number }
}

export type AcceptRideInput = {
    rideId: string,
    driverId: string
};

export type Account = {
    account_id: string,
    is_passenger: boolean,
    is_driver: boolean
}

export type AccountType = "passenger" | "driver"

export type Ride = {
    ride_id: string,
    passenger_id: string,
    driver_id?: string,
    status: string,
    fare: number,
    distance: number,
    from_lat: number,
    from_long: number,
    to_lat: number,
    to_long: number,
    date: Date
}

export type DateProvider = () => Date
