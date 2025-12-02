import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors.js";
import password from "models/password.js";

async function findOneByusername(username) {
  const userfound = await runSelectQuery(username);
  return userfound;
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
}

async function findOneById(id) {
  const userfound = await runSelectQuery(id);
  return userfound;
  async function runSelectQuery(id) {
    const results = await database.query({
      text: `
      SELECT
        * 
      FROM 
        users 
      where
        id  =  $1
      limit 
        1
  
    
      `,
      values: [id],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "o id informado nao foi encontrado no sistema",
        action: "verifique se o id está digitado corretamente",
      });
    }
    return results.rows[0];
  }
}

async function findOneByemail(email) {
  const userfound = await runSelectQuery(email);
  return userfound;
  async function runSelectQuery(email) {
    const results = await database.query({
      text: `
      SELECT
        * 
      FROM 
        users 
      where
        lower(email)  =  lower($1)
      limit 
        1
  
    
      `,
      values: [email],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "o email informado nao foi encontrado no sistema",
        action: "verifique se o email está digitado corretamente",
      });
    }
    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  await hashPasswordinObject(userInputValues);
  await injectDefaultFeaturesInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function hashPasswordinObject(userInputValues) {
    const hashedPassword = await password.hash(userInputValues.password);
    userInputValues.password = hashedPassword;
  }

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
      INSERT INTO 
        users 
      (username,email,password,features) 
      VALUES  
        ($1,$2,$3,$4)
   
      RETURNING
      *
      `,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
        userInputValues.features,
      ],
    });

    return result.rows[0];
  }

  async function injectDefaultFeaturesInObject(userInputValues) {
    userInputValues.features = ["read:activation_token"];
  }
}

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

async function update(username, userInputValues) {
  const currentUser = await findOneByusername(username);

  if ("username" in userInputValues) {
    const newUsername = userInputValues.username;
    if (username.toLowerCase() !== newUsername.toLowerCase()) {
      await validateUniqueUsername(userInputValues.username);
    }
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
      `,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });

    return results.rows[0];
  }

  return updatedUser;
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

async function setFeatures(userId, features) {
  const updatedUser = await runUpdateQuery(userId, features);
  return updatedUser;

  async function runUpdateQuery(userId, features) {
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          features = $2,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
      `,
      values: [userId, features],
    });

    return results.rows[0];
  }
}

const user = {
  create,
  findOneByusername,
  findOneByemail,
  update,
  setFeatures,
  findOneById,
};
export default user;
