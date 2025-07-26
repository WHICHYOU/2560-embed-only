/**
 * File: app/kids/topics.ts
 * Date: July 26, 2025
 * Purpose: Static mapping of topic slugs to labels + real embed URLs
 * Notes:
 * - Used by /kids/[theme] route to determine correct showdown to embed
 * - Extend this to add more topics
 */

export const topicMap: Record<string, { label: string; embedUrl: string }> = {
  happy: {
    label: "Happy vs Sad",
    embedUrl: "https://yoister.com/embed?tag=happy",
  },
  verbs: {
    label: "Action Verbs",
    embedUrl: "https://yoister.com/embed?tag=verbs",
  },
  animals: {
    label: "Animal Vocabulary",
    embedUrl: "https://yoister.com/embed?tag=animals",
  },
  phrases: {
    label: "Everyday Phrases",
    embedUrl: "https://yoister.com/embed?tag=phrases",
  },
};
