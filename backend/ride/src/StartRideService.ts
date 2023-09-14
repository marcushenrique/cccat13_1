import RideRepository from "./RideRepository";

export default class StartRideService {

    constructor(readonly rideRepository: RideRepository) {
    }

    async startRide(rideId: string) {
        const ride = await this.rideRepository.getRide(rideId);
        if (ride.status !== "accepted") {
            throw new Error("Ride is not accepted");
        }
        ride.status = "in_progress";
        await this.rideRepository.updateRide(ride);
    }
}