import { Button } from "@/components/ui/button";
import { Arrow } from "@radix-ui/react-select";
import { ArrowBigLeft, ArrowBigRight, Copy, Send, View } from "lucide-react";
import moment from "moment/moment";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const InterviewCard = ({ interview, viewDetail=false }) => {

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
      <h2 className="mt-3 text-lg text-gray-500 flex justify-between " >{interview?.duration}
        <span className="text-green-600" >{interview['interview-feedback']?.length} Candidates </span>
      </h2>


     {!viewDetail ?  <div className="flex gap-3 w-full mt-5">
        <Button className="w-[50%]" variant="outline"  onClick={onCopyLink} >
          {" "}
          <Copy /> Copy{" "}
        </Button>
        <Button className="w-[50%]" onClick={onSubmit} >
          {" "}
          <Send /> Send{" "}
        </Button>
      </div>
:
<div className="flex gap-3 w-full mt-5" >
    <Link href={'/scheduled-interview/'+interview?.interview_id+"/details"}  className="w-full" >
<Button variant={"outline"} className={'!w-full'}  >  View Details <ArrowBigRight /> </Button>
</Link>
</div>
      }
    </div>
  );
};

export default InterviewCard;
