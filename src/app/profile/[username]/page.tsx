import { getProfileByUsername, getUSerLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action"
import { notFound } from "next/navigation"
import ProfilePageClient from "../ProfilePageClient"


export async function generateMetadata({params}: {params: {username: string}}){
  const user = await getProfileByUsername(params.username)
  if(!user) return {}

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile`
  }
} 

const ProfilePage = async ({params}: {params: {username: string}}) => {
  const user = await getProfileByUsername(params.username)
  if(!user) notFound()
  const [posts, likedPosts, iscurrentFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUSerLikedPosts(user.id),
    isFollowing(user.id)
  ])
  
  return (
    <ProfilePageClient 
    user={user}
    posts={posts}
    likedPosts={likedPosts}
    isFollowing={iscurrentFollowing}/>
  )
}

export default ProfilePage