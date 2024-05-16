'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mails } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const DetailJobSendEmail = () => {
  const emailContent =
    'Dear {{CANDIDATE_FIRST_NAME}}, We hope this email finds you well. We are pleased to inform you that after careful consideration of your application and interview performance, you have been shortlisted for the {{JOB_TITLE}} position at {{JOB_COMPANY}}. Your qualifications and experience stood out and we believe that your skills align well with the requirements of the role. We feel confident that your contributions would greatly benefit our team. Congratulations on reaching this stage, and we look forward to the possibility of welcoming you to our team. Best regards, Skima Team';
  const dummyReceiver = ['Maul', 'Agus', 'Tatang'];
  const [value, setValue] = useState(emailContent);
  const form = useForm();
  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });
  return (
    <section className="flex flex-col gap-y-12 py-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-[16px] font-semibold text-black">Send Email</h1>
        <div className="flex gap-x-2">
          <p className="text-sm text-black">Send to: </p>
          {dummyReceiver.map((receiver, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded border border-gray-300 px-2 text-xs text-slate-400"
            >
              {receiver}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <h1 className="text-[16px] font-semibold text-black">
          Configure Email
        </h1>
        <div className="flex w-full gap-x-4">
          <ReactQuill
            //@ts-ignore
            theme="snow"
            value={value}
            onChange={setValue}
            className="h-[387px] w-1/2"
          />
          <div className="flex w-1/2 flex-col">
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className="flex w-full flex-col gap-y-4"
              >
                <div className="flex w-full gap-x-3">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>From *</FormLabel>
                        <FormControl>
                          <Input required placeholder="From" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="replyTo"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Reply to :</FormLabel>
                        <FormControl>
                          <Input required placeholder="Reply to" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full gap-x-3">
                  <FormField
                    control={form.control}
                    name="cc"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>CC</FormLabel>
                        <FormControl>
                          <Input placeholder="CC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bcc"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>BCC</FormLabel>
                        <FormControl>
                          <Input placeholder="BCC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Subject Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Subject Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-x-4">
                      <FormLabel className="mt-2">
                        Attach Job Description* ?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          orientation="horizontal"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center justify-center gap-x-2"
                        >
                          <FormItem className="flex items-center justify-center gap-x-2">
                            <FormControl>
                              <RadioGroupItem value={'Yes'} />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              Yes
                            </span>
                          </FormItem>
                          <FormItem className="flex items-center justify-center gap-x-2">
                            <FormControl>
                              <RadioGroupItem value="No" />
                            </FormControl>
                            <span className="!mt-0 text-xs font-normal">
                              No
                            </span>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full flex-col gap-y-3">
                  <FormLabel className="text-sm">Placeholders :</FormLabel>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      CANDIDATE_FIRST_NAME
                    </div>
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      CANDIDATE_LAST_NAME
                    </div>
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      CANDIDATE_FULL_NAME
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-y-3">
                  <FormLabel className="text-sm">Links :</FormLabel>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      ACCEPT_LINK
                    </div>
                    <div className="w-fit rounded-lg bg-slate-300 p-1 text-sm font-medium text-slate-500">
                      REJECT_LINK
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      Add Link +
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-x-4">
                  <Button className="flex gap-x-2">
                    <Mails /> Send Email
                  </Button>
                  <span className="text-xs font-medium text-black underline">
                    Reset
                  </span>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailJobSendEmail;
