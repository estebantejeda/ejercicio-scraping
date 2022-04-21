import * as dotenv from "dotenv";
import path from "path";

class Database {
	readonly #DB_USER: string;
	readonly #DB_PASS: string;
	readonly #DB_HOST: string;
	readonly #DB_PORT: string;
	readonly #DB_NAME: string;

	constructor() {
		dotenv.config({path: path.resolve(__dirname, "../../.env")});
		this.#DB_USER = process.env["DB_USER"] || "root";
		this.#DB_PASS = process.env["DB_PASS"] || "toor";
		this.#DB_HOST =  process.env["DB_HOST"] || "127.0.0.1";
		this.#DB_PORT = process.env["DB_PORT"] || "27017";
		this.#DB_NAME = process.env["DB_NAME"] ||"resiliencia";
	}

	get DB_USER() {
		return this.#DB_USER;
	}

	get DB_PASS() {
		return this.#DB_PASS;
	}

	get DB_HOST() {
		return this.#DB_HOST;
	}

	get DB_PORT() {
		return this.#DB_PORT;
	}

	get DB_NAME() {
		return this.#DB_NAME;
	}

}

export default Database;