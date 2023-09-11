import crypto from "crypto";
import AccountRepository from "./AccountRepository";
import RideRepository from "./RideRepository";
import { DateProvider, RequestRideInput } from "./types";

export default class RequestRideService {
    accountRepository: AccountRepository
    rideRepository: RideRepository
    dateProvider: DateProvider

    constructor(accountRepository: AccountRepository, rideRepository: RideRepository, dateProvider: DateProvider) {
        this.accountRepository = accountRepository;
        this.rideRepository = rideRepository;
        this.dateProvider = dateProvider;
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
            ride_id: crypto.randomUUID(),
            passenger_id: input.passengerId,
            driver_id: crypto.randomUUID(),
            status: "requested",
            fare: 1,
            distance: 1,
            from_lat: input.from.lat,
            from_long: input.from.long,
            to_lat: input.to.lat,
            to_long: input.to.long,
            date: this.dateProvider()
        };
        return await this.rideRepository.addRide(ride);
    }
}