import crypto from "crypto";
import PositionRepository from "../src/PositionRepository";
import RideRepository from "../src/RideRepository";
import UpdatePositionService from "../src/UpdatePositionService";
import { createTestRide } from "./TestHelpers";

describe("UpdatePositionService", () => {

    test("should update position", async () => {
        // Arrange
        const input = {
            rideId: crypto.randomUUID(),
            lat: -27.584905257808835,
            long: -48.545022195325124
        };
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ id: input.rideId, status: "in_progress" }))
        const positionRepository = new PositionRepository();
        // Act
        const service = new UpdatePositionService(rideRepository, positionRepository);
        const positionId = await service.updatePosition(input);
        // Assert
        const position = await positionRepository.getPosition(positionId);
        expect(position.positionId).toBeDefined();
        expect(position.rideId).toBe(input.rideId);
        expect(position.lat.toNumber()).toBe(input.lat);
        expect(position.long.toNumber()).toBe(input.long);
        expect(position.date).toBeDefined();
    });

    test("should validate if ride is not in progress", async () => {
        // Arrange
        const input = {
            rideId: crypto.randomUUID(),
            lat: -27.584905257808835,
            long: -48.545022195325124
        };
        const rideRepository = new RideRepository()
        await rideRepository.addRide(createTestRide({ id: input.rideId, status: "accepted" }))
        // Act
        const service = new UpdatePositionService(rideRepository, new PositionRepository());
        await expect(() => service.updatePosition(input)).rejects.toThrow(new Error("Ride is not in progress"));
    });
})