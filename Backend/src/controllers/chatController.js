import { chatClient, streamClient } from "../lib/stream.js";  // ← add streamClient

export async function getStreamToken(req, res) {
    try {
        const clerkId = req.user.clerkId;
        const name    = req.user.name;
        const profileImage = req.user.profileImage || "";

        const chatToken  = chatClient.createToken(clerkId);
        const videoToken = streamClient.generateUserToken({ user_id: clerkId })

        res.status(200).json({
            token:      chatToken,
            videoToken: videoToken,
            userId:     clerkId,
            userName:   name,
            userImage:  profileImage,
        });
    } catch (error) {
        console.log("Error in getStreamToken Controller", error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
}