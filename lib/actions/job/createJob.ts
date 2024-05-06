import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { WORK_MODEL } from '@prisma/client';
import z from 'zod';
import { uploadCv } from '../cv/uploadCv';
import { analyzeCv } from '../cv/analyzeCv';

export const PayloadAddJob = z.object({
  jobName: z.string(),
  location: z.string(),
  salaryCurrency: z.string(),
  salaryRangeFrom: z.number().optional(),
  salaryRangeEnd: z.number().optional(),
  experience: z.number(),
  workModel: z.enum([WORK_MODEL.HYBRID, WORK_MODEL.ONSITE, WORK_MODEL.REMOTE]),
  jobDescription: z.string(),
  companyName: z.string().optional(),
  orgId: z.string(),
  analyzeCv: z.boolean(),
});

export const connectCvJob = async ({
  cvId,
  orgId,
  batchJobId,
  analyzeCvEnabled,
}: {
  cvId: string;
  orgId: string;
  batchJobId: string;
  analyzeCvEnabled: boolean;
}) => {
  try {
    const cvAnalyze = await prismadb.cvAnalysis.create({
      data: {
        cvId,
        orgId,
        batchJobId,
      },
    });
    if (analyzeCvEnabled) {
      analyzeCv({ cvAnalysisId: cvAnalyze.id, jobId: batchJobId });
    }
  } catch (error) {
    return errorHandler(error);
  }
};
