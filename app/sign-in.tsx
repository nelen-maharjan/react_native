import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import images from '@/constants/images';
import icons from '@/constants/icons';

const SignIn = () => {
  const handleLogin = () => {

  };

  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView contentContainerClassName='h-full'>
        <Image source={images.onboarding} className='w-full h-4/6' resizeMode='contain' />
        <View className='px-10'>
          <Text className='text-base text-center uppercase font-rubik text-black-200'>Welcome To RealState</Text>
          <Text className='text-3xl font=rubik-bold text-black-300 text-center mt-2'>
            Let's Get You Closer to {"\n"} 
            <Text className='text-primary-300'>Your Ideal Home</Text>
          </Text>

          <Text className='text-lg font-rubik text-black-200 text-center mt-12'>
            Login to RealState with Google
          </Text>

          <TouchableOpacity onPress={handleLogin} className='shadow-md bg-white shadow-zinc-300 rounded-full w-full py-4 mt-5'>
            <Image
            src={icons.google}
            className='w-5 h-5'
            resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn