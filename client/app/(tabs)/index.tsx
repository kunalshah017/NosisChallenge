import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import BookCarousel from '~/components/BookCarousel';
import CategoriesTabs from '~/components/CategoriesTabs';

export default function Screen() {
  const handleBookPress = (bookId: string) => {
    router.push({
      pathname: '/details/[id]',
      params: { id: bookId }
    });
  };

  return (
    <View className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BookCarousel
          title="Readers Choice"
          period="week"
          onBookPress={handleBookPress}
        />
        <CategoriesTabs />
        <BookCarousel
          title="Featured Books"
          period="random"
          onBookPress={handleBookPress}
        />
      </ScrollView>
    </View>
  );
}