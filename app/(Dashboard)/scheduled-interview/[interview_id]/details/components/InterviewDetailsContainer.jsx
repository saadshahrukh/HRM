import { AlarmClock, Calendar, Clock, MessageCircleCodeIcon, MessageCircleIcon } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import CandidateList from './CandidateList'

const InterviewDetailsContainer = ({interviewDetail}) => {
  return (
    <div className='p-5 bg-white rounded-lg mt-5' >
        <h2>{interviewDetail?.jobPosition}</h2> 
        <div className='mt-4 flex items-center justify-between  pr-52' >
            <div  >
                    <h2 className='text-gray-500 text-sm' >Duration</h2>
                    <h2 className='flex text-sm font-bold items-center gap-3'> <Clock /> {interviewDetail?.duration} </h2>
            </div>
             <div  >
                    <h2 className='text-gray-500 text-sm' >Created On</h2>
                    <h2 className='flex text-sm font-bold items-center gap-3' > <Calendar /> {moment(interviewDetail?.created_at).format('DD MMMM YYYY')}</h2>
            </div>
            {interviewDetail?.type && <div  >
                    <h2 className='text-gray-500 text-sm' >Type</h2>
                    <h2 className='flex text-sm font-bold items-center gap-3' >{ JSON.parse( interviewDetail?.type)}</h2>
            </div>
            }

           

        </div>
         <div className='mt-5' >
                <h2 className='font-bold pt-5 ' > Job Description </h2>
                <p className='pt-3  text-sm leading-6' >{interviewDetail?.jobDescription}</p>
            </div>

            <div className='mt-5 ' >
                <h2 className='font-bold pt-5 ' > Interview Questions </h2>
                <div className='grid grid-cols-2 gap-6 mt-3' >
                {interviewDetail?.questionList.map((item , index)=>(
                    <h2 > {index +1}.{item.question}</h2>
                ))}
                </div>
            </div>

    </div>
    
  )
}

export default InterviewDetailsContainer