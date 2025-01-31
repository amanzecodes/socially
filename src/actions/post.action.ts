'user server';

import prisma from "@/lib/prisma";
import { getDBUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content:string, image:string) {
  try {
  const userId = await getDBUserId();

  const post = await prisma.post.create({
    data:{
        content,
        image,
        authorId: userId,
    }
  })

  revalidatePath('/')
  return {success:true, post}
  } catch (error) {
    console.error('Error creating post', error);
    return {success:false, error: "Failed to create post"}
  }

}