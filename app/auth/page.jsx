"use client"

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supaBaseClient";

function Login() {

  // for sign in users
  const signUp = async () =>  {
    const {erros} = await supabase.auth.signInWithOAuth({
      provider : 'google',
      options :{
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

  
  }




  return (
    <div className="flex flex-col items-center justify-center min-h-screen " >
      <div className="flex flex-col items-center border rounded-2xl p-4" >
        <Image
        src={'/logo.png'}
        alt="A logo of an AI recruiter"
        height={400}
        width={400}
        className="w-[180px] rounded-2xl"
        />
        <div>
          <Image 
          src={'/login.webp'}
          alt="login pic "
          height={400}
          width={600}
          className="w-[400px] h-[250px]"
          />
          <h2 className="text-center text-2xl font-bold pt-5" >WELCOME TO AI HRM</h2>
          <p className="text-gray-500 text-center"> Sign Up  With Google Auth</p>
          <Button 
          onClick={signUp} 
          className='my-5 w-full'  >SignUp With Google</Button>
          <p className="text-gray-300 text-sm text-center" >Powered By Saad </p>
        </div>
      </div>  
    </div>
  );
}

export default Login;
