import axios from "axios";

const CHATBOT_BASE_URL = "https://api.recomind.site/api/Chatbot";
const POLLING_INTERVAL = 10000;
const MAX_POLLING_TIME = 300000;

export const chatbotAPI = {
  async sendMessage(userQuestion, userId, userRole) {
    try {
      console.log("📤 Sending message to CreateQuery.. .");

      const response = await axios.post(`${CHATBOT_BASE_URL}/CreateQuery`, {
        userID: userId,
        userRole: userRole,
        user_question: userQuestion,
      });

      console.log("✅ Task created:", response.data);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  async getTaskResponse(taskId, userId, userRole, userQuestion) {
    try {
      console.log("📥 Checking task status:", taskId);

      const response = await axios.post(`${CHATBOT_BASE_URL}/ChatbotResponse`, {
        userID: userId,
        userRole: userRole,
        user_question: userQuestion,
        taskId: taskId,
      });

      console.log("📊 Task response:", response.data);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("⚠️ Error getting task response:", error.message);
      throw error;
    }
  },

  async waitForResponse(taskId, userId, userRole, userQuestion, onProgress) {
    return new Promise(async (resolve, reject) => {
      const startTime = Date.now();
      let attemptCount = 0;

      console.log("⏳ Starting to poll for response...");

      // ✅ Poll immediately first time
      const checkStatus = async () => {
        try {
          attemptCount++;
          const elapsedTime = Date.now() - startTime;
          const elapsedSeconds = Math.round(elapsedTime / 1000);

          console.log(
            `🔄 Polling attempt #${attemptCount} (${elapsedSeconds}s elapsed)`
          );

          // Check timeout
          if (elapsedTime > MAX_POLLING_TIME) {
            clearInterval(pollInterval);
            console.error("⏱️ Timeout reached");
            reject(new Error("Request timeout - please try again"));
            return;
          }

          // Get response
          const responseData = await this.getTaskResponse(
            taskId,
            userId,
            userRole,
            userQuestion
          );

          // Notify progress
          if (onProgress) {
            onProgress(responseData);
          }

          // Check status
          if (responseData.status === "SUCCESS") {
            clearInterval(pollInterval);
            console.log("✅ Task completed successfully!");
            console.log("📨 Response:", responseData.responseMessage);
            resolve(responseData);
          } else if (responseData.status === "FAILURE") {
            clearInterval(pollInterval);
            console.error("❌ Task failed");
            reject(
              new Error(
                responseData.responseMessage || "Task failed - please try again"
              )
            );
          } else if (responseData.status === "PENDING") {
            console.log("⏳ Task still processing...");
          } else {
            console.log(`📊 Current status: ${responseData.status}`);
          }
        } catch (error) {
          console.warn("⚠️ Polling error (will retry):", error.message);

          // Don't stop polling on error, just notify
          if (onProgress) {
            onProgress({
              status: "PENDING",
              message: "Processing...  (checking again soon)",
            });
          }
        }
      };

      // ✅ Check immediately
      await checkStatus();

      // ✅ Then check every POLLING_INTERVAL
      const pollInterval = setInterval(checkStatus, POLLING_INTERVAL);
    });
  },
};
