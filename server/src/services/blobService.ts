import { getFirebaseAdmin } from "../lib/firebase.js";

interface UploadBlobParams {
  userId: string;
  file: Express.Multer.File;
  folder?: string;
}

interface DeleteBlobParams {
  userId: string;
  folder?: string;
}

/**
 * Uploads a file to Firebase Storage, upserting by userId and folder.
 * @param userId - The user ID for the file.
 * @param file - The file object (from multer).
 * @param folder - The folder to store the file in (default: 'profileImages').
 * @returns An object with the public URL and message.
 */
export async function uploadBlob({
  userId,
  file,
  folder = "profileImages",
}: UploadBlobParams) {
  const admin = getFirebaseAdmin();
  const bucket = admin.storage().bucket();
  const fileRef = bucket.file(`${folder}/${userId}.png`);
  const contentType = folder === "docs" ? "application/pdf" : "image/png";
  await fileRef.save(file.buffer, {
    contentType,
    public: true,
    metadata: {
      cacheControl: "no-cache",
    },
  });
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
  return {
    url: publicUrl,
    message: "Image uploaded successfully",
  };
}

/**
 * Deletes a file from Firebase Storage by userId and folder.
 * @param userId - The user ID for the file.
 * @param folder - The folder to delete from (default: 'profileImages').
 * @returns An object indicating success or error.
 */
export async function deleteBlob({
  userId,
  folder = "profileImages",
}: DeleteBlobParams) {
  const admin = getFirebaseAdmin();
  const bucket = admin.storage().bucket();
  const fileRef = bucket.file(`${folder}/${userId}.png`);
  const [exists] = await fileRef.exists();
  if (!exists) {
    return { error: "File not found" };
  }
  await fileRef.delete();
  return { success: true };
}
