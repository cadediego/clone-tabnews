import email from "infra/email.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";
import { NotFoundError } from "infra/errors.js";
import user from "models/user.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000;

async function findOneValidById(tokenId) {
  const activationTokenId = await runSelectQuery(tokenId);
  return activationTokenId;
  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
      SELECT
        * 
      FROM 
        user_activation_tokens 
      where
        id  =  $1
         and expires_at > NOW()
         and used_at IS NULL
      limit 
        1
  
    
      `,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "o token informado nao foi encontrado no sistema",
        action: "verifique se o token está digitado corretamente",
      });
    }
    return results.rows[0];
  }
}

async function markTokenAsUsed(activationTokenId) {
  const usedActivationToken = await runUpdateQuery(activationTokenId);
  return usedActivationToken;

  async function runUpdateQuery(activationTokenId) {
    const results = await database.query({
      text: `
        UPDATE
          user_activation_tokens
        SET
          used_at = timezone('utc',NOW()),
          updated_at = timezone('utc',NOW())
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      values: [activationTokenId],
    });

    return results.rows[0];
  }
}

async function activateUserByUserId(userId) {
  const activatedUser = await user.setFeatures(userId, [
    "create:session",
    "read:session",
  ]);
  return activatedUser;
}

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const result = await database.query({
      text: `
      INSERT INTO 
        user_activation_tokens 
      (user_id,expires_at) 
      VALUES  
        ($1,$2)
   
      RETURNING
      *
      `,
      values: [userId, expiresAt],
    });

    return result.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "<contato@fintab.com.br>",
    to: user.email,
    subject: "Ative seu cadastro no FinTab",
    text: `${user.username} clique no link abaixo para ativar o seu cadastro no FinTab

    ${webserver.origin}/cadastro/ativar/${activationToken.id}
    
    `,
  });
}

const activation = {
  sendEmailToUser,
  create,
  findOneValidById,
  markTokenAsUsed,
  activateUserByUserId,
};

export default activation;
