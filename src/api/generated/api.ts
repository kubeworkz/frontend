/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AdminBranch {
  /** @format uint64 */
  active_time: number;

  /** @format uint64 */
  compute_time: number;

  /** @format date-time */
  created_at?: string;

  /**
   * CreationSource
   *
   * What application initiated branch creation.
   */
  creation_source?: string;
  current_state?: BranchState;

  /** @format uint64 */
  data_transfer: number;
  default?: boolean;
  deleted?: boolean;
  id?: string;

  /** @format date-time */
  last_availability_check?: string;

  /** @format uint64 */
  logical_size?: number;
  metrics_collected_at: Record<string, string>;
  name?: string;

  /** @format date-time */
  next_availability_check?: string;
  parent_id?: string;
  parent_lsn?: string;

  /** @format date-time */
  parent_timestamp?: string;
  pending_state?: BranchState;

  /** @format int64 */
  physical_size?: number;
  project_id?: string;
  timeline_id?: string;

  /** @format date-time */
  updated_at?: string;

  /** @format uint64 */
  written_size?: number;
}

export interface AdminBranchInfo {
  branch?: AdminBranch;
  tenant_id?: string;
}

export interface AdminBranchesItemResponse {
  branch: AdminBranch;
}

export interface AdminBranchesResponse {
  data: AdminBranch[];

  /** @format uint64 */
  total: number;
}

export interface AdminCheckProjectAvailibilityResponseBody {
  operations: Operation[];
}

export interface AdminEndpoint {
  /** @format uint64 */
  active_time: number;

  /** @format int32 */
  autoscaling_limit_max_cu: number;

  /** @format int32 */
  autoscaling_limit_min_cu: number;
  branch_id: string;

  /** @format uint64 */
  compute_time: number;

  /** @format date-time */
  created_at: string;
  creation_source: string;
  current_state: EndpointState;

  /** @format uint64 */
  data_transfer: number;
  deleted: boolean;
  id: string;
  instance_type_handle: string;

  /** @format date-time */
  last_active: string;
  metrics_collected_at: Record<string, string>;
  pending_state?: EndpointState;
  pooler_enabled: boolean;
  pooler_mode: string;

  /** @format int64 */
  pooler_public_port: number;
  private_ip_address: string;

  /** @format int64 */
  private_pg_port: number;

  /** @format int64 */
  private_ssh_port: number;
  project_id: string;

  /** @format int64 */
  public_control_port: number;
  public_dns_name: string;
  public_ip_address: string;

  /** @format int64 */
  public_pg_port: number;
  region_id: string;
  settings: string;
  type: string;

  /** @format date-time */
  updated_at: string;
}

export interface AdminEndpointsItemResponse {
  endpoint: AdminEndpoint;
}

export interface AdminEndpointsResponse {
  data: AdminEndpoint[];

  /** @format uint64 */
  total: number;
}

export interface AdminGlobalSettingsIDsResponse {
  settings: AdminGlobalSettingsIDsResponseSettings[];
}

export interface AdminGlobalSettingsIDsResponseSettings {
  /** @format int64 */
  id?: number;
}

export interface AdminGlobalSettingsUpdateData {
  /** @format int64 */
  id: number;
}

export interface AdminGlobalSettingsUpdateRequest {
  /** GlobalSettingsRaw is exposed only to transit data from database to admin response */
  global_settings?: GlobalSettingsRaw;

  /** @format int64 */
  last_seen_id?: number;
}

export interface AdminInstanceTypeResponse {
  default?: boolean;
  group?: string;
  handle?: string;

  /** @format int64 */
  id?: number;

  /** @format int64 */
  memory_size?: number;
  platform_id?: string;
  raw_params?: string;
  settings?: InstanceTypeSettings;

  /** @format int64 */
  vcpu_count?: number;
}

export interface AdminInvite {
  code: string;

  /** @format date-time */
  created_at: string;

  /** @format int64 */
  id: number;

  /**
   * Total is maximum number of invites that can be Used
   * @format int64
   */
  total: number;

  /** @format date-time */
  updated_at: string;

  /**
   * Used is the counter of used invites.
   * @format int64
   */
  used: number;
}

export interface AdminInvitesResponse {
  data: AdminInvite[];
}

export interface AdminOperation {
  /**
   *
   * create_timeline OpCreateStringTimeline
   * start_compute OpStartStringCompute
   * suspend_compute OpSuspendStringCompute
   * apply_config OpApplyConfig
   * check_availability OpCheckAvailability
   * delete_timeline OpDeleteStringTimeline
   * delete_tenant OpDeleteStringTenant
   * create_branch OpCreateStringBranch
   * replace_safekeeper OpReplaceSafekeeper
   * tenant_migrate OpMigrateTenant
   * tenant_detach OpDetachTenant
   * tenant_reattach OpReattachTenant
   */
  action: OperationAction;

  /** @format int32 */
  attempt_duration_ms?: number;
  branch_id?: string;

  /** @format date-time */
  created_at: string;
  endpoint_id?: string;
  error?: string;
  executor_id: string;

  /** @format int32 */
  failures_count: number;
  id: string;
  metrics: OperationMetrics;
  next_operation_id: string;
  project_id: string;

  /** @format date-time */
  retry_at?: string;
  spec?: ZenithCtlSpec;

  /**
   *
   * running OpStatusStringRunning
   * finished OpStatusStringFinished
   * failed OpStatusStringFailed
   * scheduling OpStatusStringScheduling
   */
  status: OperationStatus;

  /** @format date-time */
  updated_at: string;
}

export interface AdminOperationsItemResponse {
  operation: AdminOperation;
}

export interface AdminOperationsResponse {
  data: AdminOperation[];

  /** @format uint64 */
  total: number;
}

export interface AdminPageserver {
  active: boolean;
  availability_zone_id: string;

  /** @format date-time */
  created_at: string;
  host: string;
  http_host: string;

  /** @format int32 */
  http_port: number;

  /** @format int64 */
  id: number;
  instance_id: string;

  /** @format int32 */
  port: number;

  /** @format uint64 */
  projects_count: number;
  region_id: string;

  /** @format date-time */
  updated_at: string;

  /** @format int64 */
  version: number;
}

export interface AdminPageserverCheckResponse {
  console_only_branches?: AdminBranchInfo[];
  console_only_projects?: AdminProject[];

  /** @format int64 */
  pageserver: number;
  pageserver_only_tenants?: TenantInfo[];
  pageserver_only_timelines?: TimelineInfo[];
  valid?: boolean;
}

export interface AdminPageserverItemResponse {
  pageserver: AdminPageserver;
}

export interface AdminPageserversResponse {
  data: AdminPageserver[];
}

export interface AdminPlatform {
  default?: boolean;
  handle?: string;
  id?: string;
  instance_types?: AdminInstanceTypeResponse[];
  name?: string;
  regions?: AdminRegionResponse[];
}

export interface AdminPlatformsResponse {
  data: AdminPlatform[];
}

export interface AdminProject {
  /** @format int64 */
  active_time: number;

  /** @format uint64 */
  compute_time: number;

  /** @format date-time */
  created_at: string;
  creation_source: string;

  /** @format uint64 */
  data_storage: number;

  /** @format uint64 */
  data_transfer: number;
  deleted: boolean;
  id: string;

  /** @format date-time */
  maintenance_set: string;

  /** @format int64 */
  max_project_size: number;
  metrics_collected_at: Record<string, string>;
  name: string;

  /** @format int64 */
  pageserver_id: number;

  /** @format int64 */
  pg_version: number;
  platform_id: string;
  provisioner: ProvisionerType;
  region_id: string;

  /** @format uint64 */
  remote_storage_size: number;

  /** @format uint64 */
  resident_size: number;
  safekeepers: AdminSafekeeper[];

  /** @format uint64 */
  synthetic_storage_size: number;
  tenant: string;

  /** @format date-time */
  updated_at: string;
  user_id: string;
}

export interface AdminProjectReattachResponseBody {
  operations: Operation[];
}

export interface AdminProjectUpdateRequest {
  /** @format int64 */
  max_project_size?: number;
}

export interface AdminProjectsItemResponse {
  project: AdminProject;
}

export interface AdminProjectsResponse {
  data: AdminProject[];

  /** @format uint64 */
  total: number;
}

export interface AdminRegionResponse {
  active?: boolean;
  default?: boolean;
  handle?: string;
  id?: string;
  name?: string;
}

export interface AdminSafekeeper {
  active: boolean;
  availability_zone_id: string;

  /** @format date-time */
  created_at: string;
  host: string;

  /** @format int32 */
  http_port: number;

  /** @format int64 */
  id: number;
  instance_id: string;

  /** @format int32 */
  port: number;

  /** @format uint64 */
  projects_count: number;
  region_id: string;

  /** @format date-time */
  updated_at: string;

  /** @format int64 */
  version: number;
}

export interface AdminSafekeeperItemResponse {
  safekeeper: AdminSafekeeper;
}

export interface AdminSafekeepersResponse {
  data: AdminSafekeeper[];
}

export interface AdminUser {
  addr_city: string;
  addr_country: string;
  addr_line_1: string;
  addr_line_2: string;
  addr_postal_code: string;
  addr_state: string;
  admin: boolean;

  /** @format date-time */
  consumption_pulled_at: string;

  /** @format date-time */
  created_at: string;
  email: string;
  id: string;
  image: string;
  invite: string;
  login: string;
  name: string;

  /** @format int64 */
  quota_day_of_month_reset: number;

  /** @format date-time */
  quota_reset_at: string;
  settings: GlobalUserSettings;
  settings_raw: UserSettings;
  stripe_customer_id: string;
  subscription_type: BillingSubscriptionType;

  /** @format date-time */
  updated_at: string;
}

export interface AdminUsersItemResponse {
  consumption_history: ConsumptionHistoryPeriod[];
  user: AdminUser;
}

export interface AdminUsersResponse {
  data: AdminUser[];

  /** @format uint64 */
  total: number;
}

export interface AdminUsersUpdateRequest {
  admin?: boolean;
  settings?: UserSettings;
}

export interface ApiKeyRevokeResponse {
  /** @format int64 */
  id: number;

  /** @format date-time */
  last_used_at?: string | null;
  last_used_from_addr: string;
  name: string;
  revoked: boolean;
}

export interface ApiKeysListResponseItem {
  /** @format date-time */
  created_at: string;

  /** @format int64 */
  id: number;

  /** @format date-time */
  last_used_at?: string | null;
  last_used_from_addr: string;
  name: string;
}

export type BillingSubscriptionType = string;

export type BranchState = string;

export interface Config {
  /** allows to edit the size of the endpoint (will set the autoscaling_limits_max_cu) */
  autoscaling_ui?: boolean;

  /** allows to edit both min and max CU limits for the endpoint */
  autoscaling_ui_next?: boolean;

  /** enable the insights tab in ui */
  compute_insights?: boolean;

  /** Hides the pooler checkbox from the endpoint form */
  endpoint_pooler_hidden_ui?: boolean;

  /**
   * shows warning about coming free tier v3 limits.
   * False means the free tier v3 limits already applied for the user (or not applicable)
   * True means CPU Hours are not limited for the user for now
   * but the free tier v3 limits will be enforced on March, 29
   */
  free_tier_v2?: boolean;

  /** enable the insights tab in settings ui */
  integrations?: boolean;

  /** Enables project sharing UI */
  project_sharing_ui?: boolean;

  /** shows the synthetic_storage_size in the console projects list */
  synthetic_storage_size_ui?: boolean;

  /** UsageConsumption enables usage consumption related features */
  usage_consumption?: boolean;
}

export interface ConsoleSettingsRaw {
  /** management */
  project_creation_forbidden?: boolean;
  proxy_host?: string;
}

export interface ConsumptionHistoryPeriod {
  AccountID: string;

  /** @format uint64 */
  ActiveTime: number;

  /** @format uint64 */
  ComputeTime: number;

  /** @format uint64 */
  ComputeTimeCost: number;

  /** @format date-time */
  CreatedAt?: string;

  /** @format uint64 */
  DataStorage: number;

  /** @format uint64 */
  DataStorageCost: number;

  /** @format uint64 */
  DataTransfer: number;

  /** @format uint64 */
  DataTransferCost: number;

  /** @format date-time */
  HubspotDealClosedAt?: string;

  /** @format date-time */
  HubspotDealCreatedAt?: string;

  /** @format date-time */
  HubspotDealNextUpdateAt?: string;

  /**
   * A UUID is a 128 bit (16 byte) Universal Unique IDentifier as defined in RFC
   * 4122.
   */
  ID: UUID;

  /** @format date-time */
  PeriodEnd: string;

  /** @format date-time */
  PeriodStart: string;

  /**
   * A UUID is a 128 bit (16 byte) Universal Unique IDentifier as defined in RFC
   * 4122.
   */
  PreviousPeriodID: UUID;
  SubscriptionType: BillingSubscriptionType;

  /** @format date-time */
  UpdatedAt?: string;

  /** @format uint64 */
  WrittenSize: number;

  /** @format uint64 */
  WrittenSizeCost: number;
}

export interface CtlDb {
  name?: string;
  options?: CtlOption[];
  owner?: string;
}

export interface CtlDeltaOp {
  action?: string;
  name?: string;
  new_name?: string;
}

export interface CtlOption {
  name?: string;
  value?: string;
  vartype?: string;
}

export interface CtlProject {
  cluster_id?: string;
  databases?: CtlDb[];
  name?: string;
  roles?: CtlRole[];
  settings?: CtlOption[];
}

export interface CtlRole {
  encrypted_password?: string;
  name?: string;
  options?: CtlOption[];
}

export interface CurrentUserAuthAccount {
  email: string;
  image: string;
  login: string;
  name: string;
  provider: string;
}

export interface CurrentUserInfoResponse {
  auth_accounts: CurrentUserAuthAccount[];
  email: string;
  id: string;
  image: string;
  login: string;
  name: string;

  /** @format int64 */
  projects_limit: number;
}

export interface Database {
  /** @format date-time */
  created_at: string;

  /** @format int64 */
  id: number;
  name: string;

  /** @format int64 */
  owner_id: number;
  project_id: string;

  /** @format date-time */
  updated_at: string;
}

export interface DatabaseParams {
  database: { name: string; owner_id: number };
}

/**
* A Duration represents the elapsed time between two instants
as an int64 nanosecond count. The representation limits the
largest representable duration to approximately 290 years.
* @format int64
*/
export type Duration = number;

export type EndpointState = string;

export type ErrorCode = string;

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
}

export interface ExplainData {
  "QUERY PLAN": string;
}

/**
 * GlobalSettingsRaw is exposed only to transit data from database to admin response
 */
export interface GlobalSettingsRaw {
  console_settings?: ConsoleSettingsRaw;

  /** PgSettingsData is raw representation of data like in postgres */
  pg_settings?: PgSettingsData;
  user_settings?: UserSettingsRaw;
}

/**
 * GlobalSettingsTableRaw is exposed only to transit data from database to admin response
 */
export interface GlobalSettingsTableRaw {
  /**
   * A UUID is a 128 bit (16 byte) Universal Unique IDentifier as defined in RFC
   * 4122.
   */
  created_by?: UUID;

  /** @format int64 */
  id?: number;

  /** GlobalSettingsRaw is exposed only to transit data from database to admin response */
  settings?: GlobalSettingsRaw;
}

export interface GlobalUserSettings {
  features?: Config;
  limits?: GlobalUserSettingsLimits;

  /** PgSettingsData is raw representation of data like in postgres */
  pg_settings?: PgSettingsData;
}

export interface GlobalUserSettingsLimits {
  /** @format uint64 */
  cpu_seconds?: number;

  /** @format int64 */
  max_autoscaling_cu?: number;

  /** @format int64 */
  max_branches?: number;

  /** @format int64 */
  max_projects?: number;
}

export interface InstanceTypeSettings {
  K8sLimits?: K8SComputeLimits;
}

export interface InviteCreateRequest {
  /**
   * HowManyInvites is number of independent invites to generate.
   * @format int64
   */
  how_many_invites?: number;

  /** Prefix is a well-known string to prefix invites with. */
  prefix?: string;

  /**
   * TotalRegistrations is number of users each invite can add to the stand.
   * @format int64
   */
  total_registrations?: number;
}

export interface K8SComputeLimits {
  /** @format int64 */
  CPULimit?: number;

  /** @format int64 */
  CPURequest?: number;

  /** @format int64 */
  DiskLimit?: number;

  /** @format int64 */
  DiskRequest?: number;

  /** @format int64 */
  MemLimit?: number;

  /** @format int64 */
  MemRequest?: number;
}

export interface OpStartupMetrics {
  /** @format int64 */
  basebackup_ms?: number;

  /** @format int64 */
  config_ms?: number;

  /** @format int64 */
  sync_safekeepers_ms?: number;

  /** @format int64 */
  total_startup_ms?: number;
}

export interface Operation {
  /**
   *
   * create_timeline OpCreateStringTimeline
   * start_compute OpStartStringCompute
   * suspend_compute OpSuspendStringCompute
   * apply_config OpApplyConfig
   * check_availability OpCheckAvailability
   * delete_timeline OpDeleteStringTimeline
   * delete_tenant OpDeleteStringTenant
   * create_branch OpCreateStringBranch
   * replace_safekeeper OpReplaceSafekeeper
   * tenant_migrate OpMigrateTenant
   * tenant_detach OpDetachTenant
   * tenant_reattach OpReattachTenant
   */
  action: OperationAction;

  /** @format date-time */
  created_at: string;
  error?: string;

  /** @format int32 */
  failures_count: number;
  id: string;
  next_operation_id?: string;
  project_id: string;

  /** @format date-time */
  retry_at?: string;

  /**
   *
   * running OpStatusStringRunning
   * finished OpStatusStringFinished
   * failed OpStatusStringFailed
   * scheduling OpStatusStringScheduling
   */
  status: OperationStatus;

  /** @format date-time */
  updated_at: string;
}

/**
* 
create_timeline OpCreateStringTimeline
start_compute OpStartStringCompute
suspend_compute OpSuspendStringCompute
apply_config OpApplyConfig
check_availability OpCheckAvailability
delete_timeline OpDeleteStringTimeline
delete_tenant OpDeleteStringTenant
create_branch OpCreateStringBranch
replace_safekeeper OpReplaceSafekeeper
tenant_migrate OpMigrateTenant
tenant_detach OpDetachTenant
tenant_reattach OpReattachTenant
*/
export enum OperationAction {
  CreateTimeline = "create_timeline",
  StartCompute = "start_compute",
  SuspendCompute = "suspend_compute",
  ApplyConfig = "apply_config",
  CheckAvailability = "check_availability",
  DeleteTimeline = "delete_timeline",
  DeleteTenant = "delete_tenant",
  CreateBranch = "create_branch",
  ReplaceSafekeeper = "replace_safekeeper",
  TenantMigrate = "tenant_migrate",
  TenantDetach = "tenant_detach",
  TenantReattach = "tenant_reattach",
}

export interface OperationMetrics {
  startup_metrics?: OpStartupMetrics;
}

/**
* 
running OpStatusStringRunning
finished OpStatusStringFinished
failed OpStatusStringFailed
scheduling OpStatusStringScheduling
*/
export enum OperationStatus {
  Running = "running",
  Finished = "finished",
  Failed = "failed",
  Scheduling = "scheduling",
}

/**
 * PgSettingsData is raw representation of data like in postgres
 */
export type PgSettingsData = Record<string, string>;

/**
 * @format int64
 */
export type PgVersion = number;

export interface Project {
  /** @format int64 */
  branch_logical_size_limit?: number;

  /** @format date-time */
  created_at: string;

  /**
   *
   * init ProjectStateStringInit
   * active ProjectStateStringActive
   * idle ProjectStateStringIdle
   * stopped ProjectStateStringStopped
   */
  current_state: ProjectState;
  databases: ProjectDatabase[];
  deleted?: boolean;
  id: string;
  instance_handle: string;
  instance_type_id: string;
  name: string;

  /**
   *
   * init ProjectStateStringInit
   * active ProjectStateStringActive
   * idle ProjectStateStringIdle
   * stopped ProjectStateStringStopped
   */
  pending_state?: ProjectState;

  /** @format int64 */
  pg_version: number;
  platform_id: string;
  platform_name: string;
  pooler_enabled: boolean;
  proxy_host: string;
  region_id: string;
  region_name: string;
  roles: RoleWithPassword[];
  settings?: Record<string, string>;

  /** @format uint64 */
  size?: number;

  /** @format date-time */
  updated_at: string;
}

export interface ProjectCreateParams {
  project: {
    instance_type_id?: string;
    name?: string;
    pg_version?: PgVersion;
    platform_id?: string;
    psql_session_id?: string;
    region_id?: string;
    settings?: PgSettingsData;
  };
}

export interface ProjectDatabase {
  /** @format int64 */
  id: number;
  name: string;

  /** @format int64 */
  owner_id: number;
}

/**
* 
init ProjectStateStringInit
active ProjectStateStringActive
idle ProjectStateStringIdle
stopped ProjectStateStringStopped
*/
export enum ProjectState {
  Init = "init",
  Active = "active",
  Idle = "idle",
  Stopped = "stopped",
}

export interface ProjectUpdateParams {
  project: { instance_type_id?: string; name?: string; pooler_enabled?: boolean; settings?: PgSettingsData };
}

export type ProvisionerType = string;

export interface QueryHistory {
  /** @format date-time */
  created_at?: string;

  /**
   * A UUID is a 128 bit (16 byte) Universal Unique IDentifier as defined in RFC
   * 4122.
   */
  created_by?: UUID;

  /** @format int64 */
  database_id?: number;

  /**
   * A Duration represents the elapsed time between two instants
   * as an int64 nanosecond count. The representation limits the
   * largest representable duration to approximately 290 years.
   */
  duration?: Duration;

  /** @format int64 */
  id?: number;
  project_id?: string;
  query?: string;
  success?: boolean;
}

export interface QueryHistoryResponseBody {
  history?: QueryHistory[];
}

export interface QueryReq {
  /** @format int64 */
  db_id: number;
  options?: Record<string, boolean>;
  password?: string;
  query: string;
  skip_history?: boolean;

  /** @format int64 */
  user_id?: number;
}

export interface QueryResponse {
  /**
   * A Duration represents the elapsed time between two instants
   * as an int64 nanosecond count. The representation limits the
   * largest representable duration to approximately 290 years.
   */
  duration?: Duration;
  response?: StatementResult[];
  success?: boolean;
}

/**
* Users are allowed to save playground queries for later usage
QuerySaved model provides storage for playground queries
*/
export interface QuerySaved {
  /** @format date-time */
  created_at?: string;

  /**
   * A UUID is a 128 bit (16 byte) Universal Unique IDentifier as defined in RFC
   * 4122.
   */
  created_by?: UUID;

  /** @format int64 */
  database_id?: number;

  /** @format int64 */
  id?: number;
  name?: string;
  project_id?: string;
  query?: string;

  /** @format date-time */
  updated_at?: string;
}

export interface QuerySavedCreatePayload {
  /** @format int64 */
  database_id?: number;
  name?: string;
  query?: string;
}

export interface QuerySavedUpdate {
  name?: string;
  query?: string;
}

export interface RequestApiKeyCreate {
  key_name?: string;
}

export interface ResetPasswordResponseBody {
  /** DataSourceName. Database is taken arbitrary, and is same across all project roles. */
  dsn: string;
  operation_id: string;
  password: string;
}

export interface ResponseApiKeyCreate {
  /** @format int64 */
  id: number;
  key: string;
}

export interface Role {
  /** @format date-time */
  created_at: string;
  dsn?: string;

  /** @format int64 */
  id: number;
  name: string;
  password?: string;
  project_id: string;
  protected?: boolean;

  /** @format date-time */
  updated_at: string;
}

export interface RoleParams {
  role: { name: string };
}

export interface RoleWithPassword {
  dsn: string;

  /** @format int64 */
  id: number;
  name: string;
  password: string;
}

export interface StatementData {
  fields?: string[];
  rows?: string[][];
  truncated: boolean;
}

export interface StatementResult {
  data?: StatementData;
  error?: string;
  explain_data?: ExplainData[];
  query: string;
}

export interface TenantInfo {
  /** @format int64 */
  current_physical_size?: number;
  has_in_progress_downloads?: boolean;
  id?: string;
  state?: string;
}

export interface TimelineInfo {
  ancestor_lsn?: string;
  ancestor_timeline_id?: string;

  /** @format int64 */
  current_logical_size?: number;

  /** @format int64 */
  current_physical_size?: number;
  disk_consistent_lsn?: string;
  last_received_msg_lsn?: string;

  /** @format int64 */
  last_received_msg_ts?: number;
  last_record_lsn?: string;
  latest_gc_cutoff_lsn?: string;
  prev_record_lsn?: string;
  remote_consistent_lsn?: string;
  state?: string;
  tenant_id?: string;
  timeline_id?: string;
  wal_source_connstr?: string;
}

/**
* A UUID is a 128 bit (16 byte) Universal Unique IDentifier as defined in RFC
4122.
*/
export type UUID = number[];

export interface UserSettings {
  features?: UserSettingsFeatures;
  limits?: UserSettingsLimits;

  /** PgSettingsData is raw representation of data like in postgres */
  pg_settings?: PgSettingsData;
}

export interface UserSettingsFeatures {
  /** enables editing endpoint max cu limit (slider with one thumb) */
  autoscaling_ui?: boolean;

  /** enables editing endpoint both min and max cu limits (slider with two thumbs) */
  autoscaling_ui_next?: boolean;

  /** enables insights page in the console UI */
  compute_insights?: boolean;

  /** Hides the pooler checkbox from the endpoint form */
  endpoint_pooler_hidden_ui?: boolean;

  /**
   * shows warning about coming free tier v3 limits.
   * False means the free tier v3 limits already applied for the user (or not applicable)
   * True means CPU Hours are not limited for the user for now
   * but the free tier v3 limits will be enforced on March, 29
   */
  free_tier_v2?: boolean;

  /** enables integrations */
  integrations?: boolean;

  /** Enables project sharing UI */
  project_sharing_ui?: boolean;

  /** shows the synthetic_storage_size in the console projects list */
  synthetic_storage_size_ui?: boolean;

  /** enables consumption-related features */
  usage_consumption?: boolean;
}

export interface UserSettingsLimits {
  /**
   * maximum amount of compute seconds consumption during the billing period.
   * This is enforced only for limited tiers (i.e free tier), value == 0 means unlimited
   * @format uint64
   */
  cpu_seconds?: number;

  /**
   * maximum amount of compute units available for user per one endpoint, value <= 0 means unlimited
   * @format int64
   */
  max_autoscaling_cu?: number;

  /**
   * maximum number of branches allowed for user, value <= 0 means unlimited
   * @format int64
   */
  max_branches?: number;

  /**
   * maximum number of projects allowed for user, value <= 0 means unlimited
   * @format int64
   */
  max_projects?: number;
}

export interface UserSettingsLimitsRaw {
  /** @format uint64 */
  cpu_seconds?: number;

  /** @format int64 */
  max_autoscaling_cu?: number;

  /** @format int64 */
  max_branches?: number;

  /** @format int64 */
  max_projects?: number;
}

export interface UserSettingsRaw {
  limits?: UserSettingsLimitsRaw;

  /** PgSettingsData is raw representation of data like in postgres */
  pg_settings?: PgSettingsData;
}

export interface ZenithCtlSpec {
  cluster?: CtlProject;
  delta_operations?: CtlDeltaOp[];

  /** @format int64 */
  format_version?: number;

  /**
   * A UUID is a 128 bit (16 byte) Universal Unique IDentifier as defined in RFC
   * 4122.
   */
  operation_uuid?: UUID;
  startup_tracing_context?: Record<string, string>;

  /** @format date-time */
  timestamp?: string;
}

export interface AdminGetBranchesParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
  user_id?: string;
  show_deleted?: string;
  sort?: "id";
  search?: string;
  stuck?: string;
}

export interface AdminGetEndpointsParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
  user_id?: string;
  current_state?: string;
  pending_state?: string;
  show_deleted?: string;
  stuck?: string;
  sort?: "id" | "user_id" | "created_at";
  search?: string;
}

export interface AdminGlobalSettingsShowParams {
  /** @format int64 */
  id?: number;
}

export interface AdminGetInvitesParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
}

export interface AdminGetOperationsParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
  project_id?: string;
  branch_id?: string;
  endpoint_id?: string;
  status?: string;
  action?: string;
  had_retries?: string;

  /** @format date-time */
  date_from?: string;

  /** @format date-time */
  date_to?: string;
  sort?: "id" | "created_at" | "updated_at" | "action" | "status" | "failures_count";
  search?: string;
  stuck?: string;
}

export interface AdminGetPageserversParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
  sort?: "id" | "region_id" | "version" | "projects_count";
}

export interface AdminGetPlatformsParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
  sort?: "id";
}

export interface AdminGetProjectsParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
  safekeeper_id?: string;
  user_id?: string;
  pageserver_id?: string;
  tenant_id?: string;
  timeline_id?: string;
  show_deleted?: string;
  stuck?: string;
  sort?: "id" | "user_id" | "pageserver_id" | "created_at" | "synthetic_storage_size" | "resident_size";
  search?: string;
}

export interface AdminGetSafekeepersParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
  sort?: "id" | "region_id" | "version" | "projects_count";
}

export interface AdminGetUsersParams {
  order?: "asc" | "desc";

  /** @format uint64 */
  limit?: number;

  /** @format uint64 */
  offset?: number;
  sort?: "id" | "email" | "created_at" | "name";
  search?: string;
}

export interface GetQueryHistoryParams {
  /** @format int64 */
  DatabaseID?: number;
  projectId: string;
}

export interface PsqlProjectConnectParams {
  project_id: string;
  psqlSessionId: string;
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "/api/v1" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === "object" && property !== null
          ? JSON.stringify(property)
          : `${property}`,
      );
      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = (format && this.format) || void 0;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      requestParams.headers.common = { Accept: "*/*" };
      requestParams.headers.post = {};
      requestParams.headers.put = {};

      body = this.createFormData(body as Record<string, unknown>);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API V1
 * @version v1
 * @baseUrl /api/v1
 *
 * Cloudrock Cloud API
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns branches list
   *
   * @tags Admin
   * @name AdminGetBranches
   * @request GET:/admin/branches
   * @secure
   */
  adminGetBranches = (query: AdminGetBranchesParams, params: RequestParams = {}) =>
    this.request<AdminBranchesResponse, ErrorResponse>({
      path: `/admin/branches`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns branch info
   *
   * @tags Admin
   * @name AdminGetBranchById
   * @request GET:/admin/branches/{branch_id}
   * @secure
   */
  adminGetBranchById = (branchId: string, params: RequestParams = {}) =>
    this.request<AdminBranchesItemResponse, ErrorResponse>({
      path: `/admin/branches/${branchId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description queries the cloud DB for non-deleted project and branch lists. Compares both sets, using corresponding tenant and timeline ids, skipping comparing branches of a project in maintenance mode. Returns all differences found.
   *
   * @tags Admin
   * @name AdminCheckPageserver
   * @summary Queries the pageserver node for tenant and timeline lists,
   * @request POST:/admin/check_pageserver/{pageserver_id}
   * @secure
   */
  adminCheckPageserver = (pageserverId: number, params: RequestParams = {}) =>
    this.request<AdminPageserverCheckResponse, ErrorResponse>({
      path: `/admin/check_pageserver/${pageserverId}`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags admin
   * @name AdminGetEndpoints
   * @summary Returns a list of endpoints.
   * @request GET:/admin/endpoints
   * @secure
   */
  adminGetEndpoints = (query: AdminGetEndpointsParams, params: RequestParams = {}) =>
    this.request<AdminEndpointsResponse, ErrorResponse>({
      path: `/admin/endpoints`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns endpoint info
   *
   * @tags Admin
   * @name AdminGetEndpointById
   * @request GET:/admin/endpoints/{endpoint_id}
   * @secure
   */
  adminGetEndpointById = (endpointId: string, params: RequestParams = {}) =>
    this.request<AdminEndpointsItemResponse, ErrorResponse>({
      path: `/admin/endpoints/${endpointId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns global settings
   *
   * @tags Admin
   * @name AdminGlobalSettingsShow
   * @request GET:/admin/global_settings
   * @secure
   */
  adminGlobalSettingsShow = (query: AdminGlobalSettingsShowParams, params: RequestParams = {}) =>
    this.request<GlobalSettingsTableRaw, ErrorResponse>({
      path: `/admin/global_settings`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Update global settings
   *
   * @tags Admin
   * @name AdminGlobalSettingsUpdate
   * @request PATCH:/admin/global_settings
   * @secure
   */
  adminGlobalSettingsUpdate = (data: AdminGlobalSettingsUpdateRequest, params: RequestParams = {}) =>
    this.request<AdminGlobalSettingsUpdateData, ErrorResponse>({
      path: `/admin/global_settings`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Returns global settings ids
   *
   * @tags Admin
   * @name AdminGlobalSettingsIds
   * @request GET:/admin/global_settings/ids
   * @secure
   */
  adminGlobalSettingsIds = (params: RequestParams = {}) =>
    this.request<AdminGlobalSettingsIDsResponse, ErrorResponse>({
      path: `/admin/global_settings/ids`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns invites list
   *
   * @tags Admin
   * @name AdminGetInvites
   * @request GET:/admin/invites
   * @secure
   */
  adminGetInvites = (query: AdminGetInvitesParams, params: RequestParams = {}) =>
    this.request<AdminInvitesResponse, ErrorResponse>({
      path: `/admin/invites`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Create invites
   *
   * @tags Admin
   * @name AdminInviteCreate
   * @request POST:/admin/invites
   * @secure
   */
  adminInviteCreate = (data: InviteCreateRequest, params: RequestParams = {}) =>
    this.request<void, ErrorResponse>({
      path: `/admin/invites`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Returns operations list
   *
   * @tags Admin
   * @name AdminGetOperations
   * @request GET:/admin/operations
   * @secure
   */
  adminGetOperations = (query: AdminGetOperationsParams, params: RequestParams = {}) =>
    this.request<AdminOperationsResponse, ErrorResponse>({
      path: `/admin/operations`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns operation info
   *
   * @tags Admin
   * @name AdminGetOperationById
   * @request GET:/admin/operations/{operation_id}
   * @secure
   */
  adminGetOperationById = (operationId: string, params: RequestParams = {}) =>
    this.request<AdminOperationsItemResponse, ErrorResponse>({
      path: `/admin/operations/${operationId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns pageservers list
   *
   * @tags Admin
   * @name AdminGetPageservers
   * @request GET:/admin/pageservers
   * @secure
   */
  adminGetPageservers = (query: AdminGetPageserversParams, params: RequestParams = {}) =>
    this.request<AdminPageserversResponse, ErrorResponse>({
      path: `/admin/pageservers`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns pageserver info
   *
   * @tags Admin
   * @name AdminGetPageserverById
   * @request GET:/admin/pageservers/{pageserver_id}
   * @secure
   */
  adminGetPageserverById = (pageserverId: number, params: RequestParams = {}) =>
    this.request<AdminPageserverItemResponse, ErrorResponse>({
      path: `/admin/pageservers/${pageserverId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns invites list
   *
   * @tags Admin
   * @name AdminGetPlatforms
   * @request GET:/admin/platforms
   * @secure
   */
  adminGetPlatforms = (query: AdminGetPlatformsParams, params: RequestParams = {}) =>
    this.request<AdminPlatformsResponse, ErrorResponse>({
      path: `/admin/platforms`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns projects list
   *
   * @tags Admin
   * @name AdminGetProjects
   * @request GET:/admin/projects
   * @secure
   */
  adminGetProjects = (query: AdminGetProjectsParams, params: RequestParams = {}) =>
    this.request<AdminProjectsResponse, ErrorResponse>({
      path: `/admin/projects`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns project info
   *
   * @tags Admin
   * @name AdminGetProjectById
   * @request GET:/admin/projects/{project_id}
   * @secure
   */
  adminGetProjectById = (projectId: string, params: RequestParams = {}) =>
    this.request<AdminProjectsItemResponse, ErrorResponse>({
      path: `/admin/projects/${projectId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Updates project size limit
   *
   * @tags Admin
   * @name AdminUpdateProject
   * @request PATCH:/admin/projects/{project_id}
   * @secure
   */
  adminUpdateProject = (projectId: string, data: AdminProjectUpdateRequest, params: RequestParams = {}) =>
    this.request<AdminUsersItemResponse, ErrorResponse>({
      path: `/admin/projects/${projectId}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Returns operations
   *
   * @tags Admin
   * @name AdminCheckProjectAvailibility
   * @request POST:/admin/projects/{project_id}/check_availability
   * @secure
   */
  adminCheckProjectAvailibility = (projectId: string, params: RequestParams = {}) =>
    this.request<AdminCheckProjectAvailibilityResponseBody, ErrorResponse>({
      path: `/admin/projects/${projectId}/check_availability`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Admin
   * @name AdminProjectReattach
   * @request POST:/admin/projects/{project_id}/reattach
   * @secure
   */
  adminProjectReattach = (projectId: string, params: RequestParams = {}) =>
    this.request<AdminProjectReattachResponseBody, ErrorResponse>({
      path: `/admin/projects/${projectId}/reattach`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns safekeepers list
   *
   * @tags Admin
   * @name AdminGetSafekeepers
   * @request GET:/admin/safekeepers
   * @secure
   */
  adminGetSafekeepers = (query: AdminGetSafekeepersParams, params: RequestParams = {}) =>
    this.request<AdminSafekeepersResponse, ErrorResponse>({
      path: `/admin/safekeepers`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns safekeeper info
   *
   * @tags Admin
   * @name AdminGetSafekeeperById
   * @request GET:/admin/safekeepers/{safekeeper_id}
   * @secure
   */
  adminGetSafekeeperById = (safekeeperId: number, params: RequestParams = {}) =>
    this.request<AdminSafekeeperItemResponse, ErrorResponse>({
      path: `/admin/safekeepers/${safekeeperId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns users list
   *
   * @tags Admin
   * @name AdminGetUsers
   * @request GET:/admin/users
   * @secure
   */
  adminGetUsers = (query: AdminGetUsersParams, params: RequestParams = {}) =>
    this.request<AdminUsersResponse, ErrorResponse>({
      path: `/admin/users`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns user info
   *
   * @tags Admin
   * @name AdminGetUserById
   * @request GET:/admin/users/{user_id}
   * @secure
   */
  adminGetUserById = (userId: string, params: RequestParams = {}) =>
    this.request<AdminUsersItemResponse, ErrorResponse>({
      path: `/admin/users/${userId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Updates user data and returns user info
   *
   * @tags Admin
   * @name AdminUpdateUser
   * @request PATCH:/admin/users/{user_id}
   * @secure
   */
  adminUpdateUser = (userId: string, data: AdminUsersUpdateRequest, params: RequestParams = {}) =>
    this.request<AdminUsersItemResponse, ErrorResponse>({
      path: `/admin/users/${userId}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Lists API keys belonging to user
   *
   * @tags ApiKey
   * @name ListApiKeys
   * @request GET:/api_keys
   * @secure
   */
  listApiKeys = (params: RequestParams = {}) =>
    this.request<ApiKeysListResponseItem[], ErrorResponse>({
      path: `/api_keys`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Creates new API key
   *
   * @tags ApiKey
   * @name CreateApiKey
   * @request POST:/api_keys
   * @secure
   */
  createApiKey = (data: RequestApiKeyCreate, params: RequestParams = {}) =>
    this.request<ResponseApiKeyCreate, ErrorResponse>({
      path: `/api_keys`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Revoke API key that belongs to user
   *
   * @tags ApiKey
   * @name RevokeApiKey
   * @request DELETE:/api_keys/{key_id}
   * @secure
   */
  revokeApiKey = (keyId: number, params: RequestParams = {}) =>
    this.request<ApiKeyRevokeResponse, ErrorResponse>({
      path: `/api_keys/${keyId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns operations list of the current user
   *
   * @tags Operation
   * @name GetOperations
   * @request GET:/operations
   * @secure
   */
  getOperations = (params: RequestParams = {}) =>
    this.request<Operation[], any>({
      path: `/operations`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns requested operation
   *
   * @tags Operation
   * @name GetOperation
   * @request GET:/operations/{operation_id}
   * @secure
   */
  getOperation = (operationId: string, params: RequestParams = {}) =>
    this.request<Operation, ErrorResponse>({
      path: `/operations/${operationId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns projects list
   *
   * @tags Project
   * @name GetProjectList
   * @request GET:/projects
   * @secure
   */
  getProjectList = (params: RequestParams = {}) =>
    this.request<Project[], any>({
      path: `/projects`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Creates new project
   *
   * @tags Project
   * @name CreateProject
   * @request POST:/projects
   * @secure
   */
  createProject = (data: ProjectCreateParams, params: RequestParams = {}) =>
    this.request<Project, ErrorResponse>({
      path: `/projects`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Returns project info
   *
   * @tags Project
   * @name GetProject
   * @request GET:/projects/{project_id}
   * @secure
   */
  getProject = (projectId: string, params: RequestParams = {}) =>
    this.request<Project, ErrorResponse>({
      path: `/projects/${projectId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Update project
   *
   * @tags Project
   * @name UpdateProject
   * @request PATCH:/projects/{project_id}
   * @secure
   */
  updateProject = (projectId: string, data: ProjectUpdateParams, params: RequestParams = {}) =>
    this.request<Project, ErrorResponse>({
      path: `/projects/${projectId}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name BranchCreate
   * @summary Creates new branch on a given project.
   * @request POST:/projects/{project_id}/branches
   * @secure
   */
  branchCreate = (projectId: string, params: RequestParams = {}) =>
    this.request<Project, ErrorResponse>({
      path: `/projects/${projectId}/branches`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name GetProjectDatabaseList
   * @summary Shows list of databases of the specified project.
   * @request GET:/projects/{project_id}/databases
   * @secure
   */
  getProjectDatabaseList = (projectId: string, params: RequestParams = {}) =>
    this.request<Database[], ErrorResponse>({
      path: `/projects/${projectId}/databases`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name CreateProjectDatabase
   * @summary Create new database in the project.
   * @request POST:/projects/{project_id}/databases
   * @secure
   */
  createProjectDatabase = (projectId: string, data: DatabaseParams, params: RequestParams = {}) =>
    this.request<Database, ErrorResponse>({
      path: `/projects/${projectId}/databases`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name GetProjectDatabase
   * @summary Returns specified database of the project.
   * @request GET:/projects/{project_id}/databases/{database_id}
   * @secure
   */
  getProjectDatabase = (projectId: string, databaseId: number, params: RequestParams = {}) =>
    this.request<Database, ErrorResponse>({
      path: `/projects/${projectId}/databases/${databaseId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name UpdateProjectDatabase
   * @summary Update specified database of the project.
   * @request PUT:/projects/{project_id}/databases/{database_id}
   * @secure
   */
  updateProjectDatabase = (projectId: string, databaseId: number, data: DatabaseParams, params: RequestParams = {}) =>
    this.request<Database, ErrorResponse>({
      path: `/projects/${projectId}/databases/${databaseId}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name DeleteProjectDatabase
   * @summary DeleteProject specified database of the project.
   * @request DELETE:/projects/{project_id}/databases/{database_id}
   * @secure
   */
  deleteProjectDatabase = (projectId: string, databaseId: number, params: RequestParams = {}) =>
    this.request<Database, ErrorResponse>({
      path: `/projects/${projectId}/databases/${databaseId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description DeleteProject project
   *
   * @tags Project
   * @name DeleteProject
   * @request POST:/projects/{project_id}/delete
   * @secure
   */
  deleteProject = (projectId: string, params: RequestParams = {}) =>
    this.request<Operation, ErrorResponse>({
      path: `/projects/${projectId}/delete`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns project operations list
   *
   * @tags Project
   * @name GetProjectOperationList
   * @request GET:/projects/{project_id}/operations
   * @secure
   */
  getProjectOperationList = (projectId: string, params: RequestParams = {}) =>
    this.request<Operation[], any>({
      path: `/projects/${projectId}/operations`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns requested operation of the specified project
   *
   * @tags Project
   * @name GetProjectOperation
   * @request GET:/projects/{project_id}/operations/{operation_id}
   * @secure
   */
  getProjectOperation = (projectId: string, operationId: string, params: RequestParams = {}) =>
    this.request<Operation, ErrorResponse>({
      path: `/projects/${projectId}/operations/${operationId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Run query on the specified project
   *
   * @tags Project
   * @name RunProjectQuery
   * @request POST:/projects/{project_id}/query
   * @secure
   */
  runProjectQuery = (projectId: string, data: QueryReq, params: RequestParams = {}) =>
    this.request<QueryResponse, ErrorResponse>({
      path: `/projects/${projectId}/query`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Get the query history
   *
   * @name GetQueryHistory
   * @request GET:/projects/{project_id}/query/history
   * @secure
   */
  getQueryHistory = ({ projectId, ...query }: GetQueryHistoryParams, params: RequestParams = {}) =>
    this.request<QueryHistoryResponseBody, ErrorResponse>({
      path: `/projects/${projectId}/query/history`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Returns saved queries
   *
   * @tags Project
   * @name QuerySavedReadAll
   * @request GET:/projects/{project_id}/query/saved
   * @secure
   */
  querySavedReadAll = (projectId: string, params: RequestParams = {}) =>
    this.request<QuerySaved[], ErrorResponse>({
      path: `/projects/${projectId}/query/saved`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Creates new saved query record
   *
   * @tags Project
   * @name QuerySavedCreate
   * @request POST:/projects/{project_id}/query/saved
   * @secure
   */
  querySavedCreate = (projectId: string, data: QuerySavedCreatePayload, params: RequestParams = {}) =>
    this.request<QuerySaved, ErrorResponse>({
      path: `/projects/${projectId}/query/saved`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Updates saved query record
   *
   * @tags Project
   * @name QuerySavedUpdate
   * @request PUT:/projects/{project_id}/query/saved/{id}
   * @secure
   */
  querySavedUpdate = (id: number, projectId: string, data: QuerySavedUpdate, params: RequestParams = {}) =>
    this.request<QuerySaved, ErrorResponse>({
      path: `/projects/${projectId}/query/saved/${id}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Updates saved query record
   *
   * @tags Project
   * @name QuerySavedDelete
   * @request DELETE:/projects/{project_id}/query/saved/{id}
   * @secure
   */
  querySavedDelete = (id: number, projectId: string, params: RequestParams = {}) =>
    this.request<QuerySaved, ErrorResponse>({
      path: `/projects/${projectId}/query/saved/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name GetProjectRoleList
   * @summary Shows list of roles of the specified project.
   * @request GET:/projects/{project_id}/roles
   * @secure
   */
  getProjectRoleList = (projectId: string, params: RequestParams = {}) =>
    this.request<Role[], ErrorResponse>({
      path: `/projects/${projectId}/roles`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name CreateProjectRole
   * @summary Create new role in the project.
   * @request POST:/projects/{project_id}/roles
   * @secure
   */
  createProjectRole = (projectId: string, data: RoleParams, params: RequestParams = {}) =>
    this.request<Role, ErrorResponse>({
      path: `/projects/${projectId}/roles`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name GetProjectRole
   * @summary Shows specified role of the project.
   * @request GET:/projects/{project_id}/roles/{role_name}
   * @secure
   */
  getProjectRole = (projectId: string, roleName: string, params: RequestParams = {}) =>
    this.request<Role, ErrorResponse>({
      path: `/projects/${projectId}/roles/${roleName}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Project
   * @name DeleteProjectRole
   * @summary DeleteProject specified role of the project.
   * @request DELETE:/projects/{project_id}/roles/{role_name}
   * @secure
   */
  deleteProjectRole = (projectId: string, roleName: string, params: RequestParams = {}) =>
    this.request<Role, ErrorResponse>({
      path: `/projects/${projectId}/roles/${roleName}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Reset pwd role
   *
   * @tags Project
   * @name ResetProjectRolePassword
   * @request POST:/projects/{project_id}/roles/{role_name}/reset_password
   * @secure
   */
  resetProjectRolePassword = (projectId: string, roleName: string, params: RequestParams = {}) =>
    this.request<ResetPasswordResponseBody, ErrorResponse>({
      path: `/projects/${projectId}/roles/${roleName}/reset_password`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Starts project
   *
   * @tags Project
   * @name StartProject
   * @request POST:/projects/{project_id}/start
   * @secure
   */
  startProject = (projectId: string, params: RequestParams = {}) =>
    this.request<Operation, ErrorResponse>({
      path: `/projects/${projectId}/start`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Stops project
   *
   * @tags Project
   * @name StopProject
   * @request POST:/projects/{project_id}/stop
   * @secure
   */
  stopProject = (projectId: string, params: RequestParams = {}) =>
    this.request<Operation, ErrorResponse>({
      path: `/projects/${projectId}/stop`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * @description Connects to project from psql connect page
   *
   * @tags Project
   * @name PsqlProjectConnect
   * @request POST:/psql_session/{psql_session_id}
   * @secure
   */
  psqlProjectConnect = ({ psqlSessionId, ...query }: PsqlProjectConnectParams, params: RequestParams = {}) =>
    this.request<void, ErrorResponse>({
      path: `/psql_session/${psqlSessionId}`,
      method: "POST",
      query: query,
      secure: true,
      ...params,
    });

  /**
   * No description
   *
   * @tags UsersBilling
   * @name GetUserBillingInfo
   * @summary Get latest billing info for logged-in user.
   * @request GET:/users/billing
   * @secure
   */
  getUserBillingInfo = (params: RequestParams = {}) =>
    this.request<CurrentUserInfoResponse, ErrorResponse>({
      path: `/users/billing`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Users
   * @name GetCurrentUserInfo
   * @summary Get info for logged-in user.
   * @request GET:/users/me
   * @secure
   */
  getCurrentUserInfo = (params: RequestParams = {}) =>
    this.request<CurrentUserInfoResponse, ErrorResponse>({
      path: `/users/me`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
