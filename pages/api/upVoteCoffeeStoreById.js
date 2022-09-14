import {tables, findRecordByFilter } from "../../lib/airtable";

const upVoteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length > 0) {
            const record = records[0];
            const calculateVoting = record.votes + 1;
            console.log({calculateVoting});

            // update Records //
            const updateRecords = await tables.update([
                {
                    "id": record.recordId,
                    "fields":{
                        "votes":calculateVoting,
                    }
                }
            ]);
            if(updateRecords){
                res.status(200);
                res.json(records);
            }
        }else{
            res.json({message: "Coffee Store Doesn't Exsist",id});
        }
      }else {
          res.status(400);
          res.json({message: "Id is missing"});
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "Something Went Wrong while voting", err });
    }
  }
};

export default upVoteCoffeeStoreById;
