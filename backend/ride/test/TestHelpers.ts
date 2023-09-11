import crypto from "crypto";

export function createTestAccount(account: { id: string, isDriver?: boolean, isPassenger?: boolean }) {
    return {
        account_id: account.id,
        is_driver: account.isDriver || false,
        is_passenger: account.isPassenger || false
    };
}

export function createTestRide(ride: {id: string, driverId?: string, status: string}) {
    return {
        ride_id: ride.id,
        passenger_id: crypto.randomUUID(),
        driver_id: ride.driverId,
        status: ride.status,
        fare: 1,
        distance: 1,
        from_lat: 1,
        from_long: 1,
        to_lat: 1,
        to_long: 1,
        date: new Date()
    };
}