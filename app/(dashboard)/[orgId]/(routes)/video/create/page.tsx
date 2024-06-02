import FormTemplate from '@/components/interview/form-template';
import getOneTemplateInterview from '@/lib/actions/interview/getOneTemplate';
import { type ParamsProps } from '@/types/types';

const page = async ({ params, searchParams }: ParamsProps) => {
  const dataTemplate = await getOneTemplateInterview(searchParams?.id);
  return (
    <div className="rounded-md bg-white p-4">
      <h3 className="text-2xl font-semibold">{`${searchParams?.id ? 'Edit' : 'Create'} Automatic Interview`}</h3>
      <p className="text-sm font-normal text-slate-400">
        {`${searchParams?.id ? 'Edit' : 'Create'} detail Interview with question here`}
      </p>
      <FormTemplate
        orgId={params.orgId}
        queryId={searchParams.id}
        dataTemplate={searchParams.id ? dataTemplate : null}
      />
    </div>
  );
};

export default page;
