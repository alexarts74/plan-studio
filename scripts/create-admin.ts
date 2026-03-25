import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: "contact.studioplan@gmail.com",
    password: "asNffzzIetgZng6S@",
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }

  console.log("Admin user created:", data.user.id);
}

main();
