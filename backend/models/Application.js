import mongoose from "mongoose";

const applicationSchema = mongoose.Schema(
  {
    studentId: { type: mongoose.ObjectId, required: true, ref: "Student" },
    application: {
      status: { type: Boolean, default: false },
      passImgUrl: { type: String },
    },
    verification: {
      applied: { type: Boolean, default: false },
      studentIdCard: { type: String, default: null },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
