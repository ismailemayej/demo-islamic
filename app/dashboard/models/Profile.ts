// app/dashboard/models/Profile.ts
import mongoose, { Schema, models } from "mongoose";

const profileSchema = new Schema({
  imageUrl: { type: String, required: true },
});

const Profile = models.Profile || mongoose.model("Profile", profileSchema);
export default Profile;
