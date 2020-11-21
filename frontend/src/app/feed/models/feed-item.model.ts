export interface FeedItem {
    feedItemId: string;
    userId: string;
    url: string;
    caption: string;
    commentsCount: number;
    likesCount: number;
    createdAt: Date;
    updatedAt?: Date;
}

export const feedItemMocks: FeedItem[] = [
    {
        feedItemId: 'a2d5eacb-f54d-4853-b810-9049100a56ee',
        userId: '9d68070a-92e0-4e86-84d6-d57594806759',
        url: '/assets/mock/xander0.jpg',
        caption: 'Such a cute pup',
        commentsCount: 0,
        likesCount: 0,
        createdAt: new Date
    },
    {
        feedItemId: 'a2d5eacb-f54d-4853-b810-9049100a56ee',
        userId: '9d68070a-92e0-4e86-84d6-d57594806759',
        url: '/assets/mock/xander1.jpg',
        caption: 'Who\'s a good boy?',
        commentsCount: 0,
        likesCount: 0,
        createdAt: new Date
    },
    {
        feedItemId: 'a2d5eacb-f54d-4853-b810-9049100a56ee',
        userId: '9d68070a-92e0-4e86-84d6-d57594806759',
        url: '/assets/mock/xander2.jpg',
        caption: 'Majestic.',
        commentsCount: 0,
        likesCount: 0,
        createdAt: new Date
    }
];
