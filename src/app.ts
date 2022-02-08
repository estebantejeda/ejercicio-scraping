import Getter from "./helpers/Getter";

const URL = "https://www.bcn.cl/siit/reportescomunales/comunas_v.html?anno=2020&idcom=14101";

const main = async () =>{
    let getter = await Getter.build(URL);
    getter.save();
};

main();