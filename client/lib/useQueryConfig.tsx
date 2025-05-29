export const queryConfig = {
    week: {
        staleTime: 1000 * 60 * 60 * 24 * 7,     // 7 days
        gcTime: 1000 * 60 * 60 * 24 * 7,     // 7 days
    },
    month: {
        staleTime: 1000 * 60 * 60 * 24 * 30,    // 30 days
        gcTime: 1000 * 60 * 60 * 24 * 30,    // 30 days
    },
    random: {
        staleTime: 1000 * 60 * 30,              // 30 minutes
        gcTime: 1000 * 60 * 60 * 6,              // 6 hours
    },
    bookDetails: {
        staleTime: 1000 * 60 * 60,              // 1 hour
        gcTime: 1000 * 60 * 60 * 24,         // 1 day
    },
    booksByCategory: {
        staleTime: 1000 * 60 * 30,              // 30 minutes
        gcTime: 1000 * 60 * 60 * 6,          // 6 hours
    },

    // Real-time data (health checks)
    realtime: {
        staleTime: 0,
        gcTime: 1000 * 60, // 1 minute
    },
};

