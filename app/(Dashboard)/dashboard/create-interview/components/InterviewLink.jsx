import styles from "@/app/styles";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect } from "react";

const InterviewLink = ({ interview_id, formData }) => {
  const getInterviewUrl = () => {
    const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview_id;
    return url;
  };
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

      <div className="w-full p-7 mt-6 rounded-xl bg-white">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Interview Link : </h2>
          <h2 className="p-2 px-5 text-blue-500 bg-blue-100 rounded-3xl ">
            Valid For 30 Days
          </h2>
        </div>
        <div className="mt-3" >
          <Input disabled defaultValue={getInterviewUrl()} />
        </div>
      </div>
    </div>
  );
};

export default InterviewLink;
