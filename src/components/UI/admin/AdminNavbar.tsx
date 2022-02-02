import { useAuth } from '@/hooks/useAuth';
import { Button, Flex, Heading, Link, LinkBox, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function AdminNavbar() {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <Flex w="100%" bg={'darkviolet'} p={'20px'}>
      <Link href="/admin/games">
        <LinkBox>
          <Heading color="white">Property Tycoon Manager</Heading>
        </LinkBox>
      </Link>
      <Spacer />
      <Button
        onClick={() => {
          router.push('/login');
        }}
      >
        {user ? `Welcome, ${user.email}` : 'Sign In'}
      </Button>
    </Flex>
  );
}
