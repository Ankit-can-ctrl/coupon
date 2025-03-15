// models/Admin.js
import mongoose from "mongoose";

// models/Admin.js
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("Admin", AdminSchema);
