import styles from "@/app/styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, Clock, Copy, List, Mail, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { FaWhatsapp, FaSlack } from "react-icons/fa";
import { toast } from "sonner";

const InterviewLink = ({ interview_id, formData }) => {
      const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview_id;

  const getInterviewUrl = () => {
    return url;

     
  };

   const onCopy = async() => {
    await navigator.clipboard.writeText(url) ;
    toast('Link Copied')  ;
  }
  useEffect(() => {
    if (interview_id) {
      getInterviewUrl();
    }
  }, [interview_id]);





  return (
    <div className="p-5 w-full justify-center items-center flex flex-col">
      <Image src={"/logo.webp"} alt="Check icon" width={200} height={200} />
      <h2 className={`${styles.heading2}mt-3 `}>Your Ai-Interview is Ready</h2>
      <p className="mt-3">Share This link with Your Candidate</p>

      <div className="w-full p-7 mt-6 rounded-xl bg-white ">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Interview Link : </h2>
          <h2 className="p-2 px-5 text-blue-500 bg-blue-100 rounded-3xl ">
            Valid For 30 Days
          </h2>
        </div>
        <div className="mt-3 flex gap-3">
          <Input disabled defaultValue={getInterviewUrl()} />
          <Button  onClick={()=>onCopy()}>
            
            <Copy /> Copy Link
          </Button>
        </div>
        <hr className="my-8" />

        <div className="flex  justify-evenly">
          <h2 className="text-sm text-gray-500 flex gap-2 items-start ">
            <Clock className="h-4 w-4" /> {formData?.duration || "5"} Mins{" "}
          </h2>
          <h2 className="text-sm text-gray-500 flex gap-2 items-start ">
            <List className="h-4 w-4" /> {formData?.duration || "10"} Questions{" "}
          </h2>

          <h2 className="text-sm text-gray-500 flex gap-2 items-start ">
            <Calendar className="h-4 w-4" /> {formData?.duration || "N/A"}{" "}
          </h2>
        </div>
      </div>
  
      <div className="w-full p-7 mt-6 rounded-xl bg-white">
         <h1 className={`${styles.heading2} my-5 `} >Share Via</h1> 
        <div className="w-full  flex justify-around  gap-5 max-w-full  overflow-hidden" >
      
        <Button variant={"outline"} className='w-[30%]'>
          <Mail /> Email
        </Button>
        <Button variant={"outline"} className='w-[30%]' >
          <FaSlack /> Slack
        </Button>

        <Button variant={"outline"} className='w-[30%]' >
          <FaWhatsapp /> Whatsapp
        </Button>
        </div>
      </div>


    <div className="flex w-full gap-5 justify-between mt-10" >
    <Link href={"/dashboard"} >  <Button variant={'outline'}   > <ArrowLeft  /> Back to Dashboard  </Button> </Link>
    <Link  href={"/create-interview"} >  <Button  > <Plus /> Create New Interview </Button> </Link>
    </div>

    </div>
  );
};

export default InterviewLink;
