import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/colloabuilder";

const TeamSchema = new mongoose.Schema({
  name: String
});

const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);

const MessageSchema = new mongoose.Schema({
  teamId: mongoose.Schema.Types.ObjectId
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

async function clean() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected Successfully.");

    console.log("Deleting all teams...");
    await Team.deleteMany({});
    
    console.log("Deleting all messages...");
    await Message.deleteMany({});

    console.log("Cleanup Complete!");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup Failed:", err);
    process.exit(1);
  }
}

clean();
