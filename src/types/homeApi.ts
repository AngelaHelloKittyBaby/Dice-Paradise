export interface HomePointsData {
  points: number;
}

export type SoundEnabledFlag = 0 | 1;

export interface HomeSoundSettingsData {
  soundEnabled?: SoundEnabledFlag;
  sound_enabled?: SoundEnabledFlag;
}

export interface SaveHomeSoundSettingsRequest {
  client_id: string;
  sound_enabled: SoundEnabledFlag;
}
