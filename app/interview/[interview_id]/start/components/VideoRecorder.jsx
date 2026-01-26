"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/services/supaBaseClient";

/**
 * Hook for recording both AI and candidate video streams
 */
export const useVideoRecorder = ({
  candidateStream,
  aiStream,
  interviewId,
  onRecordingComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const candidateRecorderRef = useRef(null);
  const aiRecorderRef = useRef(null);
  const chunksRef = useRef({ candidate: [], ai: [] });

  const uploadVideo = async (blob, type, interviewId) => {
    try {
      const fileName = `${interviewId}_${type}_${Date.now()}.webm`;
      const file = new File([blob], fileName, { type: "video/webm" });

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("interview-recordings")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("interview-recordings").getPublicUrl(fileName);

      onRecordingComplete?.({
        type,
        url: publicUrl,
        fileName,
        interviewId,
      });

      return publicUrl;
    } catch (error) {
      console.error(`Failed to upload ${type} video:`, error);
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      // Record candidate video
      if (candidateStream) {
        candidateRecorderRef.current = new MediaRecorder(candidateStream, {
          mimeType: "video/webm;codecs=vp9,opus",
        });

        candidateRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.candidate.push(event.data);
          }
        };

        // Store the original onstop handler
        candidateRecorderRef.current.onstop = async () => {
          console.log("Candidate recording stopped, chunks:", chunksRef.current.candidate.length);
          if (chunksRef.current.candidate.length > 0) {
            const blob = new Blob(chunksRef.current.candidate, {
              type: "video/webm",
            });
            console.log("Candidate video blob size:", blob.size);
            try {
              const url = await uploadVideo(blob, "candidate", interviewId);
              console.log("Candidate video uploaded:", url);
            } catch (error) {
              console.error("Failed to upload candidate video:", error);
            }
          } else {
            console.warn("No candidate video chunks to upload");
          }
        };

        candidateRecorderRef.current.start(1000);
        console.log("Candidate recording started");
      }

      // Record AI video (if available)
      if (aiStream) {
        aiRecorderRef.current = new MediaRecorder(aiStream, {
          mimeType: "video/webm;codecs=vp9,opus",
        });

        aiRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.ai.push(event.data);
          }
        };

        aiRecorderRef.current.onstop = async () => {
          console.log("AI recording stopped, chunks:", chunksRef.current.ai.length);
          if (chunksRef.current.ai.length > 0) {
            const blob = new Blob(chunksRef.current.ai, {
              type: "video/webm",
            });
            console.log("AI video blob size:", blob.size);
            try {
              const url = await uploadVideo(blob, "ai", interviewId);
              console.log("AI video uploaded:", url);
            } catch (error) {
              console.error("Failed to upload AI video:", error);
            }
          } else {
            console.warn("No AI video chunks to upload");
          }
        };

        aiRecorderRef.current.start(1000);
        console.log("AI recording started");
      }

      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping video recording...");
    const promises = [];
    
    if (candidateRecorderRef.current && candidateRecorderRef.current.state !== "inactive") {
      const candidatePromise = new Promise((resolve) => {
        const originalHandler = candidateRecorderRef.current.onstop;
        candidateRecorderRef.current.onstop = async () => {
          if (originalHandler) {
            try {
              await originalHandler();
            } catch (error) {
              console.error("Error in candidate onstop handler:", error);
            }
          }
          resolve();
        };
        try {
          candidateRecorderRef.current.stop();
        } catch (error) {
          console.error("Error stopping candidate recorder:", error);
          resolve();
        }
      });
      promises.push(candidatePromise);
    }
    
    if (aiRecorderRef.current && aiRecorderRef.current.state !== "inactive") {
      const aiPromise = new Promise((resolve) => {
        const originalHandler = aiRecorderRef.current.onstop;
        aiRecorderRef.current.onstop = async () => {
          if (originalHandler) {
            try {
              await originalHandler();
            } catch (error) {
              console.error("Error in AI onstop handler:", error);
            }
          }
          resolve();
        };
        try {
          aiRecorderRef.current.stop();
        } catch (error) {
          console.error("Error stopping AI recorder:", error);
          resolve();
        }
      });
      promises.push(aiPromise);
    }
    
    setIsRecording(false);
    
    // Wait for all uploads to complete (max 10 seconds)
    if (promises.length > 0) {
      try {
        await Promise.race([
          Promise.all(promises),
          new Promise((resolve) => setTimeout(resolve, 10000))
        ]);
        console.log("Video recording stopped and uploads completed");
      } catch (error) {
        console.error("Error waiting for recording to stop:", error);
      }
    } else {
      console.log("No active recordings to stop");
    }
  };

  // Auto-start recording when streams are available
  useEffect(() => {
    let mounted = true;
    
    const initRecording = async () => {
      if ((candidateStream || aiStream) && !isRecording && mounted) {
        await startRecording();
      }
    };

    initRecording();

    return () => {
      mounted = false;
      stopRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateStream, aiStream]);

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};

export default useVideoRecorder;

