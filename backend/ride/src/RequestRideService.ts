import crypto from "crypto";
import AccountRepository from "./AccountRepository";
import RideRepository from "./RideRepository";
import { RequestRideInput } from "./types";

export default class RequestRideService {

    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {
    }

    async requestRide(input: RequestRideInput) {
        const account = await this.accountRepository.getAccount(input.passengerId);
        if (!account.is_passenger) {
            throw new Error("Invalid passenger account");
        }
        const lastRide = await this.rideRepository.getLastRide(input.passengerId, "passenger");
        if (lastRide && lastRide.status !== "completed") {
            throw new Error("Passenger has an incompleted ride");
        }
        const ride = {
            rideId: crypto.randomUUID(),
            passengerId: input.passengerId,
            driverId: crypto.randomUUID(),
            status: "requested",
            fare: 1,
            distance: 1,
            fromLat: input.from.lat,
            fromLong: input.from.long,
            toLat: input.to.lat,
            toLong: input.to.long,
            date: new Date()
        };
        await this.rideRepository.addRide(ride);
        return ride.rideId;
    }
}