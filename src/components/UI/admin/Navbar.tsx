import { useAuth } from '@/hooks/useAuth';
import { Button, Flex, Heading, IconButton, Spacer } from '@chakra-ui/react';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <Flex w="100%" bg={'darkviolet'} p={'20px'}>
      <Heading onClick={() => router.push('/admin/games')} color="white">
        Property Tycoon
      </Heading>
      <Spacer />
      <Flex>
        <Button
          onClick={() => {
            user ? router.push('/admin/games') : router.push('/login');
          }}
        >
          {user ? `Welcome, ${user.email}` : 'Sign In'}
        </Button>
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
