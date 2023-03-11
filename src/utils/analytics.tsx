import React from 'react';
import {
  matchPath, Route, RouteProps,
} from 'react-router-dom';
import { AnalyticsBrowser, Context } from '@segment/analytics-next';
import { RouteComponentProps } from 'react-router';
import { ConsoleRoutes, CONSOLE_BASE_ROUTE } from '../routes/routes';

export enum AnalyticsAppNames {
  Auth = 'auth',
  Console = 'console',
  Error = 'error',
  PsqlConnect = 'psql_connect',
  OauthConsent = 'oauth_consent',
  Integrations = 'integrations',
  Unknown = 'unknown',
}

export enum AnalyticsAction {
  // Layout events
  LogoClicked = 'logo_clicked',
  JumpToChanged = 'jump_to_changed',
  TechPreviewReadMoreClicked = 'tech_preview_read_more_clicked',
  PageHeaderUpgradeToProClicked = 'page_header_upgrade_to_pro_clicked',

  // User menu events
  UserMenuOpened = 'user_menu_opened',
  UserMenuSignOutClicked = 'user_menu_sign_out_clicked',
  UserMenuAccountClicked = 'user_menu_account_clicked',
  UserMenuWebsiteClicked = 'user_menu_website_clicked',
  UserMenuBillingClicked = 'user_menu_billing_clicked',
  UserMenuUpgradeToProClicked = 'user_menu_upgrade_to_pro_clicked',

  // Auth events
  ProviderClicked = 'provider_clicked',
  RequestEarlyAccessClicked = 'request_early_access_clicked',
  InviteCodeSubmitted = 'invite_code_submitted',
  InactiveUserLoggedOut = 'inactive_user_logged_out',

  // Console events
  CreateProjectButtonClicked = 'create_project_button_clicked',
  CreateUserButtonClicked = 'create_user_button_clicked',
  CreateDatabaseButtonClicked = 'create_database_button_clicked',
  CreateBranchButtonClicked = 'create_branch_button_clicked',
  CreateEndpointButtonClicked = 'create_endpoint_button_clicked',

  // Project form events
  ProjectFormDismissed = 'project_form_dismissed',
  ProjectFormSubmitted = 'project_form_submitted',
  ProjectFormRegionChanged = 'project_form_region_changed',

  // Project List Events
  ProjectListProjectOpened = 'project_list_project_opened',
  ProjectListProjectOpenedNewTab = 'project_list_project_opened_new_tab',
  ProjectListItemMenuOpened = 'projects_list_item_menu_opened',
  ProjectListItemMenuDashboardClicked = 'projects_list_item_menu_dashboard_clicked',
  ProjectListItemMenuSqlEditorClicked = 'projects_list_item_menu_sql_editor_clicked',
  ProjectListItemMenuSettingsClicked = 'projects_list_item_menu_settings_clicked',
  ProjectListItemMenuCopyConnStringClicked = 'projects_list_item_menu_copy_conn_string_clicked',

  // Project layout events
  ProjectNavListClicked = 'project_nav_list_clicked',
  ProjectNavDashboardClicked = 'project_nav_dashboard_clicked',
  ProjectNavTablesClicked = 'project_nav_tables_clicked',
  ProjectNavSqlEditorClicked = 'project_nav_sql_editor_clicked',
  ProjectNavInsightsClicked = 'project_nav_insights_clicked',
  ProjectNavBranchesClicked = 'project_nav_branches_clicked',
  ProjectNavEndpointsClicked = 'project_nav_endpoints_clicked',
  ProjectNavSettingsClicked = 'project_nav_settings_clicked',
  ProjectNavOperationsClicked = 'project_nav_operations_clicked',
  ProjectNavProjectsListClicked = 'project_nav_projects_list_clicked',
  ProjectNavBillingClicked = 'project_nav_billing_clicked',

  // Project onboarding events
  OnboardingSkipped = 'onboarding_skipped',
  OnboardingDone = 'onboarding_done',
  OnboardingStepClicked = 'onboarding_step_clicked',
  OnboardingNextStepClicked = 'onboarding_next_step_clicked',

  // Code samples events
  CodeSamplesOpened = 'code_samples_opened',
  CodeSamplesClosed = 'code_samples_closed',
  CodeSamplesCopied = 'code_samples_copied',
  CodeSamplesSampleTypeClicked = 'code_samples_sample_type_clicked',

  // Connection details widget events
  ConnectionDetailsPasswordResetClicked = 'connection_details_password_reset_clicked',
  ConnectionDetailsConnstringCopied = 'connection_details_connstring_copied',
  ConnectionDetailsPoolerChanged = 'connection_details_pooler_changed',

  // Branches widget events
  BranchesWidgetGoToBranchesListClicked = 'branches_widget_go_to_branches_list_clicked',
  BranchesWidgetGoToBranchPageClicked = 'branches_widget_go_to_branch_page_clicked',

  // Project tier widget events
  ProjectTierWidgetReadMoreClicked = 'project_tier_widget_read_more_clicked',
  ProjectTierWidgetUpgradeToProClicked = 'project_tier_widget_upgrade_to_pro_clicked',

  // Role new password modal
  ResetPasswordPasswordCopied = 'reset_password_password_copied',
  ResetPasswordEnvVarCopied = 'reset_password_env_var_copied', // deprecated
  ResetPasswordPgpassCopied = 'reset_password_pgpass_copied', // deprecated
  ResetPasswordDownloadCredentialsClicked = 'reset_password_download_credentials_clicked',
  ResetPasswordCopyPasswordClicked = 'reset_password_copy_password_clicked',

  // Database select events
  DatabaseSelectValueChanged = 'database_select_value_changed',
  DatabaseSelectNewDatabaseClicked = 'database_select_new_database_clicked',

  // Pg User select events
  UserSelectValueChanged = 'user_select_value_changed',
  UserSelectNewUserClicked = 'user_select_new_user_clicked',

  // Operations widget events
  OperationsWidgetShowAllClicked = 'ops_widget_show_all_clicked',
  OperationsWidgetBranchLinkClicked = 'ops_widget_branch_link_clicked',

  // Posgres widget analytics
  PostgresWidgetManageUsersClicked = 'postgres_widget_manage_users_clicked',
  PostgresWidgetManageDatabasesClicked = 'postgres_widget_manage_databases_clicked',

  // Psql connect banner events
  PsqlConnectBannerCommandCopied = 'psql_connect_banner_command_copied',

  // Query playground events
  PlaygroundRun = 'playground_run',
  PlaygroundExplain = 'playground_explain',
  PlaygroundAnalyze = 'playground_analyze',
  PlaygroundTabSaved = 'playground_tab_saved',
  PlaygroundTabHistory = 'playground_tab_history',
  PlaygroundHistorySelect = 'playground_history_select',
  PlaygroundSavedSelect = 'playground_saved_select',
  PlaygroundSave = 'playground_save',
  PlaygroundSavedDelete = 'playground_saved_delete',

  // Help center analytics
  HelpMenuOpened = 'help_menu_opened',
  HelpCommunityLinkClicked = 'help_community_link_clicked',
  HelpDocumentationLinkClicked = 'help_documentation_link_clicked',
  HelpReleaseNotesLinkClicked = 'help_release_notes_link_clicked',
  HelpFeedbackFormOpened = 'help_feedback_form_opened',
  HelpSupportFormOpened = 'help_support_form_opened',
  HelpContactSupportLinkClicked = 'help_contact_support_link_clicked',

  // error page events
  ErrorPageContactSupportClicked = 'error_page_contact_support_clicked',

  // Hubspot forms
  FeedbackFormSubmitted = 'feedback_form_submitted',
  FeedbackFormDismissed = 'feedback_form_dismissed',
  SupportFormSubmitted = 'support_form_submitted',
  SupportFormDismissed = 'support_form_dismissed',

  // Branch list page events
  BranchListRowClicked = 'branch_list_row_clicked',
  BranchListRowClickedWithCtrlOrMeta = 'branch_list_row_clicked_with_ctrl_or_meta',

  // Branch form events
  BranchFormDismissed = 'branch_form_dismissed',
  BranchFormSubmitted = 'branch_form_submitted',
  BranchFormParentChanged = 'branch_form_parent_changed',
  BranchFormStartingPointTypeChanged = 'branch_form_starting_point_type_changed',

  // Branch page events
  BranchPageDeleteBranchClicked = 'branch_page_delete_branch_clicked',
  BranchPageCopyEndpointHostClicked = 'branch_page_copy_endpoint_host_clicked',

  // Project settings
  ProjectSettingsProjectIdCopied = 'project_settings_project_id_copied',
  ProjectSettingsTogglePooling = 'project_settings_toggle_pooling',
  ProjectSettingsGeneralPageSave = 'project_settings_general_page_save',
  ProjectSettingsDeleteProjectClicked = 'project_settings_delete_project_clicked',
  ProjectSettingsGeneralClick = 'project_settings_general_click',
  ProjectSettingsOperationsClick = 'project_settings_operations_click',
  ProjectSettingsDatabasesClick = 'project_settings_databases_click',
  ProjectSettingsUsersClick = 'project_settings_users_click',
  ProjectSettingsIntegrationsClick = 'project_settings_integrations_click',

  // Project Operations page
  ProjectOperationsBranchLinkClicked = 'project_operations_branch_link_clicked',

  // No projects placeholder
  NoProjectsShown = 'no_projects_shown',
  NoProjectsSlideOneClicked = 'no_projects_slide_one_clicked',
  NoProjectsSlideTwoClicked = 'no_projects_slide_two_clicked',
  NoProjectsSlideThreeClicked = 'no_projects_slide_three_clicked',
  NoProjectsCreateProjectClicked = 'no_projects_create_project_clicked',

  // Project created popup
  ProjectCreatedPopupCopyConnectionStringClicked = 'project_created_popup_copy_connection_string_clicked',
  ProjectCreatedPopupDownloadCredentialsClicked = 'project_created_popup_download_credentials_clicked',

  // Branch created popup
  BranchCreatedPopupCopyHostClicked = 'branch_created_popup_copy_host_clicked',
  BranchCreatedPopupManageUsersClicked = 'branch_created_popup_manage_users_clicked',

  // Role created popup
  RoleCreatedPopupCopyPasswordClicked = 'role_created_popup_copy_password_clicked',
  RoleCreatedPopupDownloadCredentialsClicked = 'role_created_popup_download_credentials_clicked',

  // Vercel integration
  VercelIntegrationSuccess = 'vercel_integration_success',
  VercelIntegrationFailure = 'vercel_integration_failure',
  VercelIntegrationStep_pick_vercel_project = 'vercel_integration_step_pick_vercel_project',
  VercelIntegrationStep_pick_cloudrock_project = 'vercel_integration_step_pick_cloudrock_project',
  VercelIntegrationStep_confirm = 'vercel_integration_step_confirm',

  // Pro promo modal
  ProPromoModalGoProClicked = 'pro_promo_modal_go_pro_clicked',
  ProPromoModalDismissed = 'pro_promo_modal_dismissed',
}

interface AnalyticsEventData {
  action: AnalyticsAction;
  project_id?: string;
  database_id?: string;
  duration?: number; // for form submit events only
  keyboard?: boolean;
  provider?: string; // for auth events
  invite?: string;
  error?: string;
}

export type TrackFunction = (action: AnalyticsAction, data?: Omit<AnalyticsEventData, 'action'>) => void;

interface CustomAnalyticsBrowser {
  trackUiInteraction: TrackFunction;
  page: AnalyticsBrowser['page'];
  section: string;
  pageMapper: { [key: string]: string };
}

const AnalyticsContext = React.createContext<CustomAnalyticsBrowser>({
  trackUiInteraction: () => {},
  page: () => Promise.reject(),
  section: '',
  pageMapper: {},
});

AnalyticsContext.displayName = 'AnalyticsContext';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  userId?: string;
  enabled?: boolean;
  section: string;
  pageMapper: { [key: string]: string };
  segmentKey: string;
}

const enrichWithProjectId = (ctx: Context) => {
  if (ctx.event.context?.page?.path) {
    const matchConsoleProjectId = matchPath<{ projectId: string }>(
      ctx.event.context.page.path,
      {
        path: CONSOLE_BASE_ROUTE + ConsoleRoutes.ProjectsItem,
        exact: false,
      },
    );

    const matchPsqlConnect = matchPath<{ psqlSessionId: string }>(
      ctx.event.context.page.path,
      {
        path: '/psql_session/:psqlSessionId',
        exact: false,
      },
    );

    if (matchConsoleProjectId?.params?.projectId) {
      ctx.event.properties = {
        ...ctx.event.properties,
        project_id: matchConsoleProjectId.params.projectId,
      };
    }

    if (matchPsqlConnect?.params?.psqlSessionId) {
      ctx.event.properties = {
        ...ctx.event.properties,
        psql_session_id: matchPsqlConnect.params.psqlSessionId,
      };
    }
  }

  return ctx;
};

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = React.memo(({
  children,
  userId,
  enabled,
  section,
  pageMapper,
  segmentKey,
}) => {
  const analytics = React.useMemo(
    () => {
      if (segmentKey && enabled) {
        const res = AnalyticsBrowser.load({
          writeKey: segmentKey,
          cdnURL: 'https://analytics.cloudrock.ca',
          plugins: [{
            type: 'enrichment',
            name: 'cloudrock_analytics_plugin',
            version: '1.0.0',
            isLoaded: () => true,
            load: () => Promise.resolve(),
            track: enrichWithProjectId,
          }],
        });

        if (userId) {
          res.identify(userId);
        }

        return res;
      }
      // eslint-disable-next-line
      console.warn('Segment key is not defined');
      return undefined;
    },
    [],
  );

  const trackUiInteraction = React.useCallback(
    (action: AnalyticsAction, properties?: Omit<AnalyticsEventData, 'action'>) => {
      if (enabled) {
        analytics?.track('ui_interaction', {
          ...properties,
          action,
        });
      }
    },
    [analytics, enabled],
  );

  const page: AnalyticsBrowser['page'] = React.useCallback((...args) => {
    if (enabled && analytics) {
      return analytics.page(...args);
    }

    return Promise.reject();
  }, [
    enabled,
    analytics,
    section,
  ]);

  return (
    <AnalyticsContext.Provider
      value={{
        trackUiInteraction,
        page,
        section,
        pageMapper,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
});
AnalyticsProvider.displayName = 'AnalyticsProvider';

// Create an analytics hook that we can use with other components.
export const useAnalytics = () => {
  const result = React.useContext(AnalyticsContext);
  if (!result) {
    throw new Error('Context used outside of its Provider!');
  }
  return result;
};

// safe version when you wan't use analytics if they are present append
// skip if not
export const useAnalyticsSafe = () => {
  const result = React.useContext(AnalyticsContext);
  if (!result) {
    return {
      trackUiInteraction: () => {},
      page: () => Promise.resolve(),
      section: '',
      pageMapper: {},
    };
  }
  return result;
};

export const TrackingRoute = ({ component: Component, ...props }: Omit<RouteProps, 'render' | 'children'>) => (
  <Route
    {...props}
    component={(routeProps: RouteComponentProps<{}>) => {
      const { page, section, pageMapper } = useAnalytics();

      React.useEffect(() => {
        const pageId = pageMapper[routeProps.match.path] || routeProps.match.path;

        const properties = {
          match_path: routeProps.match.path,
          ...Object.fromEntries(Object.entries(routeProps.match.params).map(([key, value]) => ([key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`), value]))),
        };
        page(section, `${section}_${pageId}`, properties);
      }, []);

      // @ts-ignore
      return <Component {...routeProps} />;
    }}
  />
);
