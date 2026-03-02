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
        // Auto-create user from Clerk data
        const clerkUser = await clerkClient.users.getUser(clerkId)
        user = await User.create({
          clerkId,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          email: clerkUser.emailAddresses[0]?.emailAddress,
          profileImage: clerkUser.imageUrl,
        })
      }

      req.user = user
      next()
    } catch (error) {
      console.error('Error in protectRoute:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
]