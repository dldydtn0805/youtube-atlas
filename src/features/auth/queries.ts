export const authQueryKeys = {
  all: ['auth'] as const,
  currentUser: (accessToken: string | null) => ['auth', 'currentUser', accessToken] as const,
};
