import User from "../models/userModel.js";


export const addTicket = async (req, res) => {

    const { email, ticketCount } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.ticketCount = user.ticketCount + ticketCount;

        await user.save();

        return res.status(201).json({ message: 'Ticket added successfully' });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const fetchTicket = async (req, res) => {


    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Ticket fetched successfully', ticketCount: user.ticketCount });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};
