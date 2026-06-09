const apiKey = process.env.EXPO_PUBLIC_CAT_API_KEY;

if (!apiKey) {
  throw new Error(
    'EXPO_PUBLIC_CAT_API_KEY is not set.',
  );
}

export const config = {
  catApiKey: apiKey,
  catApiBaseUrl: 'https://api.thecatapi.com/v1',
} as const;
