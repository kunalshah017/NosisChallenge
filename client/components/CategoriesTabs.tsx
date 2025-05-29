import React, { useMemo } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import {
    Briefcase, BookOpen, Brain, Lightbulb, Award, Activity, Heart, Film,
    BookUser, Apple, Sparkles, PieChart, Flag, Coffee, DollarSign
} from 'lucide-react-native';

interface CategoryItemProps {
    label: string;
    icon: React.ReactNode;
    onPress: () => void;
}

interface CategoriesTabsProps {
    onCategoryPress?: (category: string) => void;
    initialCategory?: string;
}

const CategoryItem = React.memo<CategoryItemProps>(({ label, icon, onPress }) => {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-row items-center px-3 py-2 rounded-full mr-2 mb-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700`}
        >
            <View className="mr-2">
                {icon}
            </View>
            <Text
                className={`text-sm font-dmsans-regular text-neutral-700 dark:text-neutral-300`}
            >
                {label}
            </Text>
        </Pressable>
    );
});

const CategoriesTabs: React.FC<CategoriesTabsProps> = ({
    onCategoryPress,
}) => {

    // Define all categories with their icons
    const categories = useMemo(() => [
        { id: 'StartUp', label: 'Start-up & Entrepreneurship', icon: <Lightbulb size={18} className="text-blue-500" /> },
        { id: 'Philosophy', label: 'Philosophy', icon: <BookOpen size={18} className="text-purple-500" /> },
        { id: 'PersonalDevelopment', label: 'Personal Development', icon: <Sparkles size={18} className="text-yellow-500" /> },
        { id: 'ScienceTech', label: 'Science & Technology', icon: <PieChart size={18} className="text-green-500" /> },
        { id: 'Leadership', label: 'Leadership', icon: <Award size={18} className="text-red-500" /> },
        { id: 'Productivity', label: 'Productivity', icon: <Activity size={18} className="text-cyan-500" /> },
        { id: 'Spirituality', label: 'Spirituality', icon: <Coffee size={18} className="text-amber-500" /> },
        { id: 'Business', label: 'Business', icon: <Briefcase size={18} className="text-indigo-500" /> },
        { id: 'GlobalPolitics', label: 'Global Politics', icon: <Flag size={18} className="text-red-500" /> },
        { id: 'Lifestyle', label: 'Lifestyle', icon: <Coffee size={18} className="text-pink-500" /> },
        { id: 'Romance', label: 'Romance', icon: <Heart size={18} className="text-red-500" /> },
        { id: 'Entertainment', label: 'Entertainment', icon: <Film size={18} className="text-violet-500" /> },
        { id: 'Biographies', label: 'Biographies', icon: <BookUser size={18} className="text-blue-500" /> },
        { id: 'HealthNutrition', label: 'Health & Nutrition', icon: <Apple size={18} className="text-green-500" /> },
        { id: 'SelfHelp', label: 'Self-Help', icon: <Brain size={18} className="text-purple-500" /> },
        { id: 'Psychology', label: 'Psychology', icon: <Brain size={18} className="text-amber-500" /> },
        { id: 'Finance', label: 'Finance & Investments', icon: <DollarSign size={18} className="text-green-500" /> },
    ], []);



    return (
        <>
            <View className="flex-row justify-between items-center px-4 mb-6">
                <Text className="text-2xl font-dmsans-bold text-primary">
                    Categories
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                <View className="w-[68rem] flex-row flex-wrap pl-4">
                    {categories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            label={category.label}
                            icon={category.icon}
                            onPress={() => onCategoryPress?.(category.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </>
    );
};

CategoryItem.displayName = 'CategoryItem';

export default CategoriesTabs;