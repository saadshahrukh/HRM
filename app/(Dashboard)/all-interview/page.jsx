"use client"

import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supaBaseClient';
import { Camera, Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import InterviewCard from '../dashboard/components/InterviewCard';
import { useUser } from '@/app/Provider';

const AllInterview = () => {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    let { data: Interviews, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("userEmail", user?.email)
      .order("id",{ascending:false})
     

    console.log("interviews lists",Interviews);
    setInterviewList(Interviews);
  };

  return (
    <div className="my-5">
      <h2 className="text-2xl font-bold py-5 ">
        All Created Interviews
      </h2>

      {interviewList?.length == 0 && (
        <div className="flex flex-col gap-3 items-center bg-white mt-5 p-5">
          <Camera className="h-10 w-10 text-primary" />
          <h2 className="flex gap-2 p-4">
            You Don't created any Interview Yet{" "}
          </h2>
          <Link href={"dashboard/create-interview"}>
            <Button>
              {" "}
              <Plus/> Create New Interview{" "}
            </Button>{" "}
          </Link>
        </div>
      )}
{/* for the created interviews */}
      {interviewList && 
      
      <div className="grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3" >
        {interviewList.map((interview,index)=>(
          <InterviewCard  interview={interview} key={index} />
        ))}
      </div>
      
      }
    </div>
  );
}

export default AllInterview