import { useEffect } from "react";

type HeadOptions = {
  title: string;
  description?: string;
};

// Lightweight per-page <title>/<meta description> sync for a client-rendered
// SPA (no server head management library needed, unlike TanStack Start's head()).
export function useDocumentHead({ title, description }: HeadOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let tag: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;
    if (description) {
      tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      previousDescription = tag.getAttribute("content");
      tag.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (tag && previousDescription !== null) {
        tag.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}
