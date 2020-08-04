import express from "express";
import ClassesController from "./controllers/ClassesController";
import ConnectionController from "./controllers/ConnectionController";
const routes = express.Router();
const classesControllers = new ClassesController();
const connectionControllers = new ConnectionController();
routes.get("/", (req, res) => {
    return res.json({
        nome: "API Proffy",
        version: "1.0",
        author: "Francisco Cajlon"
    });
});

routes.post("/classes", classesControllers.create );
routes.get("/classes", classesControllers.index );
routes.post("/connection", connectionControllers.create);
routes.get("/connection", connectionControllers.index);

export default routes;