
import { createClient } from "@supabase/supabase-js"

// Hardcoded for internal seeding script
const supabaseUrl = "https://eafkcvwshcedsilumphy.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZmtjdndzaGNlZHNpbHVtcGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTM1OTQsImV4cCI6MjA4MDE4OTU5NH0.WqZw_5kDvTmDhyldZhhEhWdjhbsnVQ6gpBW_Gy2ZyoA"

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedSharmaClasses() {
    console.log("🌱 Seeding 'Sharma Classes'...")

    // 1. Sign Up User
    const email = "sharma.demo@gmail.com"
    const password = "sharma123"

    console.log(`Creating Auth User: ${email}...`)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (authError) {
        console.error("❌ Auth Error:", authError.message)
        // Check if user already exists
        if (!authError.message.includes("already registered")) return
    }

    // Note: If email confirmation is on, we can't get the UID immediately unless we log in or fetch from DB.
    // However, if we just created it, we might have it in authData.user
    // If it says "User already registered", we assume we proceed or fail.

    let userId = authData.user?.id
    console.log("User ID:", userId)

    if (!userId) {
        console.log("⚠️ User creation pending verification. You may need to manually confirm email via SQL.")
        // We can't proceed to insert linked data if we don't have the ID.
        // But let's try to verify via Login (sometimes works if email confirm is off)
        // But let's try to verify via Login (sometimes works if email confirm is off)
        const { data: loginData } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (loginData.user) {
            userId = loginData.user.id
            console.log("✅ Logged in successfully. User ID:", userId)
        } else {
            console.error("❌ Could not login. Please manually confirm email in Supabase.")
            return
        }
    }

    if (!userId) return

    // 2. Create Institute Profile
    console.log("Creating Institute Profile...")
    const { error: instError } = await supabase
        .from("institutes")
        .insert({
            name: "Sharma Classes",
            owner_id: userId, // Assuming link
            address: "Plot No. 45, Knowledge Park 3",
            city: "Greater Noida",
            helpline_number: "+91 98765 43210",
            google_map_link: "https://maps.google.com/?q=Sharma+Classes"
            // Add other fields as per schema
        })

    if (instError) console.error("⚠️ Institute Insert Error (might exist):", instError.message)
    else console.log("✅ Institute Profile Created.")

    // 3. Create Sample Course
    // First get institute ID
    const { data: instData } = await supabase.from("institutes").select("id").eq("owner_id", userId).single()
    const instituteId = instData?.id

    if (instituteId) {
        console.log("Creating Sample Course...")
        const { error: courseError } = await supabase
            .from("courses")
            .insert({
                institute_id: instituteId,
                name: "PCM - Class 11 & 12",
                description: "Complete Physics, Chemistry, Math for JEE Mains.",
                duration: "1 Year",
                fees: 45000,
                target_class: "11th, 12th",
                registration_fee: 1000,
                mode: "Offline"
            })
        if (courseError) console.error("⚠️ Course Insert Error:", courseError.message)
        else console.log("✅ Course 'PCM' Created.")
    }

    console.log("\n🎉 DONE! Login details:")
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
}

seedSharmaClasses()
