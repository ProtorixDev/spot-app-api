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
const { plaid: { client_id, secret, env } } = config;

const { Configuration, PlaidApi, Products, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
    basePath: PlaidEnvironments[env],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': client_id,
            'PLAID-SECRET': secret,
            'Plaid-Version': '2020-09-14',
        },
    },
});


//const misc = require("../api/misc");






// @Route   POST /api/v1/plaid/link/token/create
// @Desc    sync mongo and firebase
// @Access  Requires Client ID and secret for authentication
router.post(
    "/link/token/create",
    [

    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        var {

        } = req.body;

        //check client id and secret
        if (client_id !== process.env.ONBOARD_CLIENT_ID) {
            //save failed attempt
            return res.status(400).send({ error: "Invalid Client ID or Secret" });
        }

        if (client_secret !== process.env.ONBOARD_CLIENT_SECRET) {
            //save failed attempt
            return res.status(400).send({ error: "Invalid Client ID or Secret" });
        }


        try {





        } catch (err) {
            console.error(err.message);
            res.status(500).send({ error: `something went wrong : ${err.message}` });
        }
    }
);


module.exports = router;