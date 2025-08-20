"use client"

import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { Clock, Clock1, Info, Loader2Icon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import styles from "@/app/styles";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supaBaseClient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";

const Interview = () => {

const {interview_id} = useParams()


// console.log(interview_id)
const [interviewData , setInterviewData] = useState();
const {interviewInfo , setInterviewInfo} = useContext(InterviewDataContext);
const [userEmail, setUserEmail] = useState()
const [userName , setUserName] = useState();
const [loading , setLoading] = useState(false)
const router = useRouter()

useEffect(()=>{  

interview_id&&GetInterviewDetails();

},[interview_id])

// console.log(interviewData)
const GetInterviewDetails = async () => { 
        setLoading(true)
    try{

    let { data: Interviews, error } = await supabase
  .from('Interviews')
  .select("jobPosition,jobDescription,duration,type")
  .eq('interview_id', interview_id)
setInterviewData(Interviews[0]) 

setLoading(false);
if(!Interviews || Interviews.length===0) {
   toast("Incorrect Interview Link");
    return;
}
} catch(e){
setLoading(false)
toast("Incorrect Interview Link") 
}
}


const onJoinInterview = async () => { 

    setLoading(true);
    let { data: Interviews, error } = await supabase
  .from('Interviews')
  .select("*")
   .eq('interview_id', interview_id)

   console.log(Interviews[0])
   setInterviewInfo({
    userName : userName,
    userEmail: userEmail,
    interviewData: Interviews[0]
   });
   router.push('/interview/'+interview_id+'/start')
setLoading(false);

}

  return (
    <div className="px-10 md:px-28 lg:px-94  py-20  ">
      <div className="flex  flex-col justify-center items-center border rounded-3xl bg-white p-7 lg:px-43 xl:px-56 ">
        <Image
          src={"/logo.webp"}
          width={90}
          height={90}
          className="w-[180px]"
          alt="logo"
        />

        <h2 className="mt-3 text-gray-500">AI-Powered Interview Platform</h2>
        <Image
          src={"/interview.jpg"}
          width={500}
          height={500}
          alt="interview"
          className="w-[450px] my-6"
        />

        <h2 className="font-bold text-xl mt-3">
        Job Position :  {interviewData?.jobPosition || "N/A"}
        </h2>
        <h2 className="flex gap-2 items-center text-gray-500  mt-3 font-bold ">
          {" "}
          <Clock className="h-4 w-4" /> : {interviewData?.duration || "Not Found"}
        </h2>

        <div className="w-full ">
          <h2 className={`${styles.heading3} `}>Enter Your Full name</h2>
          <Input placeholder="e.g John Doe"  onChange={(event)=>{setUserName(event.target.value)}} className="mt-3" />
        </div>

         <div className="w-full mt-3 ">
          <h2 className={`${styles.heading3} `}>Enter Your Email</h2>
          <Input placeholder="e.g john@gmail.com"  onChange={(event)=>{setUserEmail(event.target.value)}} className="mt-3" />
        </div>

        <div className="bg-blue-100 flex p-5 gap-5 rounded-2xl mt-5 w-full" >
            <Info className="text-primary" />
         <div className="" >
          <h2 className="font-bold">Before You Begin</h2>
          <ul className="">
            <li className="text-sm text-blue-600">- Ensure you have a stable internet connection </li>
            <li className="text-sm text-blue-600">- Test your camera and microphone </li>
            <li className="text-sm text-blue-600">- Find a quite place for interview </li>
          </ul>
          </div>
        </div>

    <Button className={'my-5 w-full font-bold'} disabled={loading || !userName }  onClick={()=>onJoinInterview()} > <Video /> {loading&&<Loader2Icon   />} Join Interview </Button>

      </div>


    </div>
  );
};

export default Interview;
