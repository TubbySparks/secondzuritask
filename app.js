const express = require("express");

const app = express();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

// paste form data
app.use(express.urlencoded({ extended: true }));
// paste json

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://tubbysparks:Adeyemo%40@cluster0.tmkwa7x.mongodb.net/persons_db?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

// Define the Person schema and model
app.use(express.json());
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
//add-new person

// Defining CRUD routes

// CREATE: Adding a new user
app.post("/api", async (req, res) => {
  const user = await User.create({ ...req.body });
  res.status(201).json({ name: user.name, id: user._id });
});

// READ: Fetching a person by name
app.get("/api/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const person = await User.findOne({ _id: id });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving person" });
  }
});

// READ: Update details of a user by name
app.put("/api/:id", async (req, res) => {
  const {
    params: { id },
    body: { name },
  } = req;
  try {
    const updatedPerson = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPerson) {
      return res
        .status(404)
        .json({ name: updatedPerson.name, id: updatedPerson._id });
    }
    res.status(200).json(updatedPerson);
  } catch (error) {
    res.status(500).json({ message: "Error updating person" });
  }
});

// Delete a person by name
app.delete("/api/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPerson = await User.findOneAndDelete({ _id: id });
    if (!deletedPerson) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.status(200).send("user deleted");
  } catch (error) {
    res.status(500).json({ message: "Error deleting person" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
