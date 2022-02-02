import { API_URL } from '@/env/env';
import {
  Box,
  Button,
  ChakraProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FormEvent, useCallback, useMemo, useState } from 'react';

type FormData = {
  name: string;
};

interface NewGameFormProps extends ChakraProps {}

export default function NewGameForm({ ...chakraProps }: NewGameFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const { data, status } = await axios.post(`${API_URL}/game`, {
        name,
      });

      if (status !== 200) {
        setError(data.message);
      }
      router.push('/admin/games');
    },
    [name, router]
  );

  const canSubmit = useMemo(() => !!name, [name]);

  return (
    <Box {...chakraProps}>
      <form onSubmit={e => canSubmit && onSubmit(e)}>
        <FormControl my="10px">
          <FormLabel>
            <Input
              placeholder="Game Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormLabel>
          <FormErrorMessage>{error}</FormErrorMessage>
          <Button type="submit" disabled={!canSubmit} w="100%">
            Create Game
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}
