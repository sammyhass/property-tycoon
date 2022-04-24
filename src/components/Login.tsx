import { supabase } from '@/lib/supabase';
import { Box, Divider, Heading } from '@chakra-ui/react';
import { Auth } from '@supabase/ui';
import React from 'react';

export default function LoginComponent() {
  return (
    <Box boxShadow={'xl'} p="20px" borderRadius={'10px'}>
      <Heading>Let&apos;s get you logged in</Heading>
      <Divider my="10px" />
      <Auth supabaseClient={supabase} magicLink={true} />
    </Box>
  );
}
