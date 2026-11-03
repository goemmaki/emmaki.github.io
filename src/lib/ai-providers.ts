export const AI_PROVIDER_URLS = {
  ChatGPT: 'https://chatgpt.com/?q=__PROMPT__',
  Claude: 'https://claude.ai/new?q=__PROMPT__',
  'Google AI': 'https://www.google.com/search?q=__PROMPT__&udm=50',
  Grok: 'https://grok.com/?q=__PROMPT__',
  Perplexity: 'https://www.perplexity.ai/search/?q=__PROMPT__',
} as const;

export type AiProvider = keyof typeof AI_PROVIDER_URLS;

export function aiProviderUrl(name: AiProvider, prompt: string) {
  return AI_PROVIDER_URLS[name].replace('__PROMPT__', encodeURIComponent(prompt));
}
