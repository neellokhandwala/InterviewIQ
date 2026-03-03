import { requireAuth, clerkClient } from '@clerk/express'
import User from '../models/User.js'

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId
      if (!clerkId) return res.status(401).json({ msg: 'Unauthorized' })

      let user = await User.findOne({ clerkId })

      if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId)
        const email = clerkUser.emailAddresses[0]?.emailAddress

        // Try to find by email (existing user from different Clerk instance)
        user = await User.findOne({ email })

        if (user) {
          // Update clerkId to match new instance
          user.clerkId = clerkId
          await user.save()
        } else {
          // Create brand new user
          user = await User.create({
            clerkId,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            email,
            profileImage: clerkUser.imageUrl,
          })
        }
      }

      req.user = user
      next()
    } catch (error) {
      console.error('Error in protectRoute:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
]