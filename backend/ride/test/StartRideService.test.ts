import crypto from "crypto";
import RideRepository from "../src/RideRepository";
import { createTestRide } from "./TestHelpers";
import StartRideService from "../src/StartRideService";

describe("StartRideService", () => {

    test("should start ride", async () => {
        // Arrange
        const rideId = crypto.randomUUID();
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ rideId: rideId, status: "accepted" }));
        // Act
        const service = new StartRideService(rideRepository);
        await service.startRide(rideId);
        // Assert
        const ride = await rideRepository.getRide(rideId);
        expect(ride.status).toBe("in_progress");
    });

    test("should validate if ride is not accepted", async () => {
        // Arrange
        const rideId = crypto.randomUUID();
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ rideId: rideId, status: "requested" }));
        // Act
        const service = new StartRideService(rideRepository);
        await expect(() => service.startRide(rideId)).rejects.toThrow(new Error("Ride is not accepted"));
    });
});