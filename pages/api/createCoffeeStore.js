import { tables,getMinifiedRecords,findRecordByFilter} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  try {
      //Find a Record //
      //Records sended by the User //
      const {id, name, address, neighbourhood, votes, imgUrl} = req.body;
      if(id){


      
    if (req.method === "POST") {
      const findCoffeeStoreRecords = await findRecordByFilter(id);

      if (findCoffeeStoreRecords.length > 0) {
        res.json(findCoffeeStoreRecords);
      } else {
          //Create a Record //
          if(name){
          
          const createRecords = await tables.create([
              {
                fields: {
                id,
                name,
                address,
                neighbourhood,
                votes,
                imgUrl
              },
            },
          ]);

          const records =  getMinifiedRecords(createRecords);
        res.json({ message: "Create a Record",records });
      }else {
        res.status(400).json({message: "Name is Required⛔"});
      }
    }
    }
  }else {
    res.status(400).json({message: "Id is Required⛔"});
  }
  } catch (err) {
    console.log("Error store not found or created", err);
    res.status(500).json({ message: "Store not found or created", err });
  }
};

export default createCoffeeStore;
