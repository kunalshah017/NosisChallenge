import { ScrollView, View, Text } from 'react-native';
import { router } from 'expo-router';
import BookCarousel from '~/components/BookCarousel';
import CategoriesTabs from '~/components/CategoriesTabs';

import { useBookmarks } from '~/store/useBookmarksStore';
import { useAuthStore } from '~/store/useAuthStore';

import { useTopBooks } from '~/lib/api';

export default function Screen() {
  const handleBookPress = (bookId: string) => {
    router.push({
      pathname: '/details/[id]',
      params: { id: bookId }
    });
  };

  const { data: booksWeek, isLoading: isLoadingWeek } = useTopBooks("week");
  const { data: booksRandom, isLoading: isLoadingRandom } = useTopBooks("random");
  const { isSignedIn } = useAuthStore();
  const { bookmarkedBooks } = useBookmarks();

  return (
    <View className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BookCarousel
          title="Readers Choice"
          books={booksWeek}
          isLoading={isLoadingWeek}
          onBookPress={handleBookPress}
        />
        <CategoriesTabs />
        <BookCarousel
          title="Featured Books"
          books={booksRandom}
          isLoading={isLoadingRandom}
          onBookPress={handleBookPress}
        />
        {
          bookmarkedBooks.length > 0 && isSignedIn && (
            <BookCarousel
              title="Your Bookmarks"
              books={bookmarkedBooks}
              isLoading={!bookmarkedBooks.length}
              onBookPress={handleBookPress}
            />
          )
        }
        <View className="flex justify-start gap-5 px-4 py-5 mb-5">
          <Text className="text-5xl text-stone-400 font-poppins-bold h-[3.5rem]">next gen.,</Text>
          <Text className="text-5xl text-stone-400 mb-1 font-poppins-bold h-[3.5rem]">library.</Text>
          <Text className="text-sm text-stone-400 font-poppins-regular">the world&apos;s largest digital library</Text>
        </View>
      </ScrollView>
    </View>
  );
}