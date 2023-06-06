import express from "express";
import {
    addMenu,
    deleteMenu,
    getAllMenu,
    getOneMenu,
    updateMenu
} from "../services/menuService";
import {getOnePost} from "../services/postServices";

const router = express.Router();

router.get("/", async (req, res) => {
    console.log('------------- getMENUS');
    try {
        const menus = await getAllMenu();
        res.send(menus);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }
});

router.get("/:id", async (req, res) => {
    try {
        console.log('------------- req.params.id: ', req.params.id);
        const menu = await getOneMenu(req.params.id);
        console.log('------------ menu: ', menu);
        res.send(menu);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }
});

router.post("/create", async (req, res) => {
    console.log('------------- Thêm mới MENU');
    try {
        const result = await addMenu(req.body.menu);
        res.send(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }
});

router.put("/", async (req, res) => {
  try {
    const result = await updateMenu(req.body.menu);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteMenu(req.params.id);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

export default router;
