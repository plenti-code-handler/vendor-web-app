import axios from "axios";
import { GoogleAuth } from "google-auth-library";
import fs from "fs";
import path from "path";

const keyFilePath = path.join(process.cwd(), "./credentials.json");

async function getAccessToken() {
  const serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));

  const client = new GoogleAuth({
    credentials: serviceAccount,
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/firebase.database",
      "https://www.googleapis.com/auth/firebase.messaging",
    ],
  });

  const authClient = await client.getClient();
  const accessToken = await authClient.getAccessToken();
  return accessToken.token;
}

export async function POST(request) {
  const { token } = await request.json();

  // Extract token and projectId from userData or environment variables

  // Define the new FCM URL
  const fcmUrl = `https://fcm.googleapis.com/v1/projects/foodie-finder-ee1d8/messages:send`;

  // Create the payload for the notification
  const payload = {
    message: {
      token: token,
      notification: {
        title: "Hello!",
        body: "This is a test push notification.",
      },
      data: {
        extraData: "Some data",
      },
    },
  };

  try {
    // Get the OAuth2 access token (replace this with your own method)
    const accessToken = await getAccessToken(); // Define this function to get a valid token
    // Send the push notification
    const response = await axios.post(fcmUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Return a successful response with user data
    return new Response(
      JSON.stringify({ message: "Notifications sent successfully!" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending notification:", error);

    // Return an error response if the notification fails
    return new Response(
      JSON.stringify({
        error: "Failed to send notification",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
