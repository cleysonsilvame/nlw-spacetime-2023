import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { SplashScreen, Stack } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import { styled } from 'nativewind'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [hasLoadedFonts] = useFonts({
    BaiJamjuree_700Bold,
    Roboto_400Regular,
    Roboto_700Bold,
  })

  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    boolean | null
  >(null)

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) =>
      setIsUserAuthenticated(!!token),
    )
  }, [])

  if (!hasLoadedFonts) return <SplashScreen />

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-950"
      imageStyle={{
        position: 'absolute',
        left: '-100%',
      }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  )
}
