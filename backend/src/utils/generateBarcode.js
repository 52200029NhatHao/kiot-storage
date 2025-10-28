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
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  const paddedId = String(id).padStart(3, "0");

  return `SP${day}${month}${year}${paddedId}`;
}
