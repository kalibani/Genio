'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { idProps } from '@/lib/validators/interview';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export default async function deleteTemplate(id: z.infer<typeof idProps>) {
  try {
    const safePayload = idProps.parse(id);
    if (!safePayload) {
      return { error: 'please recheck the payload' + { id } };
    }
    const data = await prismadb.interviewTemplate.delete({
      where: { id: safePayload.id },
    });
    revalidatePath('/');
    return data;
  } catch (error) {
    return errorHandler(error);
  }
}
