'use server';

import prisma from "@/lib/prisma";
import { getDBUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content:string, image:string) {
  try {
  const userId = await getDBUserId();

  if(!userId) return

  const post = await prisma.post.create({
    data:{
        content,
        image,
        authorId: userId,
    }
  })

  revalidatePath('/') //purge the cache for the home page
  return {success:true, post}
  } catch (error) {
    console.error('Error creating post', error);
    return {success:false, error: "Failed to create post"}
  }

}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            username: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "asc"
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })
    return posts
  } catch (error) {
    console.log("Error in get post")
    throw new Error("Failed to fetch posts")
  }
}