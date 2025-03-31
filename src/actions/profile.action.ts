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