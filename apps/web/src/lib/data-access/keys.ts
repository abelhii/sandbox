export const sessionQueryKeys = {
  all: ["session"] as const,
};

export const messagesQueryKeys = {
  all: ["messages"] as const,
  lists: () => [...messagesQueryKeys.all, "list"] as const,
  list: (roomId: string) => [...messagesQueryKeys.lists(), roomId] as const,
};

export const roomsQueryKeys = {
  all: ["rooms"] as const,
  lists: () => [...roomsQueryKeys.all, "list"] as const,
};
