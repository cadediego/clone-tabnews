import user from "models/user.js";
import password from "models/password.js";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByemail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);
    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de Autenticação não conferem.",
        action: "verifique se os dados enviados estão corretos",
      });
    }
    throw error;
  }

  async function findUserByemail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByemail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email não confere",
          action: "verifique se este dados esta correto",
        });
      }

      throw error;
    }

    return storedUser;
  }

  async function validatePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere",
        action: "verifique se este dados esta correto",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
