import {
  createContext, useContext, useMemo,
} from 'react';

// Everything is stored as strings as `min_val` / `max_val` may have different
// types: float or int. Also that is how it is stored in the Postgres `pg_settings`
// view. So this format makes simpler to manage this data across
// Postgres -> Rails/Ruby <-> UI and Rust `apply_conf`.
//
// Actually, this is not a big problem, type conversion is easily guessable from the
// `vartype`. Then you can validate setting value either with `enumvals` or with
// `min_val` / `max_val`. Now we consider compute_node restart only when
// `context` is 'postmaster'.
export interface PgSettingInternal {
  name: string;
  context: string; // postmaster, superuser-backend, user, internal, backend, sighup, superuser
  vartype: string; // enum, string, bool, integer, real
  unit?: string; // only for real and integer, I hope
  min_val?: string; // only for real and integer
  max_val?: string; // same here
  default_val?: string; // Postgres default value, our default may differ
  enumvals?: string[]; // only for enum
  category: string; // human-readable cat name, about 41 different ones
  short_desc: string; // setting description
}

export interface PgSetting extends PgSettingInternal {
  enumvalsOptions?: Array<{
    value: string,
    label: string,
  }>
}

interface PgSettingsData {
  pgSettings: PgSetting[];
  pgSettingsByName: Record<PgSetting['name'], PgSetting>;
  pgSettingsByCategories: Array<{
    label: string;
    fields: PgSetting[];
  }>;
  pgDefaults: Record<string, string>; // postgres default settings
}

export type PgSettingsContext = PgSettingsData;

export type PgSettingsProviderProps = {
  pgSettings: PgSettingInternal[];
};

const pgSettingsContext = createContext<PgSettingsProviderProps | null>(null);

export const usePgSettings = () => {
  const ctxData = useContext(pgSettingsContext);
  if (ctxData === null) {
    throw new Error('usePgSettings must be used inside PgSettingsProvider');
  }
  const { pgSettings } = ctxData;
  const pgSettingsData: PgSettingsData = useMemo(() => {
    const byName: Record<PgSetting['name'], PgSetting> = {};
    const byCategoriesObj: Record<string, PgSetting[]> = {};
    const defaults: Record<string, string> = {};

    pgSettings.forEach((s) => {
      if (s.default_val != null) {
        defaults[s.name] = s.default_val;
      }

      if (!byCategoriesObj[s.category]) {
        byCategoriesObj[s.category] = [];
      }

      const extendedSetting: PgSetting = {
        ...s,
        enumvalsOptions: s.enumvals?.map((item) => ({
          value: item,
          label: item,
        })),
      };

      byName[s.name] = extendedSetting;
      byCategoriesObj[s.category].push(extendedSetting);
    });

    const pgSettingsByCategories: PgSettingsData['pgSettingsByCategories'] = Object
      .entries(byCategoriesObj)
      .map(([label, fields]) => ({
        label,
        fields,
      }));

    return {
      pgSettings,
      pgSettingsByName: byName,
      pgSettingsByCategories,
      pgDefaults: defaults,
    };
  }, [pgSettings]);

  return pgSettingsData;
};

export const PgSettingsProvider = pgSettingsContext.Provider;
