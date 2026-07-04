import client from "@/api/client";

const POLLING_INTERVAL = 5000;
const MAX_POLLING_TIME = 120000;

export interface CreateQueryResponse {
  task_id: string;
  status: string;
  message: string;
  user_question: string;
}

export interface ChatbotResponseData {
  response: string;
  status: string;
}

export interface ChatHistoryItem {
  query: string;
  responseMessage: string;
}

export const chatbotAPI = {
  async sendMessage(userQuestion: string): Promise<CreateQueryResponse> {
    const { data } = await client.post<CreateQueryResponse>(
      "/Chatbot/CreateQuery",
      { question: userQuestion },
    );
    return data;
  },

  async getTaskResponse(
    taskId: string,
    userQuestion: string,
  ): Promise<ChatbotResponseData> {
    try {
      const { data } = await client.post<ChatbotResponseData>(
        "/Chatbot/ChatbotResponse",
        { taskId, user_question: userQuestion },
      );
      return data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return {
          response: "",
          status: "PENDING",
        };
      }
      throw error;
    }
  },

  async waitForResponse(
    taskId: string,
    userQuestion: string,
    onProgress?: (status: string) => void,
  ): Promise<ChatbotResponseData> {
    const startTime = Date.now();

    for (let attempt = 0; ; attempt++) {
      if (Date.now() - startTime > MAX_POLLING_TIME) {
        throw new Error("Request timeout - please try again");
      }

      const data = await this.getTaskResponse(taskId, userQuestion);

      if (data.status === "SUCCESS") {
        return data;
      }

      if (data.status === "FAILURE") {
        throw new Error(data.response || "Task failed");
      }

      if (onProgress) onProgress(data.status || "PENDING");

      await new Promise((r) => setTimeout(r, POLLING_INTERVAL));
    }
  },

  async getHistory(): Promise<ChatHistoryItem[]> {
    const { data } = await client.get<ChatHistoryItem[]>("/Chatbot/GetHistory");
    return data;
  },

  async deleteHistory(): Promise<void> {
    await client.delete("/Chatbot/DeleteHistory");
  },
};
