const db = require("../config/database");

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const [result] = await db.query(
      "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject || "General Inquiry", message],
    );

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form. Please try again.",
    });
  }
};

// Subscribe to newsletter
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if already subscribed
    const [existing] = await db.query(
      "SELECT * FROM newsletter_subscriptions WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      if (existing[0].status === "active") {
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed",
        });
      } else {
        // Reactivate subscription
        await db.query(
          "UPDATE newsletter_subscriptions SET status = 'active' WHERE email = ?",
          [email],
        );
        return res.json({
          success: true,
          message: "Subscription reactivated successfully!",
        });
      }
    }

    // Insert new subscription
    const [result] = await db.query(
      "INSERT INTO newsletter_subscriptions (email) VALUES (?)",
      [email],
    );

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to our newsletter!",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again.",
    });
  }
};

// Get all contact submissions (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const [contacts] = await db.query(
      "SELECT * FROM contact_submissions ORDER BY created_at DESC",
    );

    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};

// Update contact status
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query("UPDATE contact_submissions SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    res.json({
      success: true,
      message: "Contact status updated",
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};
