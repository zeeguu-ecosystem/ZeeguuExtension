import { EXTENSION_SOURCE } from "../constants";

export default function sendFeedbackEmail(api, feedback, url, articleId, feedbackType) {

  let feedbackInfo = feedback + " and url is:" + url
  let feedbackForDB = feedbackType + feedbackInfo.replace(/ /g, "_")

  api.logReaderActivity(api.EXTENSION_FEEDBACK, articleId, feedbackForDB, EXTENSION_SOURCE);

  let feedbackForEmail = {
    message: feedback,
    context: "url is: " + url + " and articleId is: " + articleId,
  };

  api.sendFeedback(feedbackForEmail, (result_dict, error) => {
    if (result_dict === "OK") {
      console.log("Feedback sent successfully");
    } else {
      console.error("Error sending feedback:", error);
      console.log("Received result_dict:", result_dict);
      console.log("Something went wrong.");
    }
  });
}
