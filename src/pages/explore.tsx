import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import {
  Box,
  Button,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import { Game, GameProperty } from '@prisma/client';
import { GetStaticProps } from 'next';
import Link from 'next/link';

type ExplorePageProps = {
  games: (Game & {
    Properties: GameProperty[] | null;
  })[];
  error?: string;
};

export default function ExplorePage({ games, error }: ExplorePageProps) {
  return (
    <AdminLayout>
      <Box>
        <Heading>Welcome to Property Tycoon</Heading>
        <Text fontSize={'md'}>Here are some boards you can play.</Text>
      </Box>
      <Flex
        wrap="wrap"
        gap="15px"
        sx={{
          '@media screen and (max-width: 768px)': {
            flexDirection: 'column',
          },
        }}
      >
        {games?.map(game => (
          <LinkBox
            p="20px"
            borderRadius={'8px'}
            flexShrink={0}
            minW="300px"
            shadow={'md'}
            key={game.id}
            transform="scale(0.98)"
            transition="all 0.2s"
            _hover={{
              shadow: 'md',
              transform: 'scale(1)',
            }}
            pos="relative"
            overflow={'hidden'}
          >
            <Link href={`/play/${game.share_code}`} passHref>
              <LinkOverlay>
                <Flex direction={'column'}>
                  <Heading>{game.name}</Heading>
                </Flex>
                <Button colorScheme={'green'}>Play Now</Button>
              </LinkOverlay>
            </Link>
          </LinkBox>
        ))}
      </Flex>
    </AdminLayout>
  );
}

export const getStaticProps: GetStaticProps<ExplorePageProps> = async () => {
  const games = await prismaClient.game.findMany({
    where: {
      share_code: {
        not: null,
      },
    },
    include: {
      Properties: {
        take: 7,
      },
    },
  });

  return { props: { games } };
};
