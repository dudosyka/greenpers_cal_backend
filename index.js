import dotenv, {parse} from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import {UserModel} from "./user.model.js";
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false, limit: '50mb', parameterLimit: 1000000}));
app.use(bodyParser.json());

app.get("/get/:month/:jb/:tg/:object", async (req, res) => {
    const user = new UserModel(parseInt(req.params.jb), parseInt(req.params.tg), req.params.object);
    res.send(JSON.stringify(await user.get(parseInt(req.params.month))));
});

app.post('/save/:jb/:tg/:object', async (req, res) => {
    const user = new UserModel(parseInt(req.params.jb), parseInt(req.params.tg), req.params.object);
    await user.save(JSON.parse(req.body.data));
    res.send(true);
})

app.listen(process.env.PORT);