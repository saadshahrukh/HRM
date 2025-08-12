import styles from "@/app/styles";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Options";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const FormContainer = ({ handleInputChange , goToNext }) => {
  const [interviewType, setInterviewType] = useState([]);

  useEffect(() => {
    if (interviewType) {
      handleInputChange("type", interviewType);
    }
  }, [interviewType]);

  const AddInterviewType = (type) => {
    const data = interviewType.includes(type);
    if (!data) {
      setInterviewType((prev) => [...prev, type]);
    } else {
      const result = interviewType.filter((item) => item != type);
      setInterviewType(result);
    }
  }; 

  return (
    <div className={` bg-white  p-5  rounded-2xl `}>
      <div>
        <h2 className={`${styles.heading3}`}>Job Position</h2>
        <Input
          placeholder="Eg. Full Stack Developer"
          className={`my-5`}
          onChange={(e) => handleInputChange("jobPosition", e.target.value)}
        />
      </div>
      <div className="mt-5">
        <h2 className={`${styles.heading4}`}>Job Description</h2>
        <Textarea
          placeholder="Enter Job Description"
          onChange={(e) => handleInputChange("jobDescription", e.target.value)}
          className={`my-5 h-[200px]`}
        />
      </div>
      <div className="mt-5">
        <h2 className={`${styles.heading4}`}>Interview Duration</h2>
        <Select onValueChange={(value) => handleInputChange("duration", value)}>
          <SelectTrigger className="w-full my-5">
            <SelectValue placeholder="Select Duration Of Interview" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Min">5 Minutes</SelectItem>
            <SelectItem value="15 Min">15 Minutes</SelectItem>
            <SelectItem value="45 Min">45 Minutes</SelectItem>
            <SelectItem value="60 Min">60 Minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-5">
        <h2 className={`${styles.heading4}`}>Interview Type</h2>
        <div className="flex gap-5 my-5">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex gap-5 border-black border-1 rounded-2xl px-5 py-3 cursor-pointer ${
                interviewType.includes(type.title) && "bg-blue-50 text-blue-900"
              }`}
              onClick={() => AddInterviewType(type.title)}
            >
              <type.icon />
              <span> {type.title} </span>
            </div>
          ))}
        </div>
      </div>

          <div className={`${styles.flexCenter} `} onClick={()=>goToNext()} >
            <Button className="py-5" >Generate Questions <PlusIcon/> </Button>
          </div>

    </div>
  );
};

export default FormContainer;
