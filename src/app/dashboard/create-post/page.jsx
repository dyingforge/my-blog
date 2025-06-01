"use client";

import { useUser } from "@clerk/nextjs";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { set } from "mongoose";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../../../firebase"; // Adjust the import path as necessary
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// https://dev.to/a7u/reactquill-with-nextjs-478b
import "react-quill-new/dist/quill.snow.css";

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image to upload.");
      return;
    }
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const StorageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(StorageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(2));
      },
      (error) => {
        console.error("Error uploading image:", error);
        setImageUploadError("Failed to upload image. Please try again.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prevData) => ({
          ...prevData,
          imageUrl: downloadURL,
        }));
        setImageUploadProgress(0);
        console.log("Image uploaded successfully:", downloadURL);
      }
    );
  };

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Create a post
        </h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
            />
            <Select>
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type="button"
              size="sm"
              outline
              onClick={handleUploadImage}
              disabled={imageUploadProgress > 0}
            >
              {imageUploadProgress > 0 ? (
                <div className="flex items-center gap-2">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress}%`}
                    styles={{
                      path: {
                        stroke: `rgba(220, 38, 38, ${
                          imageUploadProgress / 100
                        })`,
                      },
                      text: {
                        fill: "#fff",
                      },
                    }}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>

          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}

          {formData.imageUrl && (
            <div className="flex justify-center">
              <img
                src={formData.imageUrl}
                alt="Uploaded"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12"
            required
          />
          <Button type="submit">Publish</Button>
        </form>
      </div>
    );
  } else {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold">
        You are not authorized to view this page
      </h1>
    );
  }
}
