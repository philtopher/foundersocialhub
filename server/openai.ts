import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyze comment for appropriateness and generate thoughtful questions
export async function moderateComment(content: string, postTitle: string): Promise<{
  isApproved: boolean;
  aiPrompt?: string;
  reason?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an AI comment moderator for a social platform called FounderSocials. " +
            "Your job is to analyze comments for appropriateness and generate thoughtful follow-up questions when needed. " +
            "Respond with JSON in this format: { 'isApproved': boolean, 'aiPrompt': string, 'reason': string }. " +
            "If the comment is appropriate and constructive, set isApproved to true and include a thoughtful question in aiPrompt. " +
            "If the comment is inappropriate (contains hate speech, personal attacks, spam, etc.), set isApproved to false and include the reason."
        },
        {
          role: "user",
          content: `Post Title: ${postTitle}\nComment: ${content}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      isApproved: result.isApproved,
      aiPrompt: result.aiPrompt,
      reason: result.reason
    };
  } catch (error) {
    console.error("OpenAI moderation error:", error);
    // Fallback - approve comment but note the error
    return {
      isApproved: true,
      aiPrompt: "Could you elaborate more on your thoughts? (Note: AI moderation encountered an error)"
    };
  }
}

// Process a comment response to AI prompt
export async function processCommentResponse(originalComment: string, aiPrompt: string, userResponse: string): Promise<{
  finalComment: string;
  isApproved: boolean;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an AI comment moderator for a social platform. " +
            "You are reviewing a user's response to your follow-up question about their comment. " +
            "Respond with JSON in this format: { 'finalComment': string, 'isApproved': boolean }. " +
            "The finalComment should combine the original comment and the response if appropriate. " +
            "Set isApproved to false only if the response is inappropriate."
        },
        {
          role: "user",
          content: `Original Comment: ${originalComment}\nAI Question: ${aiPrompt}\nUser Response: ${userResponse}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      finalComment: result.finalComment,
      isApproved: result.isApproved
    };
  } catch (error) {
    console.error("OpenAI response processing error:", error);
    // Fallback - return the original comment with the response
    return {
      finalComment: `${originalComment}\n\nResponse: ${userResponse}`,
      isApproved: true
    };
  }
}
