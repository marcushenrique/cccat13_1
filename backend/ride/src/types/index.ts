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
