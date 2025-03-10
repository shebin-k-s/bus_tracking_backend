import User from "../models/userModel.js";

export const assignCard = async (req, res) => {
    const { email, cardId } = req.body;

    if (!email || !cardId) {
        return res.status(400).json({ message: "Email and Card ID are required" });
    }


    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingUserWithCard = await User.findOne({ cardId : cardId.toUpperCase() });
        if (existingUserWithCard && existingUserWithCard.email !== email) {
            return res.status(400).json({ message: "Card is already assigned to another user" });
        }

        user.cardId = cardId.toUpperCase();
        await user.save();
        

        return res.status(200).json({ message: "Card assigned successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
