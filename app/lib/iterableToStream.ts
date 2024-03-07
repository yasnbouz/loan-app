import { MaxPartSizeExceededError } from "@vercel/remix";

export async function asyncIterableToStream(asyncIterable: AsyncIterable<Uint8Array>, filename: string, contentType: string) {
  const chunks = [];
  const maxFileSize = 5_000_000;
  let size = 0;
  for await (const chunk of asyncIterable) {
    size += chunk.byteLength;
    if (size > maxFileSize) {
      throw new MaxPartSizeExceededError(filename, maxFileSize);
    }
    chunks.push(chunk);
  }
  const file = new File(chunks, filename, { type: contentType });

  return file.stream();
}
