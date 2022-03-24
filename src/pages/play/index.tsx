import AdminLayout from '@/components/UI/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { Box, Button, Divider, Heading, Input } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function PlayGameOptionsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [shareCode, setSharecode] = useState('');

  return (
    <AdminLayout>
      <Box p="20px" borderRadius={'8px'} boxShadow="sm" border="1px solid #eee">
        {user && (
          <Link passHref href="/play/active">
            <Button size="lg" colorScheme={'green'}>
              Play your Active Game
            </Button>
          </Link>
        )}
        <Divider my="10px" />
        <Heading>
          {user ? 'Or, enter' : 'Enter'} a sharecode to play a game made by
          another user.
        </Heading>
        <form
          onSubmit={e => {
            e.preventDefault();
            router.push(`/play/${shareCode}`);
          }}
        >
          <Input
            placeholder="Sharecode"
            type="text"
            size="lg"
            value={shareCode}
            onChange={e => setSharecode(e.target.value)}
          />
          <Button size="lg" colorScheme={'green'} mt="10px" type="submit">
            Play with Sharecode
          </Button>
        </form>
      </Box>
    </AdminLayout>
  );
}
