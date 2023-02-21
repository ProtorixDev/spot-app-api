const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const uniqid = require("uniqid");

const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

const { DateTime } = require("luxon");
const { findOne } = require("../../models/User");
const { jwt: { jwtAccessSecret, jwtRefreshSecret } } = config;

//const misc = require("../api/misc");






// @Route   POST /api/v1/auth/firebase/sync
// @Desc    sync mongo and firebase
// @Access  Requires Client ID and secret for authentication
router.post(
    "/firebase/sync",
    [
        check("firebase_id", "Firebase UID is required").not().isEmpty(),
        check("client_id", "Invalid Client ID").not().isEmpty(),
        check("client_secret", "Invalid Client Secret").not().isEmpty(),
        check("display_name", "Display Name is required").not().isEmpty(),
        check("email", "Email is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        var { firebase_id, client_id, client_secret, display_name, email } = req.body;

        console.log(req.body);

        //check client id and secret
        if (client_id !== process.env.ONBOARD_CLIENT_ID) {
            //save failed attempt
            console.log("Invalid Client ID or Secret");
            return res.status(400).send({ error: "Invalid Client ID or Secret" });

        }

        if (client_secret !== process.env.ONBOARD_CLIENT_SECRET) {
            //save failed attempt
            console.log("Invalid Client ID or Secret");
            return res.status(400).send({ error: "Invalid Client ID or Secret" });
        }

        //lowercase email
        email = email.toLowerCase();
        try {

            const userSync = new User({
                firebase_id,
                display_name,
                email,

            });

            await userSync.save();

            return res.status(200).send({ message: "User Synced", user: userSync });



        } catch (err) {
            console.error(err.message);
            res.status(500).send({ error: `something went wrong : ${err.message}` });
        }
    }
);


module.exports = router;