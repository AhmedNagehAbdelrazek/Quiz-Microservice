const asyncHandler = require("express-async-handler");

const { oauthService } = require("../../business-logic/services");

const ACCESS_TOKEN_EXPIRY = parseInt(process.env.ACCESS_TOKEN_EXPIRY, 10);

const generateToken = asyncHandler(async (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  const token = await oauthService.generateToken(
    grant_type,
    client_id,
    client_secret
  );

  return res.status(200).json({
    access_token: token,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_EXPIRY,
  });
});

module.exports = { generateToken };
