import Icon from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

export default function NewMemory() {
  const router = useRouter()

  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  async function openImagePick() {
    const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    })

    if (canceled) return

    setPreview(assets[0].uri)
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: preview,
      } as any)

      const { data } = await api.post<{ fileUrl: string }>(
        '/upload',
        uploadFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )

      coverUrl = data.fileUrl
    }

    await api.post(
      '/memories',
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    router.push('/memories')
  }

  return (
    <SafeAreaView className="flex-1 px-8">
      <ScrollView>
        <View className="flex-row items-center justify-between">
          <NLWLogo />

          <Link href="/memories" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
              <Icon name="arrow-left" size={16} color="#FFF" />
            </TouchableOpacity>
          </Link>
        </View>

        <View className="my-6 space-y-6">
          <View className="flex-row items-center gap-2">
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{
                false: '#767577',
                true: '#372560',
              }}
              thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            />
            <Text className="mb-0.5 font-body text-base text-gray-200">
              Tornar memória pública
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
            onPress={openImagePick}
          >
            {preview ? (
              <Image
                source={{ uri: preview }}
                alt=""
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <View className="flex-row items-center gap-2">
                <Icon name="image" color="#FFF" />
                <Text className="font-body text-sm text-gray-200">
                  Adicionar foto ou vídeo de capa
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            multiline
            className="p-0 font-body text-lg text-gray-50"
            textAlignVertical="top"
            placeholderTextColor="#56565a"
            placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
            value={content}
            onChangeText={setContent}
          />

          <TouchableOpacity
            className="items-center self-end rounded-full bg-green-500 px-5 py-2"
            activeOpacity={0.7}
            onPress={handleCreateMemory}
          >
            <Text className="font-alt text-sm uppercase text-black">
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
