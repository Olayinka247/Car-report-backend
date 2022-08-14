import jwt from "jsonwebtoken";

// Generate a JWT token for the user
export const generateAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

// Verify a JWT token
export const verifyAccessToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) rej(err);
      else res(payload);
    })
  );
