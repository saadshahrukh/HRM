"use client"

import { useUser } from '@/app/Provider';
import { supabase } from '@/services/supaBaseClient';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InterviewDetailsContainer from './components/InterviewDetailsContainer';
import CandidateList from './components/CandidateList';

const InterviewDetail  = () => {
            const {user} = useUser();
    
    const {interview_id} = useParams();
    const [interviewDetail , setInterviewDetail] = useState()

     useEffect(()=>{
    
                    user && InterviewDetail();
            },[user])
    const InterviewDetail = async ()=> {
         const result = await supabase.from('Interviews')
                .select(`jobPosition,duration,jobDescription,type,questionList,interview_id,created_at,
                    interview-feedback(userEmail, userName ,feedback ,created_at)`)
                .eq('userEmail', user?.email)
                .eq('interview_id', interview_id)
                // .order('id' ,{ascending:false})
                setInterviewDetail(result?.data[0])
                console.log(result)
    }
  return (
    <div>
        <h2>Interview Details</h2>

        <InterviewDetailsContainer  interviewDetail= {interviewDetail} />

                        <CandidateList CandidateList={interviewDetail?.['interview-feedback']}  />

    </div>
  )
}

export default InterviewDetail 