import mongoose from "mongoose";
import DbConfig from "../config/Database";

class Database {
	#dbConfig: DbConfig;

	constructor() {
		this.#dbConfig = new DbConfig();
	}

	#getConnectionString() {
		return `mongodb://${this.#dbConfig.DB_USER}:${this.#dbConfig.DB_PASS}@${this.#dbConfig.DB_HOST}:${this.#dbConfig.DB_PORT}/${this.#dbConfig.DB_NAME}`;
	}

	async connect() {
		const uri = this.#getConnectionString();
		await mongoose.connect(uri);
	}

	async disconnect() {
		await mongoose.disconnect();
	}

}

export default Database;