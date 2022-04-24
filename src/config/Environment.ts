import path from "path";
import NodeEnvType from "../enums/NodeEnvType";
import * as dotenv from "dotenv";

class Environment {
	readonly #PORT: number;
	readonly #NODE_ENV: NodeEnvType;

	constructor() {
		dotenv.config({path: path.resolve(__dirname, "../../.env")});
		this.#PORT = parseInt(process.env["PORT"]!) || 3000;
		this.#NODE_ENV = NodeEnvType.PRODUCTION;
	}

	get PORT() {
		return this.#PORT;
	}

	get NODE_ENV() {
		return this.#NODE_ENV;
	}
    
}

export default Environment;