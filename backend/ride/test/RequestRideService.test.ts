import crypto from "crypto";
import AccountRepository from "../src/AccountRepository";
import DateProvider from "../src/DateProvider";
import RequestRideService from "../src/RequestRideService";
import RideRepository from "../src/RideRepository";

describe("RequestRideService", () => {
    test("should create a new ride request", async () => {
        // Arrange
        const input = {
            passengerId: crypto.randomUUID(),
            from: { lat: 1, long: 1 },
            to: { lat: 1, long: 1 }
        }
        const requestDate = new Date();
        const accountRepository = new AccountRepository();
        const rideRepository = new RideRepository();
        await accountRepository.addAccount({ account_id: input.passengerId, is_passenger: true });
        // Act
        const requestRideService = new RequestRideService(accountRepository, rideRepository, new DateProvider(requestDate));
        const rideId = await requestRideService.requestRide(input);
        // Assert
        const ride = await rideRepository.getRide(rideId);
        expect(rideId).toBeDefined();
        expect(ride.status).toBe("requested");
        expect(ride.date).toEqual(requestDate);
    });

    test("should validate if requesting account is a passenger", async () => {
        // Arrange
        const input = {
            passengerId: crypto.randomUUID(),
            from: { lat: 1, long: 1 },
            to: { lat: 1, long: 1 }
        }
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount({ account_id: input.passengerId, is_passenger: false });
        // Act
        const rideService = new RequestRideService(accountRepository, new RideRepository(), new DateProvider());
        await expect(() => rideService.requestRide(input)).rejects.toThrow(new Error("Invalid passenger account"));
    });

    test("should validate if passenger has an incompleted ride", async () => {
        // Arrange
        const input = {
            passengerId: crypto.randomUUID(),
            from: { lat: 1, long: 1 },
            to: { lat: 1, long: 1 }
        }
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount({ account_id: input.passengerId, is_passenger: true });
        // Act
        const rideService = new RequestRideService(accountRepository, new RideRepository(), new DateProvider());
        await rideService.requestRide(input);
        await expect(() => rideService.requestRide(input)).rejects.toThrow(new Error("Passenger has an incompleted ride"));
    });
});
