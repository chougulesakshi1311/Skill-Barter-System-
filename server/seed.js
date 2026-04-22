const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const User = require("./src/models/User");
const Skill = require("./src/models/Skill");
const BarterRequest = require("./src/models/BarterRequest");
const Review = require("./src/models/Review");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await BarterRequest.deleteMany({});
    await Review.deleteMany({});
    console.log("Cleared existing data");

    // Create sample skills
    const sampleSkills = [
      { name: "Web Development", tags: ["frontend", "react", "javascript"] },
      { name: "Python Programming", tags: ["backend", "python", "automation"] },
      { name: "UI/UX Design", tags: ["design", "figma", "prototyping"] },
      { name: "Digital Marketing", tags: ["seo", "social-media", "content"] },
      { name: "Guitar Playing", tags: ["music", "strings", "beginner-friendly"] },
      { name: "Photography", tags: ["visual", "editing", "composition"] },
      { name: "English Tutoring", tags: ["education", "language", "writing"] },
      { name: "Fitness Training", tags: ["health", "coaching", "workout"] },
      { name: "Video Editing", tags: ["multimedia", "premiere", "effects"] },
      { name: "Data Analysis", tags: ["analytics", "excel", "sql"] },
    ];

    const createdSkills = await Skill.insertMany(sampleSkills);
    console.log(`Created ${createdSkills.length} sample skills`);

    // Create sample users
    const sampleUsers = [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "password123",
        bio: "Passionate web developer and designer",
        location: "San Francisco, CA",
        skillsOffered: [
          { name: "Web Development", level: "Expert", tags: ["frontend", "react"] },
          { name: "UI/UX Design", level: "Intermediate", tags: ["design", "figma"] },
        ],
        skillsWanted: [
          { name: "Python Programming", level: "Beginner", tags: ["python"] },
        ],
        availabilitySlots: [
          { day: "Monday", startTime: "10:00", endTime: "12:00" },
          { day: "Wednesday", startTime: "14:00", endTime: "16:00" },
        ],
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        password: "password123",
        bio: "Full-stack developer with 5 years experience",
        location: "New York, NY",
        skillsOffered: [
          { name: "Python Programming", level: "Expert", tags: ["backend", "python"] },
          { name: "Data Analysis", level: "Intermediate", tags: ["analytics", "sql"] },
        ],
        skillsWanted: [
          { name: "Guitar Playing", level: "Beginner", tags: ["music"] },
          { name: "Photography", level: "Beginner", tags: ["visual"] },
        ],
        availabilitySlots: [
          { day: "Tuesday", startTime: "15:00", endTime: "17:00" },
          { day: "Friday", startTime: "10:00", endTime: "12:00" },
        ],
      },
      {
        name: "Carol Williams",
        email: "carol@example.com",
        password: "password123",
        bio: "Creative designer and brand strategist",
        location: "Los Angeles, CA",
        skillsOffered: [
          { name: "UI/UX Design", level: "Expert", tags: ["design", "figma", "prototyping"] },
          { name: "Digital Marketing", level: "Intermediate", tags: ["seo", "social-media"] },
        ],
        skillsWanted: [
          { name: "Video Editing", level: "Beginner", tags: ["multimedia"] },
        ],
        availabilitySlots: [
          { day: "Monday", startTime: "13:00", endTime: "15:00" },
          { day: "Thursday", startTime: "11:00", endTime: "13:00" },
        ],
      },
      {
        name: "David Brown",
        email: "david@example.com",
        password: "password123",
        bio: "Professional photographer and music enthusiast",
        location: "Austin, TX",
        skillsOffered: [
          { name: "Photography", level: "Expert", tags: ["visual", "editing"] },
          { name: "Guitar Playing", level: "Expert", tags: ["music", "strings"] },
        ],
        skillsWanted: [
          { name: "English Tutoring", level: "Beginner", tags: ["education"] },
          { name: "Fitness Training", level: "Beginner", tags: ["health"] },
        ],
        availabilitySlots: [
          { day: "Wednesday", startTime: "16:00", endTime: "18:00" },
          { day: "Saturday", startTime: "10:00", endTime: "12:00" },
        ],
      },
      {
        name: "Emma Davis",
        email: "emma@example.com",
        password: "password123",
        bio: "English teacher and content creator",
        location: "Boston, MA",
        skillsOffered: [
          { name: "English Tutoring", level: "Expert", tags: ["education", "writing"] },
          { name: "Video Editing", level: "Intermediate", tags: ["multimedia", "premiere"] },
        ],
        skillsWanted: [
          { name: "Web Development", level: "Beginner", tags: ["frontend"] },
          { name: "Digital Marketing", level: "Intermediate", tags: ["seo"] },
        ],
        availabilitySlots: [
          { day: "Tuesday", startTime: "10:00", endTime: "12:00" },
          { day: "Thursday", startTime: "14:00", endTime: "16:00" },
        ],
      },
      {
        name: "Frank Miller",
        email: "frank@example.com",
        password: "password123",
        bio: "Certified fitness trainer and wellness coach",
        location: "Denver, CO",
        skillsOffered: [
          { name: "Fitness Training", level: "Expert", tags: ["health", "coaching", "workout"] },
        ],
        skillsWanted: [
          { name: "Python Programming", level: "Beginner", tags: ["python"] },
          { name: "Digital Marketing", level: "Intermediate", tags: ["social-media"] },
        ],
        availabilitySlots: [
          { day: "Monday", startTime: "06:00", endTime: "08:00" },
          { day: "Wednesday", startTime: "18:00", endTime: "20:00" },
          { day: "Friday", startTime: "17:00", endTime: "19:00" },
        ],
      },
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} sample users`);

    // Create sample barter requests
    const barterRequests = [
      {
        fromUser: createdUsers[0]._id, // Alice
        toUser: createdUsers[1]._id, // Bob
        offeredSkill: "Web Development",
        requestedSkill: "Python Programming",
        message: "I can teach you React and modern web development if you teach me Python!",
        status: "pending",
      },
      {
        fromUser: createdUsers[1]._id, // Bob
        toUser: createdUsers[3]._id, // David
        offeredSkill: "Data Analysis",
        requestedSkill: "Guitar Playing",
        message: "Would love to learn guitar from you. I can teach you Excel and SQL in return.",
        status: "accepted",
      },
      {
        fromUser: createdUsers[2]._id, // Carol
        toUser: createdUsers[4]._id, // Emma
        offeredSkill: "Digital Marketing",
        requestedSkill: "English Tutoring",
        message: "Need help with my writing skills. I can help you with social media marketing.",
        status: "accepted",
      },
      {
        fromUser: createdUsers[4]._id, // Emma
        toUser: createdUsers[0]._id, // Alice
        offeredSkill: "Video Editing",
        requestedSkill: "Web Development",
        message: "Can you help me build a portfolio website? I'll edit your video content.",
        status: "pending",
      },
      {
        fromUser: createdUsers[3]._id, // David
        toUser: createdUsers[5]._id, // Frank
        offeredSkill: "Photography",
        requestedSkill: "Fitness Training",
        message: "Let me take your fitness photos and create a portfolio for your business!",
        status: "pending",
      },
      {
        fromUser: createdUsers[5]._id, // Frank
        toUser: createdUsers[2]._id, // Carol
        offeredSkill: "Fitness Training",
        requestedSkill: "UI/UX Design",
        message: "I'll help you get fit, and you can design my fitness app UI!",
        status: "completed",
      },
    ];

    const createdBarterRequests = await BarterRequest.insertMany(barterRequests);
    console.log(`Created ${createdBarterRequests.length} sample barter requests`);

    // Create sample reviews for completed requests
    const reviews = [
      {
        barterRequest: createdBarterRequests[5]._id,
        reviewer: createdUsers[5]._id, // Frank
        reviewee: createdUsers[2]._id, // Carol
        rating: 5,
        comment: "Carol did an amazing job on the UI design. Very professional and creative!",
      },
      {
        barterRequest: createdBarterRequests[5]._id,
        reviewer: createdUsers[2]._id, // Carol
        reviewee: createdUsers[5]._id, // Frank
        rating: 5,
        comment: "Frank's training was excellent! I'm already seeing great results.",
      },
    ];

    const createdReviews = await Review.insertMany(reviews);
    console.log(`Created ${createdReviews.length} sample reviews`);

    console.log("\n✅ Database seeded successfully!");
    console.log(`
Sample Accounts Created:
${sampleUsers.map((user) => `- ${user.name} (${user.email}) - password: password123`).join("\n")}
    `);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log("Database connection closed");
};

runSeed();
