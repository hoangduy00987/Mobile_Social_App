"use client";

import React, { createContext, useContext, useState } from "react";
import { CommunityState } from "../types/community.types";

interface CommunityContextType {
  communities: CommunityState[];
  setCommunities: (list: CommunityState[]) => void;
  addCommunity: (item: CommunityState) => void;
  removeCommunity: (community_id: number) => void;
  updateCommunity: (item: CommunityState) => void;
}

const CommunityContext = createContext<CommunityContextType | null>(null);

export const CommunityProvider = ({ children }: { children: React.ReactNode }) => {
  const [communities, setCommunitiesState] = useState<CommunityState[]>([]);

  const setCommunities = (list: CommunityState[]) => {
    setCommunitiesState(list);
  };

  const addCommunity = (item: CommunityState) => {
    setCommunitiesState(prev => [...prev, item]);
  };

  const removeCommunity = (community_id: number) => {
    setCommunitiesState(prev =>
      prev.filter(c => c.community_id !== community_id)
    );
  };

  const updateCommunity = (item: CommunityState) => {
    setCommunitiesState(prev =>
      prev.map(c => (c.community_id === item.community_id ? item : c))
    );
  };

  return (
    <CommunityContext.Provider
      value={{
        communities,
        setCommunities,
        addCommunity,
        removeCommunity,
        updateCommunity
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context)
    throw new Error("useCommunity must be used within CommunityProvider");
  return context;
};