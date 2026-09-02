const mongoose=require("mongoose");
const bcrypt = require("bcryptjs"); 

//user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email:{
      type: String,
      required: true,
      unique: true,
    },
    password:{
      type:String,
      required:true
    },
    number: {
      type: Number,
      required: true,
      
    },
    hikes: [
    {
      hike: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hikes", // model name of your Hike schema
        required: true
      },
      booked: {
        type: Boolean,
        default: false
      },
      paid: {
        type: Boolean,
        default: false
      },
      completed:{
        type:Boolean,
        default:false
      }
    },
    { _id: false }
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
        content: {
          type: String, // The actual post text or image URL
          required: true
        }
        // Mongoose automatically adds an _id to subdocuments!
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt dates
  }
);

userSchema.pre("save", async function () {
  // 1. Skip hashing if password wasn't modified
  if (!this.isModified("password")) return;

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// 3. Helper instance method: Compares entered password with hashed password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
// Create and export the model
const User = mongoose.model("users", userSchema);

module.exports=User