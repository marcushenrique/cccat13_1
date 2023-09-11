import pgPromise from "pg-promise";
import { Ride } from "./types";

export default class RideRepository {

    async getRide(rideId: string): Promise<Ride> {
        const connection = pgPromise()("postgres://postgres:root@localhost:5432/postgres");
        try {
            const [ride] = await connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
            return ride;
        } finally {
            connection.$pool.end();
        }
    }

    async getLastRide(passengerId: string): Promise<Ride> {
        const connection = pgPromise()("postgres://postgres:root@localhost:5432/postgres");
        try {
            const [ride] = await connection.query("select * from cccat13.ride where passenger_id = $1 order by date desc limit 1", [passengerId]);
            return ride;
        } finally {
            connection.$pool.end();
        };
    }

    async addRide(ride: Ride) {
        const pgp = pgPromise()
        const insertQuery = pgp.helpers.insert(ride, null, new pgp.helpers.TableName({ table: "ride", schema: "cccat13" }));
        const connection = pgp("postgres://postgres:root@localhost:5432/postgres");
        try {
            await connection.none(insertQuery);
            return ride.ride_id;
        } finally {
            connection.$pool.end();
        }
    }
}