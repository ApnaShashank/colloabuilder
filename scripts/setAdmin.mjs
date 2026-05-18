import mongoose from "mongoose";
import User from "../lib/models/User.ts";
import connectDB from "../lib/db.ts";

const ADMIN_EMAIL = "shashank8808108802@gmail.com";

async function setAdmin() {
  try {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { isAdmin: true },
      { new: true }
    );

    if (user) {
      console.log(`Successfully set ${ADMIN_EMAIL} as admin.`);
    } else {
      console.log(`User with email ${ADMIN_EMAIL} not found.`);
    }
  } catch (error) {
    console.error("Error setting admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

setAdmin();
