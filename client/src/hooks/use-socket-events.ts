import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { queryClient } from '@/lib/queryClient';
import { Community } from '@shared/schema';

export function useSocketEvents() {
  useEffect(() => {
    const socket = io();

    // Listen for new communities being created
    socket.on('communityCreated', (newCommunity: Community) => {
      // Update all communities cache
      queryClient.setQueryData(['/api/communities'], (old: Community[] | undefined) => {
        return old ? [...old, newCommunity] : [newCommunity];
      });

      // Update trending communities cache
      queryClient.setQueryData(['/api/communities/trending'], (old: Community[] | undefined) => {
        return old ? [...old, newCommunity] : [newCommunity];
      });

      // Invalidate to refresh with server data
      queryClient.invalidateQueries({ queryKey: ['/api/communities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/communities/trending'] });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}