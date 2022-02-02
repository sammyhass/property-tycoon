import { useAuth } from '@/hooks/useAuth';
import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';
import { ApiError } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

export default function LoginComponent() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState('');

  const [sentLink, setSentLink] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { error } = await signIn(email);

      if (!error) {
        setSentLink(true);
        setError(null);
      } else {
        setError(error);
      }
    },
    [email]
  );

  return (
    <Box boxShadow={'xl'} p="20px" borderRadius={'10px'}>
      <Heading>{'Get Started with a Magic Link!'}</Heading>
      <Divider my="10px" />
      <form onSubmit={handleSubmit}>
        <Flex direction={'column'} gap="10px">
          <FormControl>
            <FormLabel htmlFor="email" mb="0">
              Email
            </FormLabel>
            <Input
              type="email"
              id="email"
              value={email}
              required
              onChange={event => setEmail(event.target.value)}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="green"
            mt={4}
            w="100%"
            isLoading={isLoading}
          >
            {sentLink ? 'Sent Link' : 'Send Magic Link'}
          </Button>
        </Flex>
        {error && (
          <Alert mt={4} colorScheme={'red'} status="error">
            {error.message}
          </Alert>
        )}
        {sentLink && (
          <Alert mt={4} colorScheme={'green'} status="success">
            {'Check your email for a magic link!'}
          </Alert>
        )}
      </form>
    </Box>
  );
}
