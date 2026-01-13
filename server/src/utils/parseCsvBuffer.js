import csv from "csv-parser";
import { Readable } from "stream";

export const parseCsvBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    // Convert buffer to readable stream
    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};
