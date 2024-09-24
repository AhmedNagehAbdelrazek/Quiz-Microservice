const { oauthService } = require("../../business-logic/services");
const { ValidationError } = require("../../business-logic/errors/common");
const {
  UnsupportedGrantTypeError,
  InvalidClientError,
  DisabledClientError,
} = require("../../business-logic/errors/oauth");

const ACCESS_TOKEN_EXPIRY = parseInt(process.env.ACCESS_TOKEN_EXPIRY, 10);

const generateToken = async (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  try {
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
  } catch (e) {
    let statusCode = 500;
    let error = "server_error";
    let error_description = "An unexpected error occurred on the server.";

    if (e instanceof ValidationError) {
      statusCode = 400;
      error = "invalid_request";
      error_description = e.message;
    }

    if (e instanceof UnsupportedGrantTypeError) {
      statusCode = 400;
      error = "unsupported_grant_type";
      error_description = e.message;
    }

    if (e instanceof InvalidClientError) {
      statusCode = 401;
      error = "invalid_client";
      error_description = e.message;
    }

    if (e instanceof DisabledClientError) {
      statusCode = 401;
      error = "unsupported_disabled_client";
      error_description = e.message;
    }

    if (statusCode === 500) {
      console.log(e);
    }

    return res.status(statusCode).json({
      error,
      error_description,
    });
  }
};

module.exports = { generateToken };
