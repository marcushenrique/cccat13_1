import AccountRepository from "./AccountRepository";
import RideRepository from "./RideRepository";
import { AcceptRideInput } from "./types";

export default class AcceptRideService {

    constructor(private readonly accountRepository: AccountRepository, private readonly rideRepository: RideRepository) {
    }

    async acceptRide(input: AcceptRideInput) {
        const account = await this.accountRepository.getAccount(input.driverId);
        if (!account.is_driver) {
            throw new Error("Invalid driver");
        }
        const ride = await this.rideRepository.getById(input.rideId);
        if (ride.status !== "requested") {
            throw new Error("Ride is not in requested status");
        }
        const lastRide = await this.rideRepository.getLastByAccountIdAndType(input.driverId, "driver");
        if (lastRide && this.isActive(lastRide.status)) {
            throw new Error("Driver has another active ride");
        }
        ride.driverId = input.driverId;
        ride.status = "accepted";
        await this.rideRepository.update(ride);
    }

    private isActive(status: string) {
        return status === "in_progress" || status === "accepted";
    }
}