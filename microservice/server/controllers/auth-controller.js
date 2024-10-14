const asyncHandler = require("express-async-handler");

const { authService } = require("../../business-logic/services");

const generateAccessToken = asyncHandler(async (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  const token = await authService.generateAccessToken(
    grant_type,
    client_id,
    client_secret
  );

  return res.status(200).json({
    access_token: token,
    token_type: "Bearer",
    expires_in: 3600,
  });
});

module.exports = { generateAccessToken };
