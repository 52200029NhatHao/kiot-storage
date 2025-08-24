import Counter from "../models/Counter.js";

export async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export function generateProductCode(id, date) {
  const datePart = date
    .toLocaleDateString("en-GB")
    .split("/")
    .join("")
    .slice(0, 6);
  const paddedId = String(id).padStart(3, "0");
  return `SP${datePart}${paddedId}`;
}
