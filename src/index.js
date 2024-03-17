import App from "./App.js";
import { config } from "./config/index.js";

const port = config.PORT ||  4000;

App.listen(port, () => {
    console.log(`Servidor Corriendo con Cors en: http://localhost:${port}/api/`);
})