import { NextResponse } from "next/server";
import { supabase } from "@/services/supaBaseClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // attendance, payroll, leaves, performance, monitoring
  const range = searchParams.get("range") || "30days"; // 7days, 30days, 3months, all

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }

  // Calculate timestamp based on date range filter
  let dateLimit = new Date();
  if (range === "7days") {
    dateLimit.setDate(dateLimit.getDate() - 7);
  } else if (range === "30days") {
    dateLimit.setDate(dateLimit.getDate() - 30);
  } else if (range === "3months") {
    dateLimit.setMonth(dateLimit.getMonth() - 3);
  } else {
    dateLimit = new Date("2020-01-01"); // All time
  }
  const dateStr = dateLimit.toISOString();

  try {
    switch (type) {
      case "attendance": {
        // Fetch attendance records and join with employee_profiles
        const { data, error } = await supabase
          .from("attendance_records")
          .select(`
            *,
            employee_profiles (
              id, name, email, department, location, role, avatar
            )
          `)
          .gte("date", dateStr.split("T")[0])
          .order("date", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ data });
      }

      case "payroll": {
        // Fetch payroll records
        const { data, error } = await supabase
          .from("payroll_records")
          .select(`
            *,
            employee_profiles (
              id, name, email, department, location, role, avatar
            )
          `)
          .gte("pay_period_start", dateStr.split("T")[0])
          .order("pay_period_start", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ data });
      }

      case "leaves": {
        // Fetch leave requests
        const { data, error } = await supabase
          .from("leave_requests")
          .select(`
            *,
            employee_profiles (
              id, name, email, department, location, role, avatar
            )
          `)
          .gte("start_date", dateStr.split("T")[0])
          .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ data });
      }

      case "performance": {
        // Fetch performance indices
        const { data, error } = await supabase
          .from("performance_metrics")
          .select(`
            *,
            employee_profiles (
              id, name, email, department, location, role, avatar
            )
          `)
          .gte("date", dateStr.split("T")[0])
          .order("date", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ data });
      }

      case "monitoring": {
        // Fetch active monitoring logs
        const { data, error } = await supabase
          .from("active_monitoring_logs")
          .select(`
            *,
            employee_profiles (
              id, name, email, department, location, role, avatar
            )
          `)
          .gte("timestamp", dateStr)
          .order("timestamp", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ data });
      }

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, id, status, employeeId, type, checkIn, checkOut, amount } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    switch (action) {
      // 1. Process attendance clock-in/out
      case "clock-in": {
        const { data, error } = await supabase
          .from("attendance_records")
          .insert({
            employee_id: employeeId,
            date: new Date().toISOString().split("T")[0],
            check_in: new Date().toISOString(),
            status: "ON_TIME",
            location: "Office (Clock-in)"
          })
          .select();

        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }

      // 2. Approve/reject leave requests
      case "update-leave": {
        const { data, error } = await supabase
          .from("leave_requests")
          .update({ status: status })
          .eq("id", id)
          .select();

        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }

      // 3. Process individual payroll
      case "pay-salary": {
        const { data, error } = await supabase
          .from("payroll_records")
          .update({
            status: "PAID",
            processed_at: new Date().toISOString()
          })
          .eq("id", id)
          .select();

        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }

      // 4. Pay all pending payrolls
      case "pay-all-pending": {
        const { data, error } = await supabase
          .from("payroll_records")
          .update({
            status: "PAID",
            processed_at: new Date().toISOString()
          })
          .eq("status", "PENDING")
          .select();

        if (error) throw error;
        return NextResponse.json({ success: true, data });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    console.error("API POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
