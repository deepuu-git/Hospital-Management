import Contact from "../models/contactModel.js";

// CREATE MESSAGE
export const createContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, message } = req.body;

    // validation
    if (!firstName || !lastName || !email || !mobile || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // save message
    const newMessage = await Contact.create({
      firstName,
      lastName,
      email,
      mobile,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL MESSAGES
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
