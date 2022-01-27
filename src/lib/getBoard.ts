import { definitions } from '../types/db-types';
import { supabase } from './supabase';

type BoardSpaceT = definitions['board_space'];

export const getBoard = async () => {
  const { data } = await supabase
    .from<BoardSpaceT>('board_space')
    .select('*, property(*, property_group(*))');
  return data;
};
