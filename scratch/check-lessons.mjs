import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const LessonSchema = new mongoose.Schema({
  category: String,
  topic: String,
  title: String,
});

async function checkLessons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
    
    const categories = await Lesson.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    console.log('--- Lesson Counts ---');
    categories.forEach(cat => {
      console.log(`${cat._id || 'Unknown'}: ${cat.count}`);
    });
    
    if (categories.length === 0) {
      console.log('No lessons found in database.');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkLessons();
