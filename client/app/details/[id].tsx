import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useBookDetails } from '~/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// Skeleton loading component
const SkeletonLoading = () => {
    return (
        <View className="flex-1 bg-lightBackground pt-12">
            <View className="px-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="w-20 h-6 bg-stone-200 rounded-md" />
                </View>
                <View className="w-6 h-6 bg-stone-200 rounded-full" />
            </View>

            <View className="items-center mt-8">
                <View className="w-[180px] h-[270px] bg-stone-200 rounded-lg" />
            </View>

            <View className="px-6 mt-6 items-center">
                <View className="w-3/4 h-7 bg-stone-200 rounded-md mb-2" />
                <View className="w-1/2 h-5 bg-stone-200 rounded-md mb-4" />
                <View className="w-1/3 h-4 bg-stone-200 rounded-md mb-4" />

                <View className="flex-row space-x-2 mb-6">
                    <View className="px-4 py-2 bg-stone-200 rounded-full" />
                    <View className="px-4 py-2 bg-stone-200 rounded-full" />
                    <View className="px-4 py-2 bg-stone-200 rounded-full" />
                </View>
            </View>

            <View className="px-6 mt-4">
                <View className="w-1/4 h-6 bg-stone-200 rounded-md mb-3" />
                <View className="w-full h-4 bg-stone-200 rounded-md mb-2" />
                <View className="w-full h-4 bg-stone-200 rounded-md mb-2" />
                <View className="w-3/4 h-4 bg-stone-200 rounded-md mb-6" />
            </View>

            <View className="px-6 mt-4">
                <View className="w-1/4 h-6 bg-stone-200 rounded-md mb-3" />
                <View className="w-full h-14 bg-stone-200 rounded-md mb-2" />
                <View className="w-full h-14 bg-stone-200 rounded-md mb-2" />
            </View>
        </View>
    );
};

const ChapterItem = ({ number, title }: { number: string; title: string }) => (
    <TouchableOpacity className="flex-row items-center py-3 px-6 border-b border-stone-200">
        <Text className="text-stone-600 w-16 font-dmsans-regular">{number}</Text>
        <Text className="flex-1 text-stone-800 font-dmsans-regular">{title}</Text>
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
);

const CategoryChip = ({ name }: { name: string }) => (
    <View className="px-4 py-1 bg-stone-200 rounded-full m-1">
        <Text className="text-stone-700 text-sm font-dmsans-regular">{name}</Text>
    </View>
);

export default function BookDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: book, isLoading, error } = useBookDetails(id!);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handleGoBack = () => {
        router.back();
    };

    const handleStartReading = () => {
        // Handle start reading action
        console.log('Start reading:', id);
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    if (isLoading) {
        return <SkeletonLoading />;
    }

    if (error || !book) {
        return (
            <View className="flex-1 justify-center items-center bg-stone-50 px-4">
                <Text className="text-lg text-red-600 mb-4 font-dmsans-medium">Failed to load book details</Text>
                <TouchableOpacity
                    className="px-6 py-2 bg-stone-200 rounded-full"
                    onPress={handleGoBack}
                >
                    <Text className="text-stone-800 font-dmsans-medium">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const chapters = [
        { number: "Part I", title: "Introduction" },
        { number: "Part II", title: "The Psychology of Camp Life" },
        { number: "Part III", title: "The Will to Meaning" },
        { number: "Part IV", title: "Suffering and Human Potential" },
        { number: "Part V", title: "Conclusion — Meaning as the Ultimate Human Achievement" },
    ];

    // Description logic
    const shouldTruncate = book.description && book.description.length > 200;
    const displayDescription = shouldTruncate && !isDescriptionExpanded
        ? book.description?.substring(0, 200) + "..."
        : book.description?.substring(0, 500);

    return (
        <>
            <ScrollView className='bg-lightBackground'>
                <View className="py-6 bg-background">
                    {/* Header */}
                    <View className="px-4 flex-row justify-between items-center">
                        <TouchableOpacity className="flex-row items-center" onPress={handleGoBack}>
                            <Ionicons name="chevron-back" size={20} color="#737373" />
                            <Text className="text-[#737373] ml-1 font-dmsans-regular">Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-horizontal" size={22} color="#737373" />
                        </TouchableOpacity>
                    </View>

                    {/* Book Cover */}
                    <View className="items-center mt-12">
                        <Image
                            source={{ uri: book.highResCover }}
                            className="w-[180px] h-[270px] rounded-lg"
                            resizeMode="cover"
                        />
                    </View>

                    {/* Book Title & Author */}
                    <View className="px-6 mt-6 items-center">
                        <Text className="text-2xl text-center mb-1 font-dmsans-bold">{book.title}</Text>
                        <Text className="text-stone-500 mb-3 font-dmsans-regular">{book.authors.join(", ")}</Text>

                        {/* Stats */}
                        <View className="flex-row items-center mb-4">
                            <Text className="text-sm text-stone-500 font-dmsans-regular">{book.pageCount || "5"} parts</Text>
                            <View className="w-1 h-1 bg-stone-400 rounded-full mx-2" />
                            <Text className="text-sm text-stone-500 font-dmsans-regular">{book.readingTime || "0 mins"}</Text>
                        </View>

                        {/* Categories */}
                        <View className="flex-row flex-wrap justify-center mb-6">
                            {(book.categories || []).map((category, i) => (
                                <CategoryChip key={i} name={category} />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Preface Section */}
                {book.description && (
                    <View className="px-6 mt-5">
                        <Text className="text-xl mb-3 font-dmsans-bold">Preface</Text>
                        <Text className="text-stone-800 leading-6 font-dmsans-regular">
                            {displayDescription}
                        </Text>
                        {shouldTruncate && (
                            <TouchableOpacity
                                onPress={toggleDescription}
                                className="flex-row items-center justify-end gap-1 mt-2"
                            >
                                <Text className="text-blue-600 font-dmsans-medium">
                                    {isDescriptionExpanded ? " See less" : " See more"}
                                </Text>
                                <Ionicons
                                    name={isDescriptionExpanded ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color="#3b82f6"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Contents Section */}
                <View className="mt-6">
                    <Text className="text-xl px-6 mb-1 font-dmsans-bold">Contents</Text>
                    {chapters.map((chapter, i) => (
                        <ChapterItem key={i} number={chapter.number} title={chapter.title} />
                    ))}
                </View>

                {/* About Author */}
                <View className="px-6 mt-6">
                    <Text className="text-xl mb-3 font-dmsans-bold">About Author</Text>
                    <Text className="text-lg mb-2 font-dmsans-semibold">{book.authors.join(", ")}</Text>
                    <Text className="text-stone-800 leading-6 font-dmsans-regular">
                        {book.authors.join(", ")} (1905-1997) was an Austrian psychiatrist, neurologist, and Holocaust survivor best known for his groundbreaking work in existential psychology. His most influential book, &quot;Man&apos;s Search for Meaning&quot;, explores his experiences in Nazi concentration camps and introduces &quot;logotherapy&quot;, a therapeutic approach centered on finding purpose in life. Frankl believed that meaning could be discovered through work, love, and suffering. His insights continue to inspire those seeking resilience and personal growth.
                    </Text>
                </View>

                {/* More Like This */}
                {book.recommendations && book.recommendations.length > 0 && (
                    <View className="mt-8">
                        <Text className="text-xl px-6 mb-4 font-dmsans-bold">More Like this</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
                            className="pb-4"
                        >
                            {book.recommendations.slice(0, 5).map((item, i) => (
                                <TouchableOpacity key={i} className="mr-4 w-28"
                                    onPress={() => router.push(`/details/${item.id}`)}
                                >
                                    <Image
                                        source={{ uri: item.coverImage }}
                                        className="w-28 h-40 rounded-md mb-2"
                                    />
                                    <Text className="font-dmsans-medium" numberOfLines={2}>{item.title}</Text>
                                    <Text className="text-xs text-stone-500 font-dmsans-regular">{item.authorName.split(", ")[0]}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Footer */}
                <View className="flex justify-start gap-5 px-4 py-5 mb-5">
                    <Text className="text-5xl text-stone-400 font-poppins-bold h-[3.5rem]">next gen.,</Text>
                    <Text className="text-5xl text-stone-400 mb-1 font-poppins-bold h-[3.5rem]">library.</Text>
                    <Text className="text-sm text-stone-400 font-poppins-regular">the world&apos;s largest digital library</Text>
                </View>
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View className="fixed bottom-0 left-0 right-0 flex-row px-4 py-3 pb-7 bg-stone-50 border-t border-stone-200">
                <TouchableOpacity className="w-16 h-16 rounded-[14px] bg-stone-200 justify-center items-center">
                    <Ionicons name="bookmark-outline" size={22} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 ml-3 h-16 bg-green-800 rounded-[14px] justify-center items-center"
                    onPress={handleStartReading}
                >
                    <Text className="text-white text-base font-dmsans-medium">Start Reading</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}