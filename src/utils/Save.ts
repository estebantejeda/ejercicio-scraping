import path from "path";
import fs from "fs";

class Save {
	static saveCsv(data: string, name?: string) {
		name = name || "data2csv";
		const dir = path.resolve(__dirname, "../public");
		const file = `${dir}/${name}.csv`;
		if(!fs.existsSync(dir)) fs.mkdirSync(dir);
		fs.writeFileSync(file, data);
		console.log("CSV saved");
	}
}

export default Save;