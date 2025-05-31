import User from "../mongodb/models/user.model.js";

import { connect } from "../mongodb/mongoose.js";

export const createOrupdateUser = async (
  id,
  firstName,
  lastName,
  image_url,
  email_addresses,
  username
) => {
  try {
    await connect();

    const user = await User.findOneAndUpdate(
      { clerk: id },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          profilePicture: image_url,
          email: email_addresses[0].email_address,
          userName,
        },
      },
      { upsert: true, new: true }
    );
    return user;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw new Error("Failed to create or update user");
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();

    const user = await User.findOneAndDelete({ clerk: id });
    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};
