import OpenAI from "openai";

// Using GPT-4.1 as requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyze comment for appropriateness and generate thoughtful questions
export async function moderateComment(commentContent: string, postTitle: string): Promise<{
  isApproved: boolean;
  aiPrompt?: string;
  reason?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
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

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response content from OpenAI");
    const result = JSON.parse(content);
    
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
      model: "gpt-4.1",
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

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response content from OpenAI");
    const result = JSON.parse(content);
    
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

// Enhance a comment with AI to make it more valuable/informative
export async function enhanceComment(content: string, postTitle: string): Promise<{
  enhancedContent: string;
  isApproved: boolean;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: 
            "You are an AI assistant that helps enhance comments on a professional social network for founders. " +
            "Your goal is to improve the content by making it more informative, adding relevant details, and ensuring it's constructive. " +
            "Focus on helping founders communicate more effectively. " +
            "Respond with JSON in this format: { 'enhancedContent': string, 'isApproved': boolean }. " +
            "The enhancedContent should preserve the original intent but make it more valuable to readers. " +
            "Set isApproved to false only if the original comment is inappropriate (contains hate speech, spam, etc.)."
        },
        {
          role: "user",
          content: `Post Title: ${postTitle}\nOriginal Comment: ${content}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      enhancedContent: result.enhancedContent,
      isApproved: result.isApproved
    };
  } catch (error) {
    console.error("OpenAI comment enhancement error:", error);
    // Fallback - return the original comment
    return {
      enhancedContent: content,
      isApproved: true
    };
  }
}

// Generate process flows based on a comment
export async function generateProcessFlows(content: string, postTitle: string): Promise<{
  processFlows: any[];
  isApproved: boolean;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: 
            "You are an AI assistant that helps generate project process flows based on comments in a founder social network. " +
            "Your goal is to identify potential processes, workflows or project plans from the user's comment. " +
            "Generate 1-3 process flows depending on the complexity of the content. " +
            "Respond with JSON in this format: { 'processFlows': [{'title': string, 'description': string, 'steps': [{'name': string, 'description': string}]}], 'isApproved': boolean }. " +
            "Each process flow should have a clear title, brief description and 3-7 actionable steps. " +
            "Set isApproved to false only if the comment is inappropriate or doesn't contain enough information to generate meaningful process flows."
        },
        {
          role: "user",
          content: `Post Title: ${postTitle}\nComment: ${content}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      processFlows: result.processFlows || [],
      isApproved: result.isApproved
    };
  } catch (error) {
    console.error("OpenAI process flow generation error:", error);
    // Fallback - return empty process flows
    return {
      processFlows: [],
      isApproved: true
    };
  }
}
