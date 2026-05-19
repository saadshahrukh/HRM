"use client"
import { supabase } from "@/services/supaBaseClient"
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { UserDetailContext } from "@/context/UserDetailContext"
import { toast } from "sonner"

const Provider = ({children}) => {
    const [data , setData] = useState() 
    const [user ,setUser] = useState()
    const [activeOrgId, setActiveOrgId] = useState(null)
    const [activeOrgName, setActiveOrgName] = useState("Global View")
    const [activeOrgCredits, setActiveOrgCredits] = useState(null)
    const [activeOrgPlan, setActiveOrgPlan] = useState("basic")
    const pathname = usePathname()
    const router = useRouter()

    const ADMIN_EMAILS = [
      'saad122sharukh@gmail.com',
      'admin@myapp.com'
    ];

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                // Set standard cookies on client-side so middleware can intercept authenticated state on Next.js server
                const maxAge = session.expires_in || 3600;
                document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
                document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
                
                SyncUser(session.user)
            } else {
                // Clear cookies on logout
                document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
                document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
                setUser(null)
                setData(null)
                setActiveOrgId(null)
                setActiveOrgCredits(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        if (!activeOrgId) {
            setActiveOrgName("Global View")
            setActiveOrgCredits(null)
            setActiveOrgPlan("basic")
            return
        }
        supabase
            .from("organizations")
            .select("name, credits_remaining, plan")
            .eq("id", activeOrgId)
            .single()
            .then(({ data }) => {
                if (data) {
                    setActiveOrgName(data.name)
                    setActiveOrgCredits(data.credits_remaining)
                    setActiveOrgPlan(data.plan || "basic")
                }
            })
    }, [activeOrgId])

    useEffect(() => {
        if (user && pathname.startsWith('/auth')) {
            router.push('/dashboard')
        }
    }, [user, pathname])


const SyncUser = async (supabaseUser) => {
    if (!supabaseUser) {
        console.log("No active user session found.")
        return;
    }

    const isSystemAdmin = ADMIN_EMAILS.includes(supabaseUser.email);

    // 1. Fetch user profile from database
    let { data: Users, error } = await supabase
        .from('Users')
        .select("*")
        .eq('email', supabaseUser.email);
    
    if (error) {
        console.error("Error querying user:", error);
        return;
    }

    // 2. Gate uninvited users (No self-signup for MVP)
    if ((!Users || Users.length === 0) && !isSystemAdmin) {
        console.warn(`[SAAS GATING] Gated uninvited user: ${supabaseUser.email}`);
        router.push("/unauthorized");
        return;
    }

    // 3. For existing users, perform B2B multi-tenant gating
    if (Users && Users.length > 0) {
        const dbUser = Users[0];

        // Gating for users with no organization assigned
        if (!isSystemAdmin && !dbUser.organization_id) {
            console.warn(`[SAAS GATING] User has no organization: ${supabaseUser.email}`);
            router.push("/unauthorized");
            return;
        }

        // System Admins bypass multi-tenant deactivation/credits checks
        if (!isSystemAdmin && dbUser.organization_id) {
            // Fetch tenant state
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', dbUser.organization_id)
                .single();

            if (orgError || !org) {
                console.error("Error fetching organization:", orgError);
                toast.error("Organization profile not found.");
                await supabase.auth.signOut();
                router.push("/auth");
                return;
            }

            // A. Check Soft-Delete / Deactivation
            if (org.status === "deleted") {
                toast.error("Account deactivated. Please contact support.");
                await supabase.auth.signOut();
                router.push("/auth");
                return;
            }

            // B. Check Credit Lock
            if (org.credits_remaining <= 0) {
                toast.error("Your plan has expired. Please contact admin to recharge.");
                await supabase.auth.signOut();
                router.push("/auth");
                return;
            }
        }
    }

    // 4. Create record if they are a first-time logging-in Admin
    if ((!Users || Users.length === 0) && isSystemAdmin) {
        const { data: insertedUser, error: insertError } = await supabase
        .from("Users")
        .insert([
          {
            name: supabaseUser.user_metadata?.name || "System Admin",
            email: supabaseUser.email,
            picture: supabaseUser.user_metadata?.picture,
            role: "super_admin"
          }
        ])
        .select()
        .single();

        if (!insertError) {
            setUser(insertedUser);
            setData(insertedUser);
            setActiveOrgId(insertedUser.organization_id);
        } else {
            console.error("Error inserting user:", insertError);
        }
    } else {
        // Enforce super_admin role for System Admins in-memory
        const matchedUser = Users[0];
        const updatedUser = {
            ...matchedUser,
            role: ADMIN_EMAILS.includes(matchedUser.email) 
              ? "super_admin" 
              : (matchedUser.role === "super_admin" ? "admin" : matchedUser.role)
        };
        setUser(updatedUser);
        setData(updatedUser);
        setActiveOrgId(updatedUser.organization_id);
    }
}

return (
    <div>
<UserDetailContext.Provider value={{user , setUser, activeOrgId, setActiveOrgId, activeOrgName, activeOrgCredits, activeOrgPlan, setActiveOrgPlan}} >     
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