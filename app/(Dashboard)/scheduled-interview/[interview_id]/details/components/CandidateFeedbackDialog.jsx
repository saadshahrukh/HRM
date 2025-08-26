import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CandidateFeedbackDialog = ({ candidate }) => {
  const feedback = candidate?.feedback?.feedback
  console.log(feedback)
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}> View Report </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription asChild>
              <div>

                <div className="flex items-center justify-between" >
                <div className="flex items-center gap-5">
                  <h2 className="bg-blue-400 p-2 px-4.5 rounded-full font-bold text-white text-2xl ">
                    {candidate?.userName[0]}
                  </h2>
                  <div>
                    {" "}
                    <h2 className="text-2xl font-bold text-gray-800">
                      {candidate?.userName}
                    </h2>
                    <p>{candidate?.userEmail}</p>
                  </div>
                </div>

                <div className='flex gap-5 items-center' >
                            <h2 className='text-blue-500 text-2xl font-bold' >{feedback?.rating?.techicalSkills}/10</h2>
                 </div>

                </div>
              <div className="mt-5 " >
              <h2 className="text-2xl font-bold text-gray-800" >Skills Assessment</h2>
    <div className=" mt-5 grid grid-cols-2 gap-6" >
      <div>
    <h2 className="flex  justify-between" >Technical Skills  <span>{feedback?.rating?.techicalSkills || "N/A"}/10</span> </h2>
    <Progress value={9 *10}  className={'mt-3'}  />
    </div> 
     <div>
    <h2 className="flex  justify-between" >Communication  <span>{feedback?.rating?.communication || "N/A"}/10</span> </h2>
    <Progress value={9 *10}  className={'mt-3'}  />
    </div>
     <div>
    <h2 className="flex  justify-between" > Problem Solving <span>{feedback?.rating?.problemSolving || "N/A"}/10</span> </h2>
    <Progress value={9 *10}  className={'mt-3'}  />
    </div>
     <div>
    <h2 className="flex  justify-between" > Experience <span>{feedback?.rating?.experince || "N/A"}/10</span> </h2>
    <Progress value={9 *10}  className={'mt-3'}  />
    </div>
    </div>
            
              </div>

              <div className="mt-5  " >
                <h2 className="text-xl font-semibold text-gray-800 " >Feedback Summary : </h2>
                <p className="mt-3 bg-gray-100 p-3 rounded-lg" >{feedback?.summery}</p>
              </div>

              <div className="mt-5 bg-green-100 p-5 rounded flex items-center justify-between" >
                <div className="w-[60%]" >
                <h2 className="text-green-800 font-bold text-lg" >Recommendation : {feedback?.Recommendation} </h2> 
                <p className="text-green-500" >{feedback?.RecommendationMsg}</p>
                </div>
                <div>
                <Button className={'bg-green-500'} > Send Message </Button>
                </div>
              </div>

              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateFeedbackDialog;
