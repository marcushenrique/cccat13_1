import AccountRepository from "./AccountRepository";
import RideRepository from "./RideRepository";
import { AcceptRideInput } from "./types";

export default class AcceptRideService {
    accountRepository: AccountRepository
    rideRepository: RideRepository

    constructor(accountRepository: AccountRepository, rideRepository: RideRepository) {
        this.accountRepository = accountRepository;
        this.rideRepository = rideRepository;
    }

    async acceptRide(input: AcceptRideInput) {
        const account = await this.accountRepository.getAccount(input.driverId);
        if (!account.is_driver) {
            throw new Error("Invalid driver");
        }
        const ride = await this.rideRepository.getRide(input.rideId);
        if (!ride) {
            throw new Error("Ride does not exist");
        }
        if (ride.status !== "requested") {
            throw new Error("Ride is not in requested status");
        }
        const lastRide = await this.rideRepository.getLastRide(input.driverId, "driver");
        if (lastRide && this.isActive(lastRide.status)) {
            throw new Error("Driver has another active ride");
        }
        ride.driver_id = input.driverId;
        ride.status = "accepted";
        await this.rideRepository.updateRide(ride);
    }

    private isActive(status: string) {
        return status === "in_progress" || status === "accepted";
    }
}