import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: String,
  isAdmin: Boolean,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function forceAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://brijeshsharma4400:A8p2Z39A8p2Z39@genzclub.58stq.mongodb.net/?retryWrites=true&w=majority&appName=GenZClub";
  
  try {
    await mongoose.connect(MONGODB_URI);
    const email = "shashank8808108802@gmail.com";
    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    );
    
    if (user) {
      console.log(`✅ SUCCESS: ${email} is now an ADMIN in the database.`);
    } else {
      console.log(`❌ ERROR: User with email ${email} not found. Are you sure you're registered?`);
    }
  } catch (err) {
    console.error("Database connection error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

forceAdmin();
