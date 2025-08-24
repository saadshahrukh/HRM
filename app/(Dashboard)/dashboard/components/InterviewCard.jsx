import { Button } from "@/components/ui/button";
import { Copy, Send } from "lucide-react";
import moment from "moment/moment";
import React from "react";
import { toast } from "sonner";

const InterviewCard = ({ interview }) => {

    const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview?.interview_id
    const onCopyLink = () => { 
        navigator.clipboard.writeText(url)
        toast("Copied")
    }

    const onSubmit = ()=>{
        window.location.href="mailto:saadshahrukh141@gmail.com?subject=AI interview Link & body=Interview Link : "+url+" <br/> Thanks And Regards "
    }

  return (
    <div className="p-5 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="h-[40px] w-[40px] bg-primary rounded-full  "></div>
        <h2 className="text-sm font-semibold">
          {moment(interview?.created_at).format("MMM Do YYYY")}
        </h2>
      </div>
      <h2 className="mt-3 font-bold text-lg">{interview?.jobPosition}</h2>
      <h2 className="mt-3 text-lg text-blue-500">{interview?.duration}</h2>

      <div className="flex gap-3 w-full mt-5">
        <Button className="w-[50%]" variant="outline"  onClick={onCopyLink} >
          {" "}
          <Copy /> Copy{" "}
        </Button>
        <Button className="w-[50%]" onClick={onSubmit} >
          {" "}
          <Send /> Send{" "}
        </Button>
      </div>
    </div>
  );
};

export default InterviewCard;
