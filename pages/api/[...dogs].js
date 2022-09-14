//Creating a Catch All Routes to be displayed if any route is not defined. It is a default page which will be displayed if request path isn't available //

export default function handler(req, res) {
    res.status(200).json({ name: `I love Dogs` });
  }
  