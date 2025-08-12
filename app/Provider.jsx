"use client"
import { supabase } from "@/services/supaBaseClient"
import { User } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { UserDetailContext } from "@/context/UserDetailContext"



const Provider = ({children}) => {

    const [data , setData] = useState() 
    const [user ,setUser] = useState()

    useEffect (() => {
        CreateNewUser()
    } , [] )


const  CreateNewUser = () => {
    supabase.auth.getUser().then( async ({data : {user}})=>{

        //check if user exist 
        let {data : Users , error} = await supabase
        .from ('Users')
        .select ("*")
         .eq('email' , user?.email);
         console.log(Users)
        //checkif it's not 

       if (Users?.length === 0) {
  const { data: insertedUser, error } = await supabase
    .from("Users")
    .insert([
      {
        name: user?.user_metadata?.name,
        email: user?.email || "user@gmail.com",
        picture: user?.user_metadata?.picture
      }
    ])
    .select()
    .single(); // Insert ke baad ek hi row return karega

  if (!error) {
    setUser(insertedUser);
    setData(insertedUser);
  }
} else {
  setUser(Users[0]);
  setData(Users[0]);
}


    } )

 

}

return (
    <div>
<UserDetailContext.Provider value={{user , setUser}} >     
           {children}
</UserDetailContext.Provider>

    </div>
)


}

export default Provider


export const useUser = () => {
    const context = useContext(UserDetailContext)
    return context ;
}