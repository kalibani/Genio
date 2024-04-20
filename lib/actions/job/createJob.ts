'use server';

import { errorHandler } from '@/helpers';
import prismadb from '@/lib/prismadb';
import { WORK_MODEL } from '@prisma/client';
import z from 'zod';
import { uploadCv } from '../cv/uploadCv';
import { v4 as uuidv4 } from 'uuid';
import { analyzeCv } from '../cv/analyzeCv';
const PayloadAddJob = z.object({
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

const connectCvJob = async ({
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

export const createJob = async (
  payload: z.infer<typeof PayloadAddJob>,
  cv: FormData,
) => {
  try {
    const cvData = cv.getAll('UPLOAD') as File[];
    const cvLinkedin = cv.getAll('LINKEDIN') as string[];

    const { analyzeCv, ...safePayload } = PayloadAddJob.parse(payload);
    const job = await prismadb.batchJob.create({
      data: {
        ...safePayload,
      },
    });

    const onSuccess = (props: { id: string; url: string; key: string }) => {
      connectCvJob({
        cvId: props.id,
        orgId: safePayload.orgId,
        batchJobId: job.id,
        analyzeCvEnabled: analyzeCv,
      });
    };
    cvData.forEach((cv) => {
      uploadCv({ cv, source: 'UPLOAD', orgId: payload.orgId }, onSuccess);
    });
    cvLinkedin.forEach((cv) => {
      uploadCv({ cv, source: 'LINKEDIN', orgId: payload.orgId }, onSuccess);
    });
  } catch (error) {
    return errorHandler(error);
  }
};