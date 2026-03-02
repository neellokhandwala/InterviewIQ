import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const clerkId = req.user.clerkId;
        const name = req.user.name;
        const profileImage = req.user.profileImage || "";
        
        // Create both chat and video tokens
        const chatToken = chatClient.createToken(clerkId);
        const videoToken = streamClient.generateUserToken(clerkId);
        
        console.log("[v0] Generated chat token for user:", clerkId);
        console.log("[v0] Generated video token for user:", clerkId);
        
        res.status(200).json({
            token: chatToken,
            videoToken: videoToken,
            userId: clerkId,
            userName: name,
            userImage: profileImage
        })
    } catch ( error ) {
        console.log("Error in getStreamToken Controller", error.message);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
}
