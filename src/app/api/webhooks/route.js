import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createOrUpdateUser, deleteUser } from "../../../lib/actions/user.js";

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt?.data;
    const eventType = evt?.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    if (eventType === "user.created" || eventType === "user.updated") {
      // Handle user created or updated event
      const { first_name, last_name, image_url, email_addresses, username } =
        evt?.data;

      try {
        const user = await createOrUpdateUser(
          id,
          first_name,
          last_name,
          image_url,
          email_addresses,
          username
        );
        if (user && eventType === "user.created") {
          try {
            console.log("Updating user metadata in Clerk...");
            await clerkClient.users.updateUser(id, {
              publicMetadata: {
                userMongoId: user._id,
                isAdmin: user.isAdmin,
              },
            });
          } catch (error) {
            console.log("Error updating user metadata:", error);
          }
        }
        console.log("User created or updated:", user);
      } catch (error) {
        console.error("Error creating or updating user:", error);
      }
      console.log("User data:", evt.data);
    }

    if (eventType === "user.deleted") {
      // Handle user deleted event
      const { id } = evt?.data;
      try {
        await deleteUser(id);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
