import User from "../models/userModel.js";

export const addTicket = async (req, res) => {
    const { email, ticketCount } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.cardId) {
            return res.status(400).json({ message: "User does not have a registered card" });
        }

        const ticketToAdd = Number(ticketCount);

        if (isNaN(ticketToAdd) || ticketToAdd <= 0) {
            return res.status(400).json({ message: "Invalid ticket count" });
        }

        user.ticketCount += ticketToAdd;

        await user.save();

        return res.status(200).json({ message: "Ticket added successfully", ticketCount: user.ticketCount });
    } catch (error) {
        console.error("Error adding ticket:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const fetchTicket = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Ticket fetched successfully",
            ticketCount: user.ticketCount,
            cardId: user.cardId
        });
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const consumeTicket = async (req, res) => {
    try {

        console.log(req.body);
        
        const user = await User.findOne({ cardId: req.body.cardId.toUpperCase() });
        if (!user) {
            return res.status(404).json({ message: "Card details not found" });
        }


        if (user.ticketCount <= 0) {
            return res.status(400).json({
                message: "No tickets available",
                availableTickets: user.ticketCount
            });
        }

        user.ticketCount -= 1;

        await user.save();

        return res.status(200).json({
            message: "Ticket consumed successfully",
            remainingTickets: user.ticketCount
        });
    } catch (error) {
        console.error("Error consuming ticket:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
