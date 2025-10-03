const express = require("express");
const router = express.Router();

module.exports = () => {
    const indexRouter = express.Router();
    indexRouter.get("/", (req, res) => {
        res.status(200).json({ response: "Mongo API is working properly." });
    });

    const requestsRouter = express.Router();
    //Import Controllers
    const n8nController = require("../controllers/n8n/consultar");

    //N8n
    requestsRouter.post("/n8n/consultar", n8nController);
   


    router.use("/", indexRouter);
    router.use("/", requestsRouter);

    return router;
}