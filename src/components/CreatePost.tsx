"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)

  const handleSubmit = async () => {}
  return <Card className="mb-6">
    <CardContent className="space-y-4"></CardContent>
  </Card >;
}

export default CreatePost;
