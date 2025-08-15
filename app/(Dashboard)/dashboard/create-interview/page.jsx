"use client";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import styles from "@/app/styles";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import FormContainer from "./components/FormContainer";
import QuestionList from "./components/QuestionList";
import { toast } from "sonner"
import InterviewLink from "./components/InterviewLink";

const CreateInterview = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState();
  const [interviewId, setInterviewId] = useState()
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log("data", formData);

  const onGoToNext = () => {
    if (!formData?.jobPosition || !formData?.jobDescription || !formData?.duration|| !formData?.type ) {
      toast("Please fill all the Fields");
      return ;
    }
    setStep(step+1);
  }

  const onCreateLink = (interview_id)=> {
    setInterviewId(interview_id);
    setStep(step+1);
  }

  return (
    <div className="mt-10 px-50 ">
      <div className={`${styles.flexCenter} gap-5`}>
        <ArrowLeft
          onClick={() => {
            router.back();
          }}
        />
        <h2 className={`${styles.heading3}`}>Create New Interview </h2>
      </div>

      <Progress value={step * 33.33} className="my-5" />
    {step==1 ? <FormContainer handleInputChange={handleInputChange} goToNext={()=> onGoToNext()} />
   : 
  step==2?<QuestionList formData={formData} onCreateLink={ (interview_id)=> onCreateLink(interview_id)} /> : 
  
  step==3? <InterviewLink interview_id={interviewId} formData={formData}  /> : null } 
    </div>
  );
};

export default CreateInterview;
