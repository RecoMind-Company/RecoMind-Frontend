import axios from "axios";

const CHATBOT_BASE_URL = "https://api.recomind.site/api/Chatbot";
const POLLING_INTERVAL = 10000;
const MAX_POLLING_TIME = 300000;

interface CreateQueryResponse {
  task_id: string;
  [key: string]: unknown;
}

interface ChatbotResponse {
  status: "SUCCESS" | "FAILURE" | "PENDING" | string;
  responseMessage?: string;
  result?: string;
  answer?: string;
  [key: string]: unknown;
}

export const chatbotAPI = {
  async sendMessage(
    userQuestion: string,
    userId: string | number,
    userRole: string
  ): Promise<CreateQueryResponse> {
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
      throw new Error("Failed to send message");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || "Failed to send message");
    }
  },

  async getTaskResponse(
    taskId: string,
    userId: string | number,
    userRole: string,
    userQuestion: string
  ): Promise<ChatbotResponse> {
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
      throw new Error("Failed to get task response");
    } catch (error) {
      const err = error as { message?: string };
      console.error("⚠️ Error getting task response:", err.message);
      throw error;
    }
  },

  async waitForResponse(
    taskId: string,
    userId: string | number,
    userRole: string,
    userQuestion: string,
    onProgress?: (progressData: ChatbotResponse | { status: string; message: string }) => void
  ): Promise<ChatbotResponse> {
    return new Promise(async (resolve, reject) => {
      const startTime = Date.now();
      let attemptCount = 0;

      console.log("⏳ Starting to poll for response...");

      let pollInterval: ReturnType<typeof setInterval>;

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
            if (pollInterval) clearInterval(pollInterval);
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
            if (pollInterval) clearInterval(pollInterval);
            console.log("✅ Task completed successfully!");
            console.log("📨 Response:", responseData.responseMessage);
            resolve(responseData);
          } else if (responseData.status === "FAILURE") {
            if (pollInterval) clearInterval(pollInterval);
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
          const err = error as { message?: string };
          console.warn("⚠️ Polling error (will retry):", err.message);

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
      pollInterval = setInterval(checkStatus, POLLING_INTERVAL);
    });
  },
};
