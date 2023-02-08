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

const client = new PlaidApi(configuration);


//const misc = require("../api/misc");






// @Route   POST /api/v1/plaid/link/token/create
// @Desc    sync mongo and firebase
// @Access  Requires Client ID and secret for authentication
router.post(
    "/link/token/create",
    [
        check("client_id", "Invalid Client ID").not().isEmpty(),
        check("client_secret", "Invalid Client Secret").not().isEmpty(),
        check("firebase_id", "Firebase UID is required").not().isEmpty(),

    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        var {
            client_id,
            client_secret,
            firebase_id,
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


            const currentUser = await User.findOne({
                firebase_id: firebase_id,
            });

            if (!currentUser) {
                return res.status(400).send({ error: "Invalid Firebase ID" });
            }


            const request = {
                user: {
                    // This should correspond to a unique id for the current user.
                    client_user_id: firebase_id,
                },
                client_name: 'Plaid Test App',
                products: ['auth'],
                language: 'en',
                webhook: 'https://webhook.example.com',
                redirect_uri: 'http://localhost:3000/api/plaid/redirect',
                country_codes: ['US'],
            };

            const createTokenResponse = await client.linkTokenCreate(request);
            return res.json(createTokenResponse.data);

        } catch (err) {
            console.error(err.message);
            res.status(500).send({ error: `something went wrong : ${err.message}` });
        }
    }
);


module.exports = router;