const mongoose=require("mongoose")


//user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: Number,
      required: true,
    },
    hikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hikes", // References the hikes model
      },
    ],
    experience: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"], // Optional: Restrict to specific levels
      default: "Beginner",
    },
    follower: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Self-referencing the User model
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Self-referencing the User model
      },
    ],
    posts: [
      {
        type: String, // Array of strings (e.g., image URLs or post content)
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt dates
  }
);

// Create and export the model
const User = mongoose.model("users", userSchema);

module.exports=User