import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

// Mock book content
const MOCK_BOOK_CONTENT = [
    {
        chapter: "Part I",
        title: "Introduction",
        content: `This book does not claim to be an account of facts and events but of personal experiences, experiences which millions of people have suffered time and again. It is the inside story of a concentration camp, told by one of its survivors.

This tale is not concerned with the great horrors, which have already been described often enough (though less often believed), but with the multitude of small torments. In other words, it will try to answer this question: How was everyday life in a concentration camp reflected in the mind of the average prisoner?

Most of the events described here took place at Auschwitz and Dachau. This book's genesis is curious. It was written in nine successive days and nights. The author intended to publish it anonymously. Only the urgent advice of friends persuaded him to add his name to it.

The book's original title was to be "A Psychologist Experiences the Concentration Camp." When the manuscript was accepted for publication, the publisher suggested the title by which it is now known: "Man's Search for Meaning."

The experiences described in this book have, in many cases, been repeated millions of times over, and they are typical of life in a concentration camp. For this reason, and also for reasons which will become apparent, I have omitted mentioning the names of fellow-prisoners, of cruel as well as kind guards.`
    },
    {
        chapter: "Part II",
        title: "The Psychology of Camp Life",
        content: `The prisoner's psychological reactions are not only the result of the conditions of his physical environment but also the result of the freedom of choice he always has, even in the most severe conditions of psychic and physical stress.

We who lived in concentration camps can remember the men who walked through the huts comforting others, giving away their last piece of bread. They may have been few in number, but they offer sufficient proof that everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances, to choose one's own way.

And there were always choices to make. Every day, every hour, offered the opportunity to make a decision, a decision which determined whether you would or would not submit to those powers which threatened to rob you of your very self, your inner freedom; which determined whether or not you would become the plaything of circumstance.

What was really needed was a fundamental change in our attitude toward life. We had to learn ourselves and, furthermore, we had to teach the despairing men, that it did not really matter what we expected from life, but rather what life expected from us.

Life ultimately means taking the responsibility to find the right answer to its problems and to fulfill the tasks which it constantly sets for each individual.`
    },
    {
        chapter: "Part III",
        title: "The Will to Meaning",
        content: `Man's search for meaning is the primary motivation in his life and not a "secondary rationalization" of instinctual drives. This meaning is unique and specific in that it must and can be fulfilled by him alone; only then does it achieve a significance which will satisfy his own will to meaning.

There are some authors who contend that meanings and values are "nothing but defense mechanisms, reaction formations and sublimations." But as for myself, I would not be willing to live merely for the sake of my "defense mechanisms," nor would I be ready to die merely for the sake of my "reaction formations." Man's main concern is not to gain pleasure or to avoid pain but rather to see a meaning in his life. That is why man is even ready to suffer, on the condition, to be sure, that his suffering has a meaning.

But let me make it perfectly clear that in no way is suffering necessary to find meaning. I only insist that meaning is possible even in spite of suffering—provided, certainly, that the suffering is unavoidable. If it were avoidable, however, the meaningful thing to do would be to remove its cause, be it psychological, biological, or political. To suffer unnecessarily is masochistic rather than heroic.`
    },
    {
        chapter: "Part IV",
        title: "Suffering and Human Potential",
        content: `We must never forget that we may also find meaning in life even when confronted with a hopeless situation, when facing a fate that cannot be changed. For what then matters is to bear witness to the uniquely human potential at its best, which is to transform a personal tragedy into a triumph, to turn one's predicament into a human achievement.

When we are no longer able to change a situation—just think of an incurable disease such as inoperable cancer—we are challenged to change ourselves. Let me cite a clear-cut example: Once, an elderly general practitioner consulted me because of his severe depression. He could not overcome the loss of his wife who had died two years before and whom he had loved above all else.

Now, how could I help him? What should I tell him? Well, I refrained from telling him anything but instead confronted him with the question, "What would have happened, Doctor, if you had died first, and your wife would have had to survive you?" "Oh," he said, "for her this would have been terrible; how she would have suffered!" Whereupon I replied, "You see, Doctor, such a suffering has been spared her, and it was you who have spared her this suffering—to be sure, at the price that now you have to survive and mourn her." He said no word but shook my hand and calmly left my office. In some way, suffering ceases to be suffering at the moment it finds a meaning, such as the meaning of a sacrifice.`
    },
    {
        chapter: "Part V",
        title: "Conclusion — Meaning as the Ultimate Human Achievement",
        content: `The primary purpose in life is not the principle of power but the principle of meaning. The greatest task for any person is to find meaning in his or her life. Frankl saw three possible sources for meaning: in work (doing something significant), in love (caring for another person), and in courage during difficult times.

Suffering in and of itself is meaningless; we give our suffering meaning by the way in which we respond to it. Forces beyond your control can take away everything you possess except one thing, your freedom to choose how you will respond to the situation. You cannot control what happens to you in life, but you can always control what you will feel and do about what happens to you.

What man actually needs is not a tensionless state but rather the striving and struggling for a worthwhile goal, a freely chosen task. What he needs is not the discharge of tension at any cost but the call of a potential meaning waiting to be fulfilled by him.

In some ways suffering ceases to be suffering at the moment it finds a meaning, such as the meaning of a sacrifice. But let me make it perfectly clear that in no way is suffering necessary to find meaning. I only insist that meaning is possible even in spite of suffering—provided, certainly, that the suffering is unavoidable.`
    }
];

// Calculate reading time based on average reading speed (200-250 words per minute)
const calculateReadingTime = (text: string) => {
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 225);
    return minutes;
};

// Calculate total reading time for all content
const calculateTotalReadingTime = () => {
    let totalWords = 0;

    MOCK_BOOK_CONTENT.forEach(section => {
        totalWords += section.content.split(/\s+/).length;
    });

    return Math.ceil(totalWords / 225);
};

const totalReadingMinutes = calculateTotalReadingTime();

export default function ReadingScreen() {
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [currentScrollChapter, setCurrentScrollChapter] = useState(MOCK_BOOK_CONTENT[0]);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isPageMode, setIsPageMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [readingProgress, setReadingProgress] = useState(0);

    const scrollViewRef = useRef<ScrollView>(null);

    // Get current chapter based on mode
    const currentChapter = isPageMode ? MOCK_BOOK_CONTENT[currentChapterIndex] : currentScrollChapter;

    // Calculate chapter element positions for scroll mode
    const [chapterPositions, setChapterPositions] = useState<{ index: number; y: number }[]>([]);

    const navigateBack = () => {
        router.back();
    };

    const goToNextChapter = () => {
        if (currentChapterIndex < MOCK_BOOK_CONTENT.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
            setCurrentPage(0);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        }
    };

    const goToPreviousChapter = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(currentChapterIndex - 1);
            setCurrentPage(0);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        }
    };

    // Updated handleScroll function to handle both reading modes and update current chapter in scroll mode
    const handleScroll = (event: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const scrollY = contentOffset.y;
        const progress = scrollY / (contentSize.height - layoutMeasurement.height);

        if (isPageMode) {
            // In page mode, we track progress within the current chapter
            setReadingProgress(Math.min(Math.max(progress, 0), 1));
        } else {
            // In scroll mode, progress represents overall book progress directly
            setReadingProgress(Math.min(Math.max(progress, 0), 1));

            // Update the current chapter based on scroll position
            if (chapterPositions.length > 0) {
                // Find the last chapter position that's less than current scroll
                let currentIndex = 0;
                for (let i = 0; i < chapterPositions.length; i++) {
                    if (scrollY >= chapterPositions[i].y) {
                        currentIndex = i;
                    } else {
                        break;
                    }
                }

                // Only update if chapter changed
                if (currentScrollChapter !== MOCK_BOOK_CONTENT[currentIndex]) {
                    setCurrentScrollChapter(MOCK_BOOK_CONTENT[currentIndex]);
                }
            }
        }
    };

    // Track chapter element positions for scroll mode
    const measureChapterPosition = (y: number, index: number) => {
        // We subtract a small offset to trigger the chapter change slightly before reaching it
        const position = { index, y: Math.max(0, y - 10) };

        setChapterPositions(prevPositions => {
            const existing = prevPositions.find(p => p.index === index);
            if (existing) return prevPositions;
            return [...prevPositions, position].sort((a, b) => a.y - b.y);
        });
    };

    // Updated overallProgress function to handle both reading modes
    const overallProgress = () => {
        if (!isPageMode) {
            // In scroll mode, reading progress directly represents overall book progress
            return readingProgress;
        } else {
            // In page mode, calculate based on chapters and current chapter progress
            let wordsRead = 0;
            let totalWords = 0;

            for (let i = 0; i < MOCK_BOOK_CONTENT.length; i++) {
                const chapterWords = MOCK_BOOK_CONTENT[i].content.split(/\s+/).length;
                totalWords += chapterWords;

                if (i < currentChapterIndex) {
                    // All previous chapters are fully read
                    wordsRead += chapterWords;
                } else if (i === currentChapterIndex) {
                    // Current chapter is partially read based on scrolling progress
                    wordsRead += chapterWords * readingProgress;
                }
                // Future chapters haven't been read yet
            }

            return Math.min(Math.max(wordsRead / totalWords, 0), 1);
        }
    };

    // Determine remaining time based on overall progress
    const calculateRemainingTime = () => {
        const progress = overallProgress();
        return totalReadingMinutes - (totalReadingMinutes * progress);
    };

    // Get the remaining reading time
    const remainingMinutes = calculateRemainingTime();

    const togglePageMode = () => {
        // When switching modes, reset positions and update current chapter reference
        if (isPageMode) {
            // Switching to scroll mode
            setChapterPositions([]);
        } else {
            // Switching to page mode - find closest chapter to current scroll position
            if (chapterPositions.length > 0 && currentScrollChapter) {
                const index = MOCK_BOOK_CONTENT.findIndex(ch => ch.chapter === currentScrollChapter.chapter);
                if (index >= 0) setCurrentChapterIndex(index);
            }
        }
        setIsPageMode(!isPageMode);
    };


    // Background and text colors based on mode
    const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-stone-50';
    const textColor = isDarkMode ? 'text-stone-200' : 'text-stone-800';
    const headerBgColor = isDarkMode ? 'bg-gray-800' : 'bg-background';
    const controlBgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
    const controlBorderColor = isDarkMode ? 'border-gray-700' : 'border-stone-200';

    return (
        <SafeAreaView className={`flex-1 ${bgColor}`}>

            {/* Header */}
            <View className={`py-4 px-4 ${headerBgColor} flex-row justify-between items-center`}>
                <TouchableOpacity onPress={navigateBack} className="flex-row items-center">
                    <Ionicons name="chevron-back" size={20} color={isDarkMode ? '#e2e2e2' : '#737373'} />
                    <Text className={`ml-1 font-dmsans-regular ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>Back</Text>
                </TouchableOpacity>

                <Text className={`font-dmsans-medium mr-10 ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                    {currentChapter.chapter}
                </Text>

                <TouchableOpacity onPress={() => setIsSettingsVisible(true)}>
                    <Ionicons name="settings-outline" size={22} color={isDarkMode ? '#e2e2e2' : '#737373'} />
                </TouchableOpacity>
            </View>

            {/* Reading Progress Bar */}
            <View className="w-full h-1">
                <View
                    className="h-full bg-primary"
                    style={{ width: `${overallProgress() * 100}%` }}
                />
            </View>

            {/* Book Content */}
            {!isPageMode ? (
                <ScrollView
                    className="px-4"
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {MOCK_BOOK_CONTENT.map((chapter, index) => (
                        <View
                            key={`chapter-${index}`}
                            className="mb-8"
                            onLayout={(event) => {
                                const { y } = event.nativeEvent.layout;
                                measureChapterPosition(y, index);
                            }}
                        >
                            <Text className={`text-xl font-dmsans-bold mb-3 ${textColor}`}>
                                {chapter.title}
                            </Text>
                            <Text className={`${textColor} leading-relaxed`} style={{ fontSize: fontSize }}>
                                {chapter.content}
                            </Text>

                            {index < MOCK_BOOK_CONTENT.length - 1 && (
                                <View className="h-px bg-stone-200 dark:bg-gray-700 my-8" />
                            )}
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 px-5 py-6"
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <Text className={`text-xl font-dmsans-bold mb-3 ${textColor}`}>
                        {currentChapter.title}
                    </Text>
                    <Text className={`${textColor} leading-relaxed`} style={{ fontSize: fontSize }}>
                        {currentChapter.content}
                    </Text>

                    {/* Next/Previous Chapter Navigation */}
                    <View className="flex-row justify-between items-center my-10">
                        <TouchableOpacity
                            onPress={goToPreviousChapter}
                            className={`py-2 px-4 rounded-full ${controlBgColor} ${controlBorderColor} border ${currentChapterIndex === 0 ? 'opacity-30' : ''}`}
                            disabled={currentChapterIndex === 0}
                        >
                            <Text className={`font-dmsans-medium ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>Previous Chapter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={goToNextChapter}
                            className={`py-2 px-4 rounded-full ${controlBgColor} ${controlBorderColor} border ${currentChapterIndex === MOCK_BOOK_CONTENT.length - 1 ? 'opacity-30' : ''}`}
                            disabled={currentChapterIndex === MOCK_BOOK_CONTENT.length - 1}
                        >
                            <Text className={`font-dmsans-medium ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>Next Chapter</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* Bottom Reading Info Bar */}
            <View className={`px-5 py-3 pb-9 flex-row justify-between items-center ${headerBgColor} border-t ${controlBorderColor}`}>
                <View>
                    <Text className={`font-dmsans-regular text-xs ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                        {Math.floor(overallProgress() * 100)}% complete
                    </Text>
                </View>

                <View className="flex-row items-center  mr-20">
                    <Ionicons name="time-outline" size={16} color={isDarkMode ? '#a0a0a0' : '#737373'} />
                    <Text className={`ml-1 font-dmsans-regular text-xs ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                        {Math.round(remainingMinutes)} mins left
                    </Text>
                </View>

                <TouchableOpacity onPress={togglePageMode}>
                    <Ionicons
                        name={isPageMode ? "book-outline" : "albums-outline"}
                        size={18}
                        color={isDarkMode ? '#a0a0a0' : '#737373'}
                    />
                </TouchableOpacity>
            </View>

            {/* Settings Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isSettingsVisible}
                onRequestClose={() => setIsSettingsVisible(false)}
            >
                <View className="flex-1 justify-end">
                    <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl px-5 pt-6 pb-10`}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className={`text-lg font-dmsans-bold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                                Reading Settings
                            </Text>
                            <TouchableOpacity onPress={() => setIsSettingsVisible(false)}>
                                <Ionicons name="close" size={24} color={isDarkMode ? '#e2e2e2' : '#737373'} />
                            </TouchableOpacity>
                        </View>

                        {/* Font Size Setting */}
                        <View className="mb-6">
                            <Text className={`font-dmsans-medium mb-2 ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                                Font Size
                            </Text>
                            <View className="flex-row items-center">
                                <Text className={`font-dmsans-regular ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>A</Text>
                                <Slider
                                    style={{ flex: 1, height: 40, marginHorizontal: 10 }}
                                    minimumValue={14}
                                    maximumValue={28}
                                    step={1}
                                    value={fontSize}
                                    onValueChange={setFontSize}
                                    minimumTrackTintColor={isDarkMode ? '#5e8f91' : '#01383d'}
                                    maximumTrackTintColor={isDarkMode ? '#4a4a4a' : '#d1d1d1'}
                                    thumbTintColor={isDarkMode ? '#5e8f91' : '#01383d'}
                                />
                                <Text className={`font-dmsans-regular text-xl ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>A</Text>
                            </View>
                        </View>

                        {/* Reading Mode Setting */}
                        <View className="mb-6">
                            <Text className={`font-dmsans-medium mb-3 ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                                Reading Mode
                            </Text>
                            <View className="flex-row">
                                <TouchableOpacity
                                    onPress={() => setIsPageMode(false)}
                                    className={`flex-1 py-3 mr-2 rounded-xl border flex items-center justify-center 
                    ${!isPageMode
                                            ? (isDarkMode ? 'bg-gray-700 border-primary' : 'bg-stone-100 border-primary')
                                            : (isDarkMode ? 'border-gray-700' : 'border-stone-200')}`
                                    }
                                >
                                    <Ionicons name="albums-outline" size={20} color={isDarkMode ? '#e2e2e2' : '#737373'} />
                                    <Text className={`mt-1 font-dmsans-regular ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                                        Scroll
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setIsPageMode(true)}
                                    className={`flex-1 py-3 ml-2 rounded-xl border flex items-center justify-center
                                        ${isPageMode
                                            ? (isDarkMode ? 'bg-gray-700 border-primary' : 'bg-stone-100 border-primary')
                                            : (isDarkMode ? 'border-gray-700' : 'border-stone-200')}`
                                    }
                                >
                                    <Ionicons name="book-outline" size={20} color={isDarkMode ? '#e2e2e2' : '#737373'} />
                                    <Text className={`mt-1 font-dmsans-regular ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                                        Pages
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Theme Setting */}
                        <View className="mb-6">
                            <Text className={`font-dmsans-medium mb-3 ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                                Theme
                            </Text>
                            <View className="flex-row">
                                <TouchableOpacity
                                    onPress={() => setIsDarkMode(false)}
                                    className={`flex-1 py-3 mr-2 rounded-xl border flex items-center justify-center 
                    ${!isDarkMode
                                            ? 'bg-stone-100 border-primary'
                                            : 'border-stone-200'}`
                                    }
                                >
                                    <Ionicons name="sunny-outline" size={20} color="#737373" />
                                    <Text className="mt-1 font-dmsans-regular text-stone-600">
                                        Light
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setIsDarkMode(true)}
                                    className={`flex-1 py-3 ml-2 rounded-xl border flex items-center justify-center
                    ${isDarkMode
                                            ? 'bg-gray-700 border-primary'
                                            : 'border-stone-200'}`
                                    }
                                >
                                    <Ionicons name="moon-outline" size={20} color={isDarkMode ? '#e2e2e2' : '#737373'} />
                                    <Text className={`mt-1 font-dmsans-regular ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                                        Dark
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}