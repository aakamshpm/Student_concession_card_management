import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date },
  studentPhoto: { type: String },
  address: {
    houseName: { type: String },
    houseStreet: { type: String },
    houseCity: { type: String },
    housePincode: { type: Number },
  },
  mobile: { type: String },
  institutionDetails: {
    institutionName: { type: String },
    institutionStreet: { type: String },
    institutionCity: { type: String },
    institutionPincode: { type: Number },
    institutionPhone: { type: String },

    course: {
      courseName: { type: String },
      currentYear: { type: Number },
      courseDuration: { type: Number },
    },
  },
  studentIdCard: { type: String, default: null },
  routes: [
    {
      startingPoint: { type: String, uppercase: true },
      destination: { type: String, uppercase: true },
    },
  ],
  application: {
    status: {
      type: String,
      enum: ["false", "pending", "withdrawn", "approved", "rejected"],
      default: "false",
    },
    appliedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    reason: { type: String },
  },
  concessionCardUrl: { type: String },
  eligibility: {
    status: {
      type: String,
      enum: ["false", "pending", "approved", "rejected"],
      default: "false",
    },
    appliedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    reason: { type: String },
  },
  issuedDate: { type: Date },
  expiryDate: { type: Date },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
