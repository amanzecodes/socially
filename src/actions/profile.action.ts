"use server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProfileByUsername(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                image: true,
                location: true,
                website: true,
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        following: true
                    }
                }
            }
        })
        return user;
    } catch (error) {
        console.error("Error fetching data from the profile:", error)
        throw new Error("Failed to fetch profile")
    }
}

export async function getUserPosts(userId: string) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: userId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true
                            }
                        },
                    },
                    orderBy: {
                        createdAt: "asc"
                    },
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
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        return posts
    } catch (error) {
        console.error("Error in fetching user ost posts:", error)
        throw new Error("Failed to fetch user posts")
    }
}

export async function getUSerLikedPosts(userId: string) {
    try {
        const likedPosts = await prisma.post.findMany({
            where: {
                likes: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true
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
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return likedPosts
    } catch (error) {
       console.error("Error in fetching user liked posts") 
       throw new Error("Failed to fetch user liked post")
    }
}

export async function updateProfile(formData: FormData) {
    try {
        const  { userId: clerkId } = await auth()
        if(!clerkId) throw new Error("Unauthorized");

        const name = formData.get("name") as string
        const bio = formData.get("bio")as string
        const location = formData.get("location") as string
        const website = formData.get("website") as string

        const user = await prisma.user.update({
            where: { clerkId },
            data: {
                name, bio, location, website
            }
        })
        revalidatePath("/profile")
        return { success: true, user}
    } catch (error) {
        console.error("Error in update profile action")
        throw new Error("Error updating user profile")
    }
}

export async function isFollowing(userId: string) {
    const { userId: currentUserId } = await auth()
    if(!currentUserId)  return false;

    try {
        const follow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: userId
                }
            }
        })

        return !!follow
    } catch (error) {
        console.error("Error chekcing follow status:", error)
        return false
    }
}