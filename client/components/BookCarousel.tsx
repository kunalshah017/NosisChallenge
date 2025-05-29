import React, { useRef, useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { useTopBooks } from '~/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface BookCarouselProps {
    title: string;
    period: 'week' | 'month' | 'random';
    onBookPress?: (bookId: string) => void;
}

// Skeleton Loading Component
const SkeletonLoader = React.memo(() => {
    return (
        <View className="my-5">
            {/* Header Skeleton */}
            <View className="flex-row justify-between items-center px-4 mb-6">
                <View className="bg-gray-200 dark:bg-gray-700 h-8 w-48 rounded animate-pulse" />
                <View className="flex-row gap-5 items-center">
                    <View className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <View className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </View>
            </View>

            {/* Carousel Skeleton */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                scrollEnabled={false}
            >
                {Array(5).fill(0).map((_, index) => (
                    <View key={index} className="w-36 mr-4">
                        {/* Book Cover Skeleton */}
                        <View className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
                            <View className="w-full h-52 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </View>

                        {/* Title Skeleton */}
                        <View className="mt-1 space-y-1">
                            <View className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded animate-pulse" />
                            <View className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded animate-pulse" />
                        </View>

                        {/* Author Skeleton */}
                        <View className="bg-gray-200 dark:bg-gray-700 h-3 w-2/3 rounded mt-1 animate-pulse" />

                        {/* Reading Time Skeleton */}
                        <View className="bg-gray-200 dark:bg-gray-700 h-3 w-1/2 rounded mt-1 animate-pulse" />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
});

const BookCarousel = React.memo<BookCarouselProps>(({ title, period, onBookPress }) => {
    const { data: books, isLoading } = useTopBooks(period);
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentScrollX, setCurrentScrollX] = useState(0);

    // Memoize constants to avoid recalculation
    const scrollConstants = useMemo(() => {
        const ITEM_WIDTH = 144 + 16; // w-36 (144px) + mr-4 (16px)
        const SCROLL_DISTANCE = ITEM_WIDTH * 2;
        const VISIBLE_ITEMS_WIDTH = ITEM_WIDTH * 2.5;

        return {
            ITEM_WIDTH,
            SCROLL_DISTANCE,
            VISIBLE_ITEMS_WIDTH,
        };
    }, []);

    // Memoize scroll bounds calculation
    const scrollBounds = useMemo(() => {
        if (!books?.length) return { maxScrollX: 0, isAtStart: true, isAtEnd: true };

        const maxScrollX = (books.length * scrollConstants.ITEM_WIDTH) - scrollConstants.VISIBLE_ITEMS_WIDTH;
        const isAtStart = currentScrollX <= 0;
        const isAtEnd = currentScrollX >= maxScrollX - 100;

        return { maxScrollX, isAtStart, isAtEnd };
    }, [books?.length, currentScrollX, scrollConstants]);

    // Memoize scroll functions to prevent recreation on every render
    const scrollLeft = useCallback(() => {
        const newX = Math.max(0, currentScrollX - scrollConstants.SCROLL_DISTANCE);
        scrollViewRef.current?.scrollTo({
            x: newX,
            animated: true,
        });
        setCurrentScrollX(newX);
    }, [currentScrollX, scrollConstants.SCROLL_DISTANCE]);

    const scrollRight = useCallback(() => {
        const newX = Math.min(scrollBounds.maxScrollX, currentScrollX + scrollConstants.SCROLL_DISTANCE);
        scrollViewRef.current?.scrollTo({
            x: newX,
            animated: true,
        });
        setCurrentScrollX(newX);
    }, [currentScrollX, scrollBounds.maxScrollX, scrollConstants.SCROLL_DISTANCE]);

    // Memoize scroll handler
    const handleScroll = useCallback((event: any) => {
        setCurrentScrollX(event.nativeEvent.contentOffset.x);
    }, []);

    // Memoize navigation buttons to prevent recreation
    const navigationButtons = useMemo(() => (
        <View className="flex-row gap-5 items-center">
            <Pressable
                onPress={scrollLeft}
                className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 items-center justify-center"
                disabled={scrollBounds.isAtStart}
            >
                <ChevronLeft
                    size={16}
                    color={scrollBounds.isAtStart ? '#d1d5db' : undefined}
                    className={`${scrollBounds.isAtStart ? 'text-gray-300' : 'text-primary dark:text-neutral-400'}`}
                />
            </Pressable>
            <Pressable
                onPress={scrollRight}
                className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 items-center justify-center"
                disabled={scrollBounds.isAtEnd}
            >
                <ChevronRight
                    size={16}
                    color={scrollBounds.isAtEnd ? '#d1d5db' : undefined}
                    className={`${scrollBounds.isAtEnd ? 'text-gray-300' : 'text-primary dark:text-neutral-400'}`}
                />
            </Pressable>
        </View>
    ), [scrollLeft, scrollRight, scrollBounds.isAtStart, scrollBounds.isAtEnd]);

    // Show skeleton while loading
    if (isLoading) {
        return <SkeletonLoader />;
    }

    // Return null if no books after loading
    if (!books) return null;

    return (
        <View className="my-5">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 mb-6">
                <Text className="text-2xl font-dmsans-bold text-primary">
                    {title}
                </Text>
                {navigationButtons}
            </View>

            {/* Carousel */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {books.map((book) => (
                    <BookItem
                        key={book.id}
                        book={book}
                        onPress={onBookPress}
                    />
                ))}
            </ScrollView>
        </View>
    );
});

const BookItem = React.memo<{
    book: any;
    onPress?: (bookId: string) => void;
}>(({ book, onPress }) => {
    const handlePress = useCallback(() => {
        onPress?.(book.id);
    }, [book.id, onPress]);

    return (
        <Pressable
            className="w-36 mr-4"
            onPress={handlePress}
        >
            <View className="rounded-xl overflow-hidden bg-white dark:bg-neutral-800 shadow-md">
                <Image
                    source={{ uri: book.coverImage }}
                    className="w-full h-52"
                    resizeMode="cover"
                />
            </View>
            <Text
                className="text-sm font-dmsans-semibold mt-1 text-black dark:text-white"
                numberOfLines={2}
            >
                {book.title}
            </Text>
            <Text className="font-dmsans-regular text-xs text-neutral-500 dark:text-neutral-400">
                {book.authorName}
            </Text>
            <Text className="font-dmsans-regular text-xs text-neutral-400 dark:text-neutral-500">
                {book.readingTime !== "Unknown" ? book.readingTime : ''}
            </Text>
        </Pressable>
    );
});

SkeletonLoader.displayName = 'SkeletonLoader';
BookCarousel.displayName = 'BookCarousel';
BookItem.displayName = 'BookItem';

export default BookCarousel;