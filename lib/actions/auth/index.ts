'use server';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema, NewPasswordSchema, RegisterSchema, ResetSchema } from '@/lib/validators/auth';
import { signIn } from '@/auth';
import { z } from 'zod';
import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { PACKAGE_TYPE } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { sendPasswordResetEmail } from '@/lib/mail';
import { v4 as uuidv4 } from 'uuid';

export const userLoginAction = async (payload: z.infer<typeof LoginSchema>) => {
  try {
    const validatedField = LoginSchema.parse(payload);
    const { email, password } = validatedField;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: 'Email does not exist!' };
    }
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
			switch ((error as any).type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials!" };
				default:
					return { error: "Something went wrong!" };
			}
		}
		throw error;
  }
};

export const userRegisterAction = async (
  payload: z.infer<typeof RegisterSchema>
) => {
  try {
    const validatedField = RegisterSchema.parse(payload);
    const { email, password, name } = validatedField;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: 'Email already in use!' };
    }

    await prismadb.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      await tx.organization.create({
        data: {
          name: name,
          packageType: PACKAGE_TYPE.BASIC,
          limit: 100,
          used: 0,
          agreeTermAndCondition: true,
          userOrganization: {
            create: {
              userId: newUser.id,
              roleId: 'OWNER',
            },
          },
        },
      });
    });

    await userLoginAction({ email, password });
    // return { success: 'Confirmation email sent!' };
  } catch (error:unknown) {
     if (error instanceof AuthError) {
			switch ((error as any).type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials!" };
				default:
					return { error: "Something went wrong!" };
			}
		}
		throw error;
  }
};



export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prismadb.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prismadb.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error: 'Token does not exist!',
    }
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return{
      error: 'Token has expired!',
    }
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return{
      error: 'Email does not exist!',
    }
  }

  await prismadb.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prismadb.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Email verified!' };
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prismadb.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prismadb.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

export const resetPasswordAction = async (input: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(input);

  if (!validatedFields.success) {
    return{
      error: 'Invalid emaiL!',
    }
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return{
      error: 'Email does not exist!',
    }
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: 'Reset email sent!' };
};

export const newPasswordAction = async (
  values: z.infer<typeof NewPasswordSchema>
) => {
  if (!values.token) {
    return{
      error: 'Missing token!',
    }
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return{
      error: 'Invalid fields!',
    }
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(values.token);

  if (!existingToken) {
    return{
      error: 'Invalid token!',
    }
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return{
      error: 'Token has expired!',
    }
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return{
      error: 'Email does not exist!',
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prismadb.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prismadb.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Password updated!' };
};
