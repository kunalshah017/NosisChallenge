import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    AppState,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import Slider from '@react-native-community/slider';
import { useColorScheme } from '~/lib/useColorScheme';
import Dropdown from '~/components/Dropdown';

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

const ListeningScreen = () => {
    const { colors, isDarkColorScheme } = useColorScheme();

    // Audio state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0); // seconds
    const [totalDuration, setTotalDuration] = useState(0); // seconds
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [isSeeking, setIsSeeking] = useState(false);

    // UI state
    const [isExpanded, setIsExpanded] = useState(true);

    // Refs
    const positionUpdateInterval = useRef<number | NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const isCurrentlyPlaying = useRef<boolean>(false);

    // Book info
    const bookTitle = "Man's Search for Meaning";
    const bookAuthor = "Viktor Frankl";
    const currentChapter = MOCK_BOOK_CONTENT[currentChapterIndex];

    // Speed options
    const speedOptions = [
        { label: '0.5x', value: '0.5', icon: 'speedometer-outline' },
        { label: '0.75x', value: '0.75', icon: 'speedometer-outline' },
        { label: '1.0x (Normal)', value: '1.0', icon: 'speedometer-outline' },
        { label: '1.25x', value: '1.25', icon: 'speedometer-outline' },
        { label: '1.5x', value: '1.5', icon: 'speedometer-outline' },
        { label: '2.0x', value: '2.0', icon: 'speedometer-outline' },
    ];

    // Calculate estimated duration based on word count and reading speed
    const calculateDuration = (text: string): number => {
        const words = text.split(/\s+/).length;
        const wordsPerMinute = 150 / playbackRate;
        return Math.ceil((words / wordsPerMinute) * 60);
    };

    // Initialize chapter data
    useEffect(() => {
        setTotalDuration(calculateDuration(currentChapter.content));
        setCurrentPosition(0);

        // Stop any playing audio when chapter changes
        if (isCurrentlyPlaying.current) {
            Speech.stop();
            setIsPlaying(false);
            isCurrentlyPlaying.current = false;
        }
    }, [currentChapterIndex, playbackRate]);

    // Handle background play
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'background' && isPlaying) {
                console.log('App moved to background, continuing audio playback');
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [isPlaying]);

    // Position tracking timer
    useEffect(() => {
        if (isPlaying && !isSeeking) {
            positionUpdateInterval.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setCurrentPosition(prev => {
                    const newPosition = Math.min(elapsed, totalDuration);

                    // Auto-advance to next chapter when finished
                    if (newPosition >= totalDuration && isCurrentlyPlaying.current) {
                        handleNextChapter();
                        return totalDuration;
                    }

                    return newPosition;
                });
            }, 1000);
        } else {
            if (positionUpdateInterval.current) {
                clearInterval(positionUpdateInterval.current);
                positionUpdateInterval.current = null;
            }
        }

        return () => {
            if (positionUpdateInterval.current) {
                clearInterval(positionUpdateInterval.current);
                positionUpdateInterval.current = null;
            }
        };
    }, [isPlaying, isSeeking, totalDuration]);

    const startPlayback = async (startFromPosition: number = 0) => {
        try {
            const textToSpeak = currentChapter.content;

            // Calculate which part of text to start from
            const progress = startFromPosition / totalDuration;
            const words = textToSpeak.split(/\s+/);
            const startWordIndex = Math.floor(progress * words.length);
            const textFromPosition = words.slice(startWordIndex).join(' ');

            if (!textFromPosition.trim()) {
                return;
            }

            isCurrentlyPlaying.current = true;
            startTimeRef.current = Date.now() - (startFromPosition * 1000);

            await Speech.speak(textFromPosition, {
                rate: playbackRate,
                onStart: () => {
                    setIsPlaying(true);
                },
                onDone: () => {
                    setIsPlaying(false);
                    isCurrentlyPlaying.current = false;
                    if (!isSeeking) {
                        handleNextChapter();
                    }
                },
                onStopped: () => {
                    setIsPlaying(false);
                    isCurrentlyPlaying.current = false;
                },
                onError: (error) => {
                    console.error('Speech error:', error);
                    setIsPlaying(false);
                    isCurrentlyPlaying.current = false;
                    Alert.alert('Error', 'Failed to play audio');
                }
            });
        } catch (error) {
            console.error('Speech error:', error);
            setIsPlaying(false);
            isCurrentlyPlaying.current = false;
            Alert.alert('Error', 'Failed to control audio playback');
        }
    };

    const handlePlayPause = async () => {
        try {
            if (isPlaying) {
                await Speech.stop();
                setIsPlaying(false);
                isCurrentlyPlaying.current = false;
            } else {
                await startPlayback(currentPosition);
            }
        } catch (error) {
            console.error('Speech error:', error);
            Alert.alert('Error', 'Failed to control audio playback');
        }
    };

    const handleSeekStart = () => {
        setIsSeeking(true);
    };

    const handleSeekComplete = async (value: number) => {
        const newPosition = Math.floor(value * totalDuration);
        setCurrentPosition(newPosition);
        setIsSeeking(false);

        if (isPlaying) {
            await Speech.stop();
            await startPlayback(newPosition);
        }
    };

    const handleSeekChange = (value: number) => {
        if (isSeeking) {
            const newPosition = Math.floor(value * totalDuration);
            setCurrentPosition(newPosition);
        }
    };

    const handleSkip = async (seconds: number) => {
        const newPosition = Math.max(0, Math.min(currentPosition + seconds, totalDuration));
        setCurrentPosition(newPosition);

        if (isPlaying) {
            await Speech.stop();
            await startPlayback(newPosition);
        }
    };

    const handleNextChapter = async () => {
        await Speech.stop();
        setIsPlaying(false);
        isCurrentlyPlaying.current = false;

        if (currentChapterIndex < MOCK_BOOK_CONTENT.length - 1) {
            setCurrentChapterIndex(prev => prev + 1);
        } else {
            Alert.alert('Book Complete', 'You have finished listening to the entire book!');
        }
    };

    const handlePreviousChapter = async () => {
        await Speech.stop();
        setIsPlaying(false);
        isCurrentlyPlaying.current = false;

        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(prev => prev - 1);
        }
    };

    const handleSpeedChange = async (value: string) => {
        const newRate = parseFloat(value);
        setPlaybackRate(newRate);

        // If currently playing, restart with new speed
        if (isPlaying) {
            await Speech.stop();
            setTimeout(() => {
                startPlayback(currentPosition);
            }, 100);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleGoBack = async () => {
        await Speech.stop();
        setIsPlaying(false);
        isCurrentlyPlaying.current = false;
        router.back();
    };

    const progress = totalDuration > 0 ? currentPosition / totalDuration : 0;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Speech.stop();
            if (positionUpdateInterval.current) {
                clearInterval(positionUpdateInterval.current);
            }
        };
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <View className="px-4 py-4 flex-row justify-between items-center border-b border-stone-200 dark:border-gray-700">
                <TouchableOpacity className="flex-row items-center" onPress={handleGoBack}>
                    <Ionicons name="chevron-back" size={20} color={colors.foreground} />
                    <Text className="text-foreground ml-1 font-dmsans-regular">Back</Text>
                </TouchableOpacity>

                <Text className="text-foreground text-lg font-dmsans-bold mr-10">Listen</Text>

                <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                    <Ionicons
                        name={isExpanded ? "chevron-down" : "chevron-up"}
                        size={20}
                        color={colors.foreground}
                    />
                </TouchableOpacity>
            </View>

            {/* Expanded Content View */}
            {isExpanded && (
                <View className="flex-1 px-4 py-4 max-h-[30%]">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text className="text-foreground text-xl font-dmsans-bold mb-3">
                            {currentChapter.title}
                        </Text>
                        <Text className="text-foreground leading-relaxed font-dmsans-regular">
                            {currentChapter.content}
                        </Text>
                    </ScrollView>
                </View>
            )}

            {/* Audio Player UI */}
            <View className="flex-1 justify-center px-6 pb-5 bg-card border-t border dark:border-gray-700">
                {/* Book Info */}
                <View className="items-center mb-6">
                    <View className="w-32 h-32 bg-primary/20 rounded-xl items-center justify-center mb-4">
                        <Ionicons name="book" size={48} color={colors.primary} />
                    </View>

                    <Text className="text-foreground text-xl font-dmsans-bold text-center mb-1">
                        {bookTitle}
                    </Text>
                    <Text className="text-stone-500 dark:text-stone-400 font-dmsans-regular mb-1">
                        {bookAuthor}
                    </Text>
                    <Text className="text-stone-500 dark:text-stone-400 text-sm font-dmsans-regular">
                        {currentChapter.chapter} • {currentChapter.title}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View className="mb-4">
                    <Slider
                        style={{ height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={progress}
                        onSlidingStart={handleSeekStart}
                        onSlidingComplete={handleSeekComplete}
                        onValueChange={handleSeekChange}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={isDarkColorScheme ? '#4a4a4a' : '#d1d1d1'}
                        thumbTintColor={colors.primary}
                    />

                    {/* Time Labels */}
                    <View className="flex-row justify-between mt-1">
                        <Text className="text-stone-500 dark:text-stone-400 text-xs font-dmsans-regular">
                            {formatTime(currentPosition)}
                        </Text>
                        <Text className="text-stone-500 dark:text-stone-400 text-xs font-dmsans-regular">
                            {formatTime(totalDuration)}
                        </Text>
                    </View>
                </View>

                {/* Main Controls */}
                <View className="flex-row items-center justify-center mb-8">
                    {/* Previous Chapter */}
                    <TouchableOpacity
                        onPress={handlePreviousChapter}
                        className="w-12 h-12 items-center justify-center"
                        disabled={currentChapterIndex === 0}
                    >
                        <Ionicons
                            name="play-skip-back"
                            size={24}
                            color={currentChapterIndex === 0 ? colors.tabBarInactiveTint : colors.foreground}
                        />
                    </TouchableOpacity>

                    {/* Back 15s */}
                    <TouchableOpacity
                        onPress={() => handleSkip(-15)}
                        className="w-12 h-12 items-center justify-center mx-4"
                    >
                        <Ionicons name="play-back" size={28} color={colors.foreground} />
                    </TouchableOpacity>

                    {/* Play/Pause */}
                    <TouchableOpacity
                        onPress={handlePlayPause}
                        className="w-16 h-16 bg-primary rounded-full items-center justify-center mx-4"
                    >
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={32}
                            color="white"
                            style={{ marginLeft: isPlaying ? 0 : 3 }}
                        />
                    </TouchableOpacity>

                    {/* Forward 15s */}
                    <TouchableOpacity
                        onPress={() => handleSkip(15)}
                        className="w-12 h-12 items-center justify-center mx-4"
                    >
                        <Ionicons name="play-forward" size={28} color={colors.foreground} />
                    </TouchableOpacity>

                    {/* Next Chapter */}
                    <TouchableOpacity
                        onPress={handleNextChapter}
                        className="w-12 h-12 items-center justify-center"
                        disabled={currentChapterIndex === MOCK_BOOK_CONTENT.length - 1}
                    >
                        <Ionicons
                            name="play-skip-forward"
                            size={24}
                            color={currentChapterIndex === MOCK_BOOK_CONTENT.length - 1 ? colors.tabBarInactiveTint : colors.foreground}
                        />
                    </TouchableOpacity>
                </View>

                {/* Additional Controls */}
                <View className="flex-row items-center justify-between">
                    {/* Speed Control Dropdown */}
                    <View className='flex-1 max-w-[70%] bg-background px-4 rounded-[14px]'>
                        <Dropdown
                            title="Playback Speed"
                            options={speedOptions}
                            selectedValue={playbackRate.toString()}
                            onSelect={handleSpeedChange}
                            placeholder={playbackRate.toString() + "x"}
                        />
                    </View>

                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={16} color={colors.tabBarInactiveTint} />
                        <Text className="text-stone-500 dark:text-stone-400 text-sm font-dmsans-regular ml-1">
                            {formatTime(totalDuration - currentPosition)} left
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ListeningScreen;