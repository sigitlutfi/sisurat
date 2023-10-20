import React from 'react';
import {Box, Heading, HStack, Icon, Stack} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Header({nv, conf = false, tit, left = true}) {
  return (
    <Stack>
      <Box bg={conf.color ? conf.color : 'red.400'}>
        <HStack
          px={4}
          alignItems={'center'}
          h={16}
          justifyContent={'space-between'}>
          {left ? (
            <TouchableOpacity onPress={() => nv.goBack()}>
              <Icon
                size={'2xl'}
                color="white"
                as={MaterialCommunityIcons}
                name={'arrow-left'}
              />
            </TouchableOpacity>
          ) : null}
          <Heading color={'white'} ml={4} maxWidth={300} numberOfLines={1}>
            {tit}
          </Heading>
          <TouchableOpacity onPress={() => nv.goBack()} disabled>
            <Icon
              size={'2xl'}
              color={conf.color}
              as={MaterialCommunityIcons}
              name={'arrow-left'}
            />
          </TouchableOpacity>
        </HStack>
      </Box>
      <Box h={8} bg={conf.color} />
      <Box h={8} bg={'gray.200'} mt={-8} borderTopRadius={'full'} />
    </Stack>
  );
}
