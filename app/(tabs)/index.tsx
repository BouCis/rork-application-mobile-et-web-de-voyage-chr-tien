import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { MapPin, Heart } from 'lucide-react-native';

export default function AccueilScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* Header inspirant */}
      <Image
        source={{ uri: 'https://example.com/croix-voyage.jpg' }}  // Remplace par une image locale dans assets/
        className="w-32 h-32 mb-4"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-blue-600 mb-2">
        Bienvenue dans Voyages Chrétiens
      </Text>
      <Text className="text-base text-gray-600 text-center px-4 mb-6">
        Découvrez des pèlerinages spirituels et des retraites inspirées par la Bible.
        "Allez, faites de toutes les nations des disciples" (Matthieu 28:19)
      </Text>
      
      {/* Boutons d'action */}
      <Link href="/destinations" asChild>
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg mb-4">
          <Text className="text-white font-semibold flex-row items-center">
            <MapPin size={20} color="white" className="mr-2" />
            Explorer Destinations
          </Text>
        </TouchableOpacity>
      </Link>
      
      <TouchableOpacity className="bg-green-500 px-6 py-3 rounded-lg">
        <Text className="text-white font-semibold flex-row items-center">
          <Heart size={20} color="white" className="mr-2" />
          Mes Favoris
        </Text>
      </TouchableOpacity>
    </View>
  );
}
