import mongoose from "mongoose";

const applicationSchema = mongoose.Schema(
  {
    studentId: { type: mongoose.ObjectId, required: true, ref: "Student" },
    passImgUrl: { type: String },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
