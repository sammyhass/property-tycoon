import { API_URL } from '@/env/env';
import {
  Alert,
  Box,
  Button,
  ChakraProps,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type FormData = {
  name: string;
};

interface NewGameFormProps extends ChakraProps {}

export default function NewGameForm({ ...chakraProps }: NewGameFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) setError('');
  }, [name]);

  const router = useRouter();

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      axios
        .post(`${API_URL}/game`, {
          name,
        })
        .then(({ status }) => status === 200 && router.push('/admin/games'))
        .catch(e => setError(e.message));
    },
    [name, router, setError]
  );

  const canSubmit = useMemo(() => !!name, [name]);

  return (
    <Box {...chakraProps}>
      <form
        onSubmit={e => {
          if (!canSubmit) return;
          e.preventDefault();
          onSubmit(e);
        }}
      >
        <FormControl my="10px">
          <FormLabel>
            <Input
              placeholder="Game Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormLabel>

          <Button type="submit" disabled={!canSubmit} w="100%">
            Create Game
          </Button>
          {error && (
            <Alert mt="10px" status="error">
              {error}
            </Alert>
          )}
        </FormControl>
      </form>
    </Box>
  );
}
