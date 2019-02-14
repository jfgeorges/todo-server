const express = require("express");
const router = express.Router();

const Item = require("../models/Item");

// Attribue le nouvel ordre de l'item
const updateOrder = async newListOrder => {
  // map array to promises
  const promises = newListOrder.map((item, i) => {
    return new Promise(async (resolve, reject) => {
      const result = await Item.findOneAndUpdate({ _id: item._id }, { order: i });
      resolve(true);
    });
  });
  // wait until all promises are resolved
  await Promise.all(promises);
  return true;
};

// ------ //
// CREATE //
// ------ //
router.post("/create", async (req, res) => {
  try {
    const numOrder = await Item.countDocuments({}, (err, nbItems) => {
      return nbItems + 1;
    });
    console.log("numOrder: " + numOrder);
    const item = new Item({
      title: req.body.title,
      order: numOrder
    });

    await item.save();
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(400).json({
      message: `Route Create Item: ${error.message}`
    });
  }
});
// --- //
// GET //
// --- //
router.get("/", async (req, res) => {
  try {
    // Récupère tous les items
    const items = await Item.find();

    res.json(items);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});
// ------ //
// UPDATE //
// ------ //
router.post("/update", async (req, res) => {
  if (req.body.action === "order") {
    await updateOrder(req.body.newListOrder);
    const items = await Item.find();
    res.json(items);
  } else {
    // action === "check"
    try {
      const item = await Item.findById(req.body.id);
      // Si l'item est trouvé
      if (item) {
        item.done = req.body.done;

        await item.save();
        const items = await Item.find();
        res.json(items);
      } else {
        res.status(400).json({
          message: "Item not found"
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
});

// ------ //
// DELETE //
// ------ //
router.post("/delete", async (req, res) => {
  try {
    const item = await Item.findById(req.body.id);
    if (item) {
      await item.remove();
      const items = await Item.find();
      res.json(items);
    } else {
      res.status(400).json({
        message: "Item not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;
