import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Box, Divider, Heading } from '@chakra-ui/react';
import { Auth } from '@supabase/ui';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function LoginComponent() {
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/games');
    }
  }, [isAuthenticated]);

  return (
    <Box boxShadow={'xl'} p="20px" borderRadius={'10px'}>
      <Heading>Let's get you logged in</Heading>
      <Divider my="10px" />
      <Auth
        supabaseClient={supabase}
        magicLink={true}
        redirectTo="/admin/games"
      />
    </Box>
  );
}
