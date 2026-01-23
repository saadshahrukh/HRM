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

        candidateRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current.candidate, {
            type: "video/webm",
          });
          await uploadVideo(blob, "candidate", interviewId);
        };

        candidateRecorderRef.current.start(1000);
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
          const blob = new Blob(chunksRef.current.ai, {
            type: "video/webm",
          });
          await uploadVideo(blob, "ai", interviewId);
        };

        aiRecorderRef.current.start(1000);
      }

      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = () => {
    if (candidateRecorderRef.current && candidateRecorderRef.current.state !== "inactive") {
      candidateRecorderRef.current.stop();
    }
    if (aiRecorderRef.current && aiRecorderRef.current.state !== "inactive") {
      aiRecorderRef.current.stop();
    }
    setIsRecording(false);
    chunksRef.current = { candidate: [], ai: [] };
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

