import {findRecordByFilter} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
    const {id} = req.query;

    try{
        if(id){
            const records = await findRecordByFilter(id);
            if(records.length > 0){
                res.status(200);
            res.json(records);

            }
        }else{
            res.status(500);
            res.json({message: "Id can't be found."});
        }
    }catch(err){
        console.log("Something Went Wrong", err);
    }
}

export default getCoffeeStoreById;