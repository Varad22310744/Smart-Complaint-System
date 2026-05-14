exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "AGENT" })
      .select("_id username email");
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
