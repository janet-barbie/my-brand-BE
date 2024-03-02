import { Request, Response } from "express";
import Query from "../models/query";
import { validateQuery } from "../validation";

//post query
export const newQuery = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
    try {
      const valid = validateQuery(req.body);
      if (valid.error) {
        res.status(400).json({
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

       return res.status(500).json({ error: "Internal Server Error" });
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
   //  return res.status(500).json({ error: "Internal Server Error" });
  }
};
//get all queries
export const getQueries = async (req: Request, res: Response) => {
  try {
    const queries = await Query.find();
    console.log(queries)
    // res.send(queries);
    return res.status(200).json({queries: queries });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
//delete queries
export const deleteQuery = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedQuery = await Query.deleteOne({ _id: id });
    if (deletedQuery.deletedCount === 0) {
      return res.status(404).json({ error: "query doesn't exist!" });
    }
    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
