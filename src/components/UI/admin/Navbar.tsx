import { useAuth } from '@/hooks/useAuth';
import { Button, Flex, Heading, IconButton, Spacer } from '@chakra-ui/react';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <Flex w="100%" bg={'darkviolet'} p={'20px'}>
      <Heading
        onClick={() => router.push('/admin/games')}
        curor="pointer"
        color="white"
      >
        Property Tycoon
      </Heading>
      <Spacer />
      <Flex gap="10px">
        <Link href={'/'}>
          <Button colorScheme={'green'}>Play</Button>
        </Link>
        <Link href={user ? '/admin/games' : '/login'}>
          <Button>{user ? `Welcome, ${user.email}` : 'Sign In'}</Button>
        </Link>
        {user && (
          <IconButton
            ml="5px"
            onClick={() => signOut()}
            icon={<FontAwesomeIcon icon={faSignOutAlt} />}
            colorScheme={'red'}
            aria-label="Sign Out"
          />
        )}
      </Flex>
    </Flex>
  );
}
