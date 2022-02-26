import mongoose from "mongoose";
import Config from "./Config";

class Database {
    private constructor(){}
    static async connect(){
        const config = new Config();
        try{
            await mongoose.connect(config.DB_URL);
        }
        catch(error){
            throw error;
        }
        console.log(`DB ${config.DB_NAME} connected on port ${config.DB_PORT}`);
    }
}

export default Database;