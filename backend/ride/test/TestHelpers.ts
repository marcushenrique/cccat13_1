import crypto from "crypto";

export function createTestAccount(account: { accountId: string, isDriver?: boolean, isPassenger?: boolean }) {
    return {
        account_id: account.accountId,
        is_driver: account.isDriver || false,
        is_passenger: account.isPassenger || false
    };
}

export function createTestRide(ride: { rideId: string, passengerId?: string, driverId?: string, status: string }) {
    return {
        rideId: ride.rideId,
        passengerId: ride.passengerId || crypto.randomUUID(),
        driverId: ride.driverId || crypto.randomUUID(),
        status: ride.status,
        fare: 1,
        distance: 1,
        fromLat: -23.5228307,
        fromLong: -46.6972663,
        toLat: -23.540632,
        toLong: -46.658482,
        date: new Date()
    };
}

export function createTestPosition(position: { rideId: string, lat: number, long: number }) {
    return {
        positionId: crypto.randomUUID(),
        rideId: position.rideId,
        lat: position.lat,
        long: position.long,
        date: new Date()
    };
}

export function getTestCoordinates() {
    return [
        { lat: -23.5228307, long: -46.6972663 },
        { lat: -23.5260407, long: -46.6791122 },
        { lat: -23.524847, long: -46.687802 },
        { lat: -23.525563, long: -46.682073 },
        { lat: -23.526159, long: -46.675356 },
        { lat: -23.529518, long: -46.668203 },
        { lat: -23.532056, long: -46.661240 },
        { lat: -23.535754, long: -46.660575 },
        { lat: -23.538980, long: -46.661305 },
        { lat: -23.540632, long: -46.658482 }
    ];
}