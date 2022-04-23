import { useAuth } from '@/hooks/useAuth';
import {
  Button,
  Flex,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Spacer,
} from '@chakra-ui/react';
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
      <LinkBox>
        <Link href="/" passHref>
          <LinkOverlay>
            <Heading color="white">Property Tycoon</Heading>
          </LinkOverlay>
        </Link>
      </LinkBox>
      <Spacer />
      <Flex gap="10px" wrap={'wrap'}>
        <Link href={'/play'} passHref>
          <Button colorScheme={'green'}>Play</Button>
        </Link>
        <Link href={user ? '/admin/games' : '/login'} passHref>
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
