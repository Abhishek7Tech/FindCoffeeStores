export default function  ilovedogs (req ,res) {
   const breed = req.query.breed;
   res.status(200).json({message: `I love ${breed}`});
}