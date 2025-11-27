import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function findOneByusername(username) {
  const userfound = await runSelectQuery(username);
  return userfound;
}

async function runSelectQuery(username) {
  const results = await database.query({
    text: `
      SELECT
        * 
      FROM 
        users 
      where
        lower(username)  =  lower($1)
      limit 
        1
  
    
      `,
    values: [username],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "o usarname informado nao foi encontrado no sistema",
      action: "verifique se o username está digitado corretamente",
    });
  }
  return results.rows[0];
}

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const result = await database.query({
      text: `
      SELECT
        email 
      FROM users where
        
        lower(email)  =  lower($1)
   
    
      `,
      values: [email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O Email informado já esta sendo utlizado!",
        action: "Utilize outro email para prosseguir.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const result = await database.query({
      text: `
      SELECT
        username 
      FROM users where
        
        lower(username)  =  lower($1)
   
    
      `,
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já esta sendo utlizado!",
        action: "Utilize outro username para prosseguir.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
      INSERT INTO 
        users 
      (username,email,password) 
      VALUES  
        ($1,$2,$3)
   
      RETURNING
      *
      `,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

const user = {
  create,
  findOneByusername,
};
export default user;
