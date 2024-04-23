import CreateStep from '@/components/job/create-job/create-step'
import TrackingStep from '@/components/job/create-job/tracking-step'
import {SectionWrap} from '@/components/share'
import React from 'react'

const CreateNewJob = () => {
  return (
    <SectionWrap>
      <CreateStep/>
    </SectionWrap>
  )
}

export default CreateNewJob