import mongoose from "mongoose";

const PeopleSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, unique: true },
    name: String,
    profilePath: String,
    character: String,
    knownForDepartment: String,
  },
  { timestamps: true }
);

export default mongoose.models.People || mongoose.model("People", PeopleSchema);
