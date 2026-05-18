import connectDB from "./lib/db";
import User from "./lib/models/User";

async function forceAdmin() {
  await connectDB();
  const email = "shashank8808108802@gmail.com";
  const user = await User.findOneAndUpdate(
    { email },
    { isAdmin: true },
    { new: true }
  );
  if (user) {
    console.log(`Success: ${email} is now an admin.`);
  } else {
    console.log(`Error: User with email ${email} not found.`);
  }
  process.exit(0);
}

forceAdmin();
