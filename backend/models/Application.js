import mongoose from "mongoose";

const applicationSchema = mongoose.Schema(
  {
    studentId: { type: mongoose.ObjectId, required: true, ref: "Student" },
    application: {
      status: { type: Boolean, default: false },
      passImgUrl: { type: String },
    },
    verification: {
      status: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
