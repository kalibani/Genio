import { ParamsProps } from '@/types/types';
import { redirect } from 'next/navigation';
import page from '../bank-statement-analyzer/page';

const CommingSoon = ({ params }: ParamsProps) => {
  {
    /* <CandidateView /> */
  }
  redirect(`/${params.orgId}/coming-soon`);
};

export default CommingSoon;
