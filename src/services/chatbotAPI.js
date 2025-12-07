import axios from "axios";

const CHATBOT_BASE_URL = "https://api.recomind.site/api/Chatbot";

export const chatbotAPI = {
  async sendMessage(userQuestion, userId, userRole) {
    try {
      const response = await axios.post(`${CHATBOT_BASE_URL}/CreateQuery`, {
        userID: userId,
        userRole: userRole,
        user_question: userQuestion,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
};