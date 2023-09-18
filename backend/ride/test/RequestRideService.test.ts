import crypto from "crypto";
import AccountRepository from "../src/AccountRepository";
import RequestRideService from "../src/RequestRideService";
import RideRepository from "../src/RideRepository";
import { createTestAccount } from "./TestHelpers";

describe("RequestRideService", () => {

    test("should request a new ride", async () => {
        // Arrange
        const input = {
            passengerId: crypto.randomUUID(),
            from: { lat: -23.5228307, long: -46.6972663 },
            to: { lat: -23.540632, long: -46.658482 }
        }
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount(createTestAccount({ accountId: input.passengerId, isPassenger: true }));
        const rideRepository = new RideRepository();
        // Act
        const service = new RequestRideService(accountRepository, rideRepository);
        const rideId = await service.requestRide(input);
        // Assert
        const ride = await rideRepository.getById(rideId);
        expect(rideId).toBeDefined();
        expect(ride.status).toBe("requested");
        expect(ride.fromLat).toBe(input.from.lat);
        expect(ride.fromLong).toBe(input.from.long);
        expect(ride.toLat).toBe(input.to.lat);
        expect(ride.toLong).toBe(input.to.long);
        expect(ride.date).toBeDefined();
    });

    test("should validate if requesting account is a passenger", async () => {
        // Arrange
        const input = {
            passengerId: crypto.randomUUID(),
            from: { lat: -23.5228307, long: -46.6972663 },
            to: { lat: -23.540632, long: -46.658482 }
        }
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount(createTestAccount({ accountId: input.passengerId, isPassenger: false }));
        // Act
        const service = new RequestRideService(accountRepository, new RideRepository());
        await expect(() => service.requestRide(input)).rejects.toThrow(new Error("Invalid passenger account"));
    });

    test("should validate if passenger has an incompleted ride", async () => {
        // Arrange
        const input = {
            passengerId: crypto.randomUUID(),
            from: { lat: -23.5228307, long: -46.6972663 },
            to: { lat: -23.540632, long: -46.658482 }
        }
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount(createTestAccount({ accountId: input.passengerId, isPassenger: true }));
        // Act
        const service = new RequestRideService(accountRepository, new RideRepository());
        await service.requestRide(input);
        await expect(() => service.requestRide(input)).rejects.toThrow(new Error("Passenger has an incompleted ride"));
    });
});
