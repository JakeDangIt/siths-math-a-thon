// middleware/auth.ts
export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
  
  if (!token) {
    console.log("No token provided");
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.log("Invalid token or error fetching user:", error || "No user found");
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  console.log("Authenticated User:", user);
  event.context.user = user;
});
