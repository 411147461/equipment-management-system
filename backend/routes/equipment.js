const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

    const equipments = [
        {
            id: 1,
            name: "Arduino UNO",
            status: "可借用"
        },
        {
            id: 2,
            name: "Raspberry Pi 5",
            status: "借出中"
        }
    ];

    res.json(equipments);

});

module.exports = router;