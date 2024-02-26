import { Request, Response } from "express";
import Query from "../models/query";
import { validateQuery } from "../validation";

//post query
export const newQuery = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  try {
    const valid = validateQuery(req.body);
    if (valid.error) {
      res.status(404).json({
        error: valid.error.details[0].message,
      });
    }
    const queries = new Query({
      name,
      email,
      message,
    });
    await queries.save();
    //res.send(query);
    return res.status(200).json({ queries: queries });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
//get query
export const getQuery = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const queries = await Query.findOne({ _id: id });
    if (!queries) {
      return res.status(404).json({ error: "Query doesn't exist" });
      //res.status(404).send({ error: "Query doesn't exist!" });
      //return;
    }
    // res.send(queries);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
//get all queries
export const getQueries = async (req: Request, res: Response) => {
  try {
    const queries = await Query.find();
    res.send(queries);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
