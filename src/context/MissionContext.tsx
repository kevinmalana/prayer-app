import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Shared mission row shape — matches what Home, MissionsHub, and MissionDetail consume
export interface SharedMission {
  id: string;
  title: string;
  intention: string | null;
  target_count: number;
  current_count: number;
  created_at?: string;
}

interface MissionState {
  missions: SharedMission[];
  loading: boolean;
  stale: boolean;
  error: string | null;
}

type MissionAction =
  | { type: 'SET_MISSIONS'; payload: SharedMission[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'MARK_STALE' };

function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'SET_MISSIONS':
      return { ...state, missions: action.payload, loading: false, stale: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'MARK_STALE':
      return { ...state, stale: true };
    default:
      return state;
  }
}

interface MissionContextValue {
  missions: SharedMission[];
  loading: boolean;
  stale: boolean;
  error: string | null;
  refetch: () => void;
  markStale: () => void;
}

const MissionContext = createContext<MissionContextValue | undefined>(undefined);

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(missionReducer, {
    missions: [],
    loading: true,
    stale: false,
    error: null,
  });

  const mountedRef = useRef(true);

  const fetchMissions = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('id,title,intention,target_count,current_count,created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!mountedRef.current) return;

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return;
      }

      dispatch({ type: 'SET_MISSIONS', payload: (data ?? []) as SharedMission[] });
    } catch (err: any) {
      if (!mountedRef.current) return;
      dispatch({ type: 'SET_ERROR', payload: err?.message ?? 'Failed to load prayer goals' });
    }
  }, []);

  const markStale = useCallback(() => {
    dispatch({ type: 'MARK_STALE' });
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMissions();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchMissions]);

  // Auto-refetch when stale — screens can also call refetch explicitly
  useEffect(() => {
    if (state.stale) {
      fetchMissions();
    }
  }, [state.stale, fetchMissions]);

  return (
    <MissionContext.Provider
      value={{
        missions: state.missions,
        loading: state.loading,
        stale: state.stale,
        error: state.error,
        refetch: fetchMissions,
        markStale,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMissions() {
  const ctx = useContext(MissionContext);
  if (!ctx) {
    throw new Error('useMissions must be used within a MissionProvider');
  }
  return ctx;
}