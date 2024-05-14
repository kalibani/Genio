'use server';
import CreateStep from '@/components/job/create-job/create-step';
import { SectionWrap } from '@/components/share';
import { NextPage } from 'next';
import { ReactElement } from 'react';

const CreateNewJob: NextPage = (): ReactElement => {
  return (
    <SectionWrap className="h-[calc(100%-57px)]">
      <CreateStep />
    </SectionWrap>
  );
};

export default CreateNewJob;
