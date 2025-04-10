import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadPDF = async (concessionCardName) => {
  const filePath = path.join(__dirname, concessionCardName);
  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from("student-concession-cards")
    .upload(concessionCardName, fileBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    console.error("Upload Error: ", error.message);
    throw new Error(error.message);
  }

  const publicUrl = supabase.storage
    .from("student-concession-cards")
    .getPublicUrl(data.path);

  if (publicUrl) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("Failed to delete file: ", err);
        throw new Error(err);
      }
    });
    return publicUrl.data.publicUrl;
  }

  throw new Error("Upload failed");
};

export default uploadPDF;
