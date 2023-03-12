export interface ConsumptionHistoryPeriodResponse {
    periods: ConsumptionHistoryPeriod[];
}
/**
* A period of consumption. The period can be maximum equal to one calendar month of consumption.
When subscription type changes, the period ends and a new one starts.
Although it might depend from user to user,
the default start of consumption history period is the 1st day of month.
*/
export interface ConsumptionHistoryPeriod {
    /**
     * Neon started collecting consumption for that consumption period at that moment in time.
     *
     * @format date-time
     */
    period_start: string;
    /**
     * Wall-clock time spent observing compute-node being active. Seconds.
     *
     * @format int64
     * @min 0
     */
    active_time: number;
    /**
     * The amount of written data metric consumed during this period. Bytes.
     *
     * @format int64
     * @min 0
     */
    written_data: number;
    /**
     * The amount of data storage metric consumed during this period. GiB-Hour.
     *
     * @format int64
     * @min 0
     */
    data_storage: number;
    /**
     * The amount of data transfer metric consumed during this period. Bytes.
     *
     * @format int64
     * @min 0
     */
    data_transfer: number;
    /**
     * The amount of compute time metric consumed during this period. Seconds.
     *
     * @format int64
     * @min 0
     */
    compute_time: number;
    /**
     * The cost of consumption of "written data" metric in cents (!) without taxes.
     *
     * @format int64
     * @min 0
     */
    written_data_cost: number;
    /**
     * The cost of consumption of "data storage" metric in cents (!) without taxes.
     *
     * @format int64
     * @min 0
     */
    data_storage_cost: number;
    /**
     * The cost of consumption of "data transfer" metric in cents (!) without taxes.
     *
     * @format int64
     * @min 0
     */
    data_transfer_cost: number;
    /**
     * The cost of consumption of "compute time" metric in cents (!) without taxes.
     *
     * @format int64
     * @min 0
     */
    compute_time_cost: number;
    /**
     * The human readable representation of total cost and currency_code. Use it for reference and debugging.
     *
     */
    cost_total_human: string;
    /**
     * The total cost of consumption over all known metrics in cents (!) without taxes.
     * For example, having a total cost of 4 United States dollars and 25 cents gives us
     * * cost_total of 425,
     * * currency_code of "USD",
     * * cost_total_human of "4.25 USD".
     *
     * @format int64
     * @min 0
     */
    cost_total: number;
    /**
     * Base currency for costs in this consumption history period.
     *
     */
    currency_code: string;
}
export interface PaginationResponse {
    /**
     * Cursor based pagination is used. The user must pass the cursor as is to the backend.
     * For more information about cursor based pagination, see
     * https://learn.microsoft.com/en-us/ef/core/querying/pagination#keyset-pagination
     *
     */
    pagination?: Pagination;
}
/**
* Cursor based pagination is used. The user must pass the cursor as is to the backend.
For more information about cursor based pagination, see
https://learn.microsoft.com/en-us/ef/core/querying/pagination#keyset-pagination
* @example {"cursor":"2022-12-07T00:45:05.262011Z"}
*/
export interface Pagination {
    cursor: string;
}
/**
 * Empty response.
 */
export declare type EmptyResponse = object;
export interface InvoiceListResponse {
    invoices: Invoice[];
}
export interface Invoice {
    /**
     * Number of the invoice. Unique per user.
     *
     */
    invoice_number: string;
    /**
     * The invoice is "issued" at this moment in time.
     * From now on, we attempt to collect money for this invoice.
     *
     * @format date-time
     */
    issued_at: string;
    /**
     * Neon successfully collected payment for this invoice at this moment in time.
     *
     * @format date-time
     */
    paid_at?: string;
    /**
     * ID of the invoice. Unique per user.
     *
     */
    invoice_id: string;
    pdf_url: string;
    status: "paid" | "issued";
    /** @format date-time */
    due_date?: string;
    hosted_invoice_url: string;
    total: string;
    currency: string;
}
export interface ApplicationsListResponse {
    /**
     * This list of applications is sorted.
     * Both OAuth apps and external integrations are in single list.
     * Active applications come first.
     * Then sorted by human-readable name.
     *
     */
    applications: (OAuthApplication | ExternalIntegration)[];
}
export interface ExternalIntegration {
    active: boolean;
    /** If type is UNKNOWN then use some default representation. */
    client_type: "UNKNOWN" | "vercel";
    /** Human-readable name */
    name: string;
    /**
     * Vercel integration is bound to a Neon branch.
     * User specifies endpoint to expose to each Vercel project.
     *
     */
    vercel?: VercelIntegration;
}
export interface VercelIntegrationDetailsResponse {
    vercel: VercelIntegrationDetails;
}
export interface VercelIntegrationDetails {
    /** ID of Vercel configuration */
    configuration_id: string;
    /** ID of Vercel project */
    vercel_project_id: string;
    /** Database role name */
    role_name: string;
    /** Database name */
    database_name: string;
}
/**
* Vercel integration is bound to a Neon branch.
User specifies endpoint to expose to each Vercel project.
*/
export interface VercelIntegration {
    details?: (VercelIntegrationDetailsResponse & ProjectResponse & BranchResponse & EndpointResponse)[];
}
export interface OAuthApplication {
    active: boolean;
    /** Oauth Client ID */
    client_id: string;
    /** Human-readable name */
    name: string;
}
export interface QueryHistoryItem {
    /** @format int64 */
    id: number;
    project_id: string;
    /** @format int64 */
    database_id: number;
    /**
     * A Duration represents the elapsed time between two instants
     * as an int64 nanosecond count. The representation limits the
     * largest representable duration to approximately 290 years.
     */
    duration: Duration;
    query: string;
    success: boolean;
    /** @format uuid */
    created_by: string;
    /** @format date-time */
    created_at: string;
}
/**
 * @example {"history":[{"created_at":"2022-08-01T13:24:39.947Z","created_by":"629982cc-de05-43db-ae16-28f2399c4910","duration":50,"id":4,"project_id":"spring-example-302709","query":"SELECT * FROM table_name","success":true},{"created_at":"2022-08-01T13:24:39.947Z","created_by":"629982cc-de05-43db-ae16-28f2399c4910","duration":149,"id":2,"project_id":"spring-example-302709","query":"SELECT * FROM table_name WHERE condition","success":false}]}
 */
export interface QueryHistoryResponse {
    history?: QueryHistoryItem[];
}
/**
* Users are allowed to save playground queries for later usage.
SavedQuery model provides storage for playground queries.
* @example {"created_at":"2022-08-01T13:24:39.947Z","created_by":["629982cc-de05-43db-ae16-28f2399c4910"],"id":54,"name":"example_record","project_id":"spring-example-302709","query":"SELECT * FROM table_name","updated_at":"2022-08-01T13:24:39.947Z"}
*/
export interface SavedQuery {
    /** @format int64 */
    id: number;
    project_id: string;
    /** @format int64 */
    database_id: number;
    name: string;
    query: string;
    /** @format uuid */
    created_by: string;
    /** @format date-time */
    created_at: string;
    /** @format date-time */
    updated_at: string;
}
export interface SavedQueryCreateRequest {
    /** @format int64 */
    database_id: number;
    name: string;
    query: string;
}
export interface SavedQueryUpdateRequest {
    name?: string;
    query?: string;
}
export interface ApiKeyCreateRequest {
    /** A user-specified API key name. This value is required when creating an API key. */
    key_name: string;
}
export interface ApiKeyCreateResponse {
    /**
     * The API key ID
     * @format int64
     */
    id: number;
    /** The generated 64-bit token required to access the Neon API */
    key: string;
}
export interface ApiKeyRevokeResponse {
    /**
     * The API key ID
     * @format int64
     */
    id: number;
    /** The user-specified API key name */
    name: string;
    /** A `true` or `false` value indicating whether the API key is revoked */
    revoked: boolean;
    /**
     * A timestamp indicating when the API was last used
     * @format date-time
     */
    last_used_at?: string | null;
    /** The IP address from which the API key was last used */
    last_used_from_addr: string;
}
export interface ApiKeysListResponseItem {
    /**
     * The API key ID
     * @format int64
     */
    id: number;
    /** The user-specified API key name */
    name: string;
    /**
     * A timestamp indicating when the API key was created
     * @format date-time
     */
    created_at: string;
    /**
     * A timestamp indicating when the API was last used
     * @format date-time
     */
    last_used_at?: string | null;
    /** The IP address from which the API key was last used */
    last_used_from_addr: string;
}
/**
 * @example [{"id":"a07f8772-1877-4da9-a939-3a3ae62d1d8d","project_id":"spring-example-302709","branch_id":"br-wispy-meadow-118737","endpoint_id":"ep-silent-smoke-806639","action":"create_branch","status":"running","failures_count":0,"created_at":"2022-11-08T23:33:16Z","updated_at":"2022-11-08T23:33:20Z"},{"id":"d8ac46eb-a757-42b1-9907-f78322ee394e","project_id":"spring-example-302709","branch_id":"br-wispy-meadow-118737","endpoint_id":"ep-silent-smoke-806639","action":"start_compute","status":"finished","failures_count":0,"created_at":"2022-11-15T20:02:00Z","updated_at":"2022-11-15T20:02:02Z"}]
 */
export interface Operation {
    /**
     * The operation ID
     * @format uuid
     */
    id: string;
    /** The Neon project ID */
    project_id: string;
    /** The branch ID */
    branch_id?: string;
    /** The endpoint ID */
    endpoint_id?: string;
    /** The action performed by the operation */
    action: OperationAction;
    /** The status of the operation */
    status: OperationStatus;
    /** The error that occured */
    error?: string;
    /**
     * The number of times the operation failed
     * @format int32
     */
    failures_count: number;
    /**
     * A timestamp indicating when the operation was last retried
     * @format date-time
     */
    retry_at?: string;
    /**
     * A timestamp indicating when the operation was created
     * @format date-time
     */
    created_at: string;
    /**
     * A timestamp indicating when the operation status was last updated
     * @format date-time
     */
    updated_at: string;
}
export interface OperationResponse {
    operation: Operation;
}
export interface OperationsResponse {
    operations: Operation[];
}
/**
 * The action performed by the operation
 */
export declare enum OperationAction {
    CreateCompute = "create_compute",
    CreateTimeline = "create_timeline",
    StartCompute = "start_compute",
    SuspendCompute = "suspend_compute",
    ApplyConfig = "apply_config",
    CheckAvailability = "check_availability",
    DeleteTimeline = "delete_timeline",
    CreateBranch = "create_branch",
    TenantMigrate = "tenant_migrate",
    TenantDetach = "tenant_detach",
    TenantReattach = "tenant_reattach",
    ReplaceSafekeeper = "replace_safekeeper"
}
/**
 * The status of the operation
 */
export declare enum OperationStatus {
    Running = "running",
    Finished = "finished",
    Failed = "failed",
    Scheduling = "scheduling"
}
/**
 * @example {"id":"spring-example-302709","platform_id":"aws","region_id":"aws-us-east-2","name":"spring-example-302709","provisioner":"k8s-pod","pg_version":15,"proxy_host":"us-east-2.aws.cloudrock.ca","store_passwords":true,"creation_source":"console","created_at":"2022-12-13T01:30:55Z","updated_at":"2022-12-13T01:30:55Z"}
 */
export interface Project {
    /**
     * The project ID
     *
     */
    id: string;
    /**
     * The cloud platform identifier. Currently, only AWS is supported, for which the identifier is `aws`.
     *
     */
    platform_id: string;
    /**
     * The region identifier
     *
     */
    region_id: string;
    /**
     * The project name
     *
     */
    name: string;
    /**
     * The Neon project provisioner
     *
     */
    provisioner?: "k8s-pod" | "k8s-cloudrockvm" | "docker";
    /** A collection of settings for a Neon project */
    default_endpoint_settings?: ProjectSettingsData;
    settings?: ProjectSettings;
    /** The major PostgreSQL version number. Currently supported version are `14` and `15`. */
    pg_version: PgVersion;
    /**
     * The proxy host for the project. This value combines the `region_id`, the `platform_id`, and the Neon domain (`cloudrock.ca`).
     *
     */
    proxy_host: string;
    /**
     * The logical size limit for a branch. The value is in MiB.
     *
     * @format int64
     */
    branch_logical_size_limit: number;
    /**
     * Whether or not passwords are stored for roles in the Neon project. Storing passwords facilitates access to Neon features that require authorization.
     *
     */
    store_passwords: boolean;
    /**
     * Control plane observed endpoints of this project being active this amount of wall-clock time.
     *
     * @format int64
     * @min 0
     */
    active_time: number;
    /**
     * The number of CPU seconds used by the project's compute endpoints, including compute endpoints that have been deleted.
     * The value is reset at the beginning of each billing period.
     * Examples:
     * 1. An endpoint that uses 1 CPU for 1 second is equal to `cpu_used_sec=1`.
     * 2. An endpoint that uses 2 CPUs simultaneously for 1 second is equal to `cpu_used_sec=2`.
     *
     * @format int64
     */
    cpu_used_sec: number;
    /**
     * A timestamp indicating when project maintenance begins. If set, the project is placed into maintenance mode at this time.
     *
     * @format date-time
     */
    maintenance_starts_at?: string;
    /**
     * The project creation source
     *
     */
    creation_source: string;
    /**
     * A timestamp indicating when the project was created
     *
     * @format date-time
     */
    created_at: string;
    /**
     * A timestamp indicating when the project was last updated
     *
     * @format date-time
     */
    updated_at: string;
    /**
     * Experimental. Do not use this field yet.
     * The data storage size in bytes.
     *
     * @format int64
     */
    synthetic_storage_size?: number;
    /**
     * A timestamp indicating when the project quota resets
     *
     * @format date-time
     */
    quota_reset_at?: string;
    owner_id: string;
}
export interface ProjectCreateRequest {
    project: {
        settings?: ProjectSettings;
        name?: string;
        autoscaling_limit_min_cu?: number;
        autoscaling_limit_max_cu?: number;
        provisioner?: "k8s-pod" | "k8s-cloudrockvm" | "docker";
        region_id?: string;
        default_endpoint_settings?: PgSettingsData;
        pg_version?: PgVersion;
        store_passwords?: boolean;
    };
}
export interface ProjectUpdateRequest {
    project: {
        settings?: ProjectSettings;
        name?: string;
        default_endpoint_settings?: PgSettingsData;
    };
}
export interface ProjectSettings {
    /**
     * The consumption quota of a project.
     * After the quota has been exceeded, it is impossible to use the project until either:
     * * Neon cloud resets the calculated consumption,
     * * or the user increases quota for the project.
     * The Neon cloud resets the quota at the beginning of the billing period.
     *
     * If the quota is not set, the project can use as many resources as needed.
     */
    quota?: ProjectSettingsQuota;
}
export interface ProjectResponse {
    project: Project;
}
export interface ProjectsResponse {
    projects: Project[];
}
export interface ProjectPermission {
    id: string;
    granted_to_email: string;
    /** @format date-time */
    granted_at: string;
    /** @format date-time */
    revoked_at?: string;
}
export interface ProjectPermissions {
    project_permissions: ProjectPermission[];
}
export interface GrantPermissionToProjectRequest {
    email: string;
}
/**
 * @example {"id":"br-wispy-meadow-118737","project_id":"spring-example-302709","parent_id":"br-aged-salad-637688","parent_lsn":"0/1DE2850","name":"dev2","current_state":"ready","creation_source":"console","created_at":"2022-11-30T19:09:48Z","updated_at":"2022-12-01T19:53:05Z","primary":true}
 */
export interface Branch {
    /**
     * The branch ID. This value is generated when a branch is created. A `branch_id` value has a `br` prefix. For example: `br-small-term-683261`.
     *
     */
    id: string;
    /**
     * The ID of the project to which the branch belongs
     *
     */
    project_id: string;
    /**
     * The `branch_id` of the parent branch
     *
     */
    parent_id?: string;
    /**
     * The Log Sequence Number (LSN) on the parent branch from which this branch was created
     *
     */
    parent_lsn?: string;
    /**
     * The point in time on the parent branch from which this branch was created
     *
     * @format date-time
     */
    parent_timestamp?: string;
    /**
     * The branch name
     *
     */
    name: string;
    /** The branch state */
    current_state: BranchState;
    /** The branch state */
    pending_state?: BranchState;
    /**
     * The logical size of the branch, in bytes
     *
     * @format int64
     */
    logical_size?: number;
    /**
     * The physical size of the branch, in bytes
     *
     * @format int64
     */
    physical_size?: number;
    /**
     * The branch creation source
     *
     */
    creation_source: string;
    /**
     * Whether the branch is the project's primary branch
     *
     */
    primary: boolean;
    /**
     * CPU seconds used by all the endpoints of the branch, including deleted ones.
     * This value is reset at the beginning of each billing period.
     * Examples:
     * 1. A branch that uses 1 CPU for 1 second is equal to `cpu_used_sec=1`.
     * 2. A branch that uses 2 CPUs simultaneously for 1 second is equal to `cpu_used_sec=2`.
     *
     * @format int64
     */
    cpu_used_sec: number;
    /**
     * A timestamp indicating when the branch was created
     *
     * @format date-time
     */
    created_at: string;
    /**
     * A timestamp indicating when the branch was last updated
     *
     * @format date-time
     */
    updated_at: string;
}
/**
 * The branch state
 */
export declare enum BranchState {
    Init = "init",
    Ready = "ready"
}
export interface BranchCreateRequestEndpointOptions {
    /**
     * The compute endpoint type. Either `read_write` or `read_only`.
     * The `read_only` compute endpoint type is not yet supported.
     *
     */
    type: EndpointType;
    /**
     * The minimum number of CPU units
     *
     * @format int32
     */
    autoscaling_limit_min_cu?: number;
    /**
     * The maximum number of CPU units
     *
     * @format int32
     */
    autoscaling_limit_max_cu?: number;
}
export interface BranchCreateRequest {
    endpoints?: BranchCreateRequestEndpointOptions[];
    branch?: {
        parent_id?: string;
        name?: string;
        parent_lsn?: string;
        parent_timestamp?: string;
    };
}
export interface BranchUpdateRequest {
    branch: {
        name?: string;
    };
}
export interface BranchResponse {
    branch: Branch;
}
export interface BranchesResponse {
    branches: Branch[];
}
export interface ConnectionURI {
    /**
     * Connection URI is same as specified in https://www.postgresql.org/docs/current/libpq-connect.html#id-1.7.3.8.3.6
     * It is a ready to use string for psql or for DATABASE_URL environment variable.
     *
     */
    connection_uri: string;
}
/**
 * @example {"host":"ep-silent-smoke-806639.us-east-2.aws.cloudrock.ca","id":"ep-silent-smoke-806639","project_id":"spring-example-302709","branch_id":"br-wispy-meadow-118737","autoscaling_limit_min_cu":1,"autoscaling_limit_max_cu":1,"region_id":"aws-us-east-2","type":"read_write","current_state":"init","pending_state":"active","settings":{"pg_settings":{}},"pooler_enabled":false,"pooler_mode":"transaction","disabled":false,"passwordless_access":true,"creation_source":"console","created_at":"2022-12-03T15:37:07Z","updated_at":"2022-12-03T15:37:07Z","proxy_host":"us-east-2.aws.cloudrock.ca"}
 */
export interface Endpoint {
    /**
     * The hostname of the compute endpoint. This is the hostname specified when connecting to a Neon database.
     *
     */
    host: string;
    /**
     * The compute endpoint ID. Compute endpoint IDs have an `ep-` prefix. For example: `ep-little-smoke-851426`
     *
     */
    id: string;
    /**
     * The ID of the project to which the compute endpoint belongs
     *
     */
    project_id: string;
    /**
     * The ID of the branch that the compute endpoint is associated with
     *
     */
    branch_id: string;
    /**
     * The minimum number of CPU units
     *
     * @format int32
     */
    autoscaling_limit_min_cu: number;
    /**
     * The maximum number of CPU units
     *
     * @format int32
     */
    autoscaling_limit_max_cu: number;
    /**
     * The region identifier
     *
     */
    region_id: string;
    /**
     * The compute endpoint type. Either `read_write` or `read_only`.
     * The `read_only` compute endpoint type is not yet supported.
     *
     */
    type: EndpointType;
    /**
     * The state of the compute endpoint
     *
     */
    current_state: EndpointState;
    /**
     * The state of the compute endpoint
     *
     */
    pending_state?: EndpointState;
    /** A collection of settings for a compute endpoint */
    settings: EndpointSettingsData;
    /**
     * Whether connection pooling is enabled for the compute endpoint
     *
     */
    pooler_enabled: boolean;
    /**
     * The connection pooler mode. Neon supports PgBouncer in `transaction` mode only.
     *
     */
    pooler_mode: EndpointPoolerMode;
    /**
     * Whether to restrict connections to the compute endpoint
     *
     */
    disabled: boolean;
    /**
     * Whether to permit passwordless access to the compute endpoint
     *
     */
    passwordless_access: boolean;
    /**
     * A timestamp indicating when the compute endpoint was last active
     *
     * @format date-time
     */
    last_active?: string;
    /**
     * The compute endpoint creation source
     *
     */
    creation_source: string;
    /**
     * A timestamp indicating when the compute endpoint was created
     *
     * @format date-time
     */
    created_at: string;
    /**
     * A timestamp indicating when the compute endpoint was last updated
     *
     * @format date-time
     */
    updated_at: string;
    /**
     * DEPRECATED. Use the "host" property instead.
     *
     */
    proxy_host: string;
}
/**
 * The state of the compute endpoint
 */
export declare enum EndpointState {
    Init = "init",
    Active = "active",
    Idle = "idle"
}
/**
* The compute endpoint type. Either `read_write` or `read_only`.
The `read_only` compute endpoint type is not yet supported.
*/
export declare enum EndpointType {
    ReadOnly = "read_only",
    ReadWrite = "read_write"
}
/**
 * The connection pooler mode. Neon supports PgBouncer in `transaction` mode only.
 */
export declare enum EndpointPoolerMode {
    Transaction = "transaction"
}
export interface EndpointCreateRequest {
    endpoint: {
        branch_id: string;
        region_id?: string;
        type: EndpointType;
        settings?: EndpointSettingsData;
        autoscaling_limit_min_cu?: number;
        autoscaling_limit_max_cu?: number;
        pooler_enabled?: boolean;
        pooler_mode?: EndpointPoolerMode;
        disabled?: boolean;
        passwordless_access?: boolean;
    };
}
export interface EndpointUpdateRequest {
    endpoint: {
        branch_id?: string;
        autoscaling_limit_min_cu?: number;
        autoscaling_limit_max_cu?: number;
        settings?: EndpointSettingsData;
        pooler_enabled?: boolean;
        pooler_mode?: EndpointPoolerMode;
        disabled?: boolean;
        passwordless_access?: boolean;
    };
}
export interface EndpointResponse {
    endpoint: Endpoint;
}
export interface ConnectionURIsResponse {
    connection_uris: ConnectionURI[];
}
export interface ConnectionURIsOptionalResponse {
    connection_uris?: ConnectionURI[];
}
export interface ConnectionURIResponse {
    connection_uri: ConnectionURI;
}
export interface EndpointsResponse {
    endpoints: Endpoint[];
}
export interface EndpointPasswordlessSessionAuthRequest {
    session_id: string;
}
export interface QueryRequest {
    endpoint_id?: string;
    branch_id?: string;
    db_name: string;
    role_name?: string;
    password?: string;
    options?: Record<string, boolean>;
    query: string;
    skip_history?: boolean;
}
export interface QueryResponse {
    /**
     * A Duration represents the elapsed time between two instants
     * as an int64 nanosecond count. The representation limits the
     * largest representable duration to approximately 290 years.
     */
    duration?: Duration;
    response?: StatementResult[];
    success: boolean;
}
/**
* A Duration represents the elapsed time between two instants
as an int64 nanosecond count. The representation limits the
largest representable duration to approximately 290 years.
* @format int64
*/
export declare type Duration = number;
export interface StatementResult {
    data?: StatementData;
    error?: string;
    explain_data?: ExplainData[];
    query: string;
}
export interface StatementData {
    fields?: string[];
    rows?: string[][];
    truncated: boolean;
}
export interface ExplainData {
    "QUERY PLAN": string;
}
/**
 * @example {"branch_id":"br-wispy-meadow-118737","name":"casey","protected":false,"created_at":"2022-11-23T17:42:25Z","updated_at":"2022-11-23T17:42:25Z"}
 */
export interface Role {
    /**
     * The ID of the branch to which the role belongs
     *
     */
    branch_id: string;
    /**
     * The role name
     *
     */
    name: string;
    /**
     * The role password
     *
     */
    password?: string;
    /**
     * Whether or not the role is system-protected
     *
     */
    protected?: boolean;
    /**
     * A timestamp indicating when the role was created
     *
     * @format date-time
     */
    created_at: string;
    /**
     * A timestamp indicating when the role was last updated
     *
     * @format date-time
     */
    updated_at: string;
}
export interface RoleCreateRequest {
    role: {
        name: string;
    };
}
export interface RoleResponse {
    role: Role;
}
export interface RolesResponse {
    roles: Role[];
}
export interface RolePasswordResponse {
    /**
     * The role password
     *
     */
    password: string;
}
export interface PaymentSourceBankCard {
    /**
     * Last 4 digits of the card.
     *
     */
    last4: string;
}
export interface PaymentSource {
    /**
     * Type of payment source. E.g. "card".
     *
     */
    type: string;
    card?: PaymentSourceBankCard;
}
export interface BillingAccount {
    payment_source: PaymentSource;
    /**
     * Type of subscription to Neon Cloud.
     * Notice that for users without billing account this will be "UNKNOWN"
     *
     */
    subscription_type: BillingSubscriptionType;
    /**
     * Last time when quota was reset. Defaults to current datetime when account is created.
     *
     * @format date-time
     */
    quota_reset_at_last: string;
    /**
     * Billing email, to receive emails related to invoices and subscriptions.
     *
     */
    email: string;
    /**
     * Billing address city.
     *
     */
    address_city: string;
    /**
     * Billing address country.
     *
     */
    address_country: string;
    /**
     * Billing address line 1.
     *
     */
    address_line1: string;
    /**
     * Billing address line 2.
     *
     */
    address_line2: string;
    /**
     * Billing address postal code.
     *
     */
    address_postal_code: string;
    /**
     * Billing address state or region.
     *
     */
    address_state: string;
}
/**
* Type of subscription to Neon Cloud.
Notice that for users without billing account this will be "UNKNOWN"
*/
export declare enum BillingSubscriptionType {
    UNKNOWN = "UNKNOWN",
    Free = "free",
    Pro = "pro",
    DirectSales = "direct_sales"
}
/**
 * @example {"id":834686,"branch_id":"br-wispy-meadow-118737","name":"cloudrockdb","owner_name":"casey","created_at":"2022-11-30T18:25:15Z","updated_at":"2022-11-30T18:25:15Z"}
 */
export interface Database {
    /**
     * The database ID
     *
     * @format int64
     */
    id: number;
    /**
     * The ID of the branch to which the database belongs
     *
     */
    branch_id: string;
    /**
     * The database name
     *
     */
    name: string;
    /**
     * The name of role that owns the database
     *
     */
    owner_name: string;
    /**
     * A timestamp indicating when the database was created
     *
     * @format date-time
     */
    created_at: string;
    /**
     * A timestamp indicating when the database was last updated
     *
     * @format date-time
     */
    updated_at: string;
}
export interface DatabaseCreateRequest {
    database: {
        name: string;
        owner_name: string;
    };
}
export interface DatabaseUpdateRequest {
    database: {
        name?: string;
        owner_name?: string;
    };
}
export interface DatabaseResponse {
    database: Database;
}
export interface DatabasesResponse {
    databases: Database[];
}
export interface ConsoleSettingsRaw {
    /** management */
    project_creation_forbidden?: boolean;
    proxy_host?: string;
}
export interface CurrentUserAuthAccount {
    email: string;
    image: string;
    login: string;
    name: string;
    provider: string;
}
export interface CurrentUserInfoResponse {
    billing_account: BillingAccount;
    auth_accounts: CurrentUserAuthAccount[];
    email: string;
    id: string;
    image: string;
    login: string;
    name: string;
    /** @format int64 */
    projects_limit: number;
    /** @format int64 */
    branches_limit: number;
    /** @format int64 */
    max_autoscaling_limit: number;
    /** @format int64 */
    compute_seconds_limit: number;
}
/**
 * A collection of settings for a compute endpoint
 */
export interface EndpointSettingsData {
    /** A raw representation of PostgreSQL settings */
    pg_settings?: PgSettingsData;
}
/**
* The consumption quota of a project.
After the quota has been exceeded, it is impossible to use the project until either:
* Neon cloud resets the calculated consumption,
* or the user increases quota for the project.
The Neon cloud resets the quota at the beginning of the billing period.

If the quota is not set, the project can use as many resources as needed.
*/
export interface ProjectSettingsQuota {
    /**
     * The total amount of CPU seconds allowed to be spent by a project's compute endpoints.
     *
     * @format int64
     * @min 1
     */
    cpu_quota_sec?: number;
}
/**
 * A collection of settings for a Neon project
 */
export interface ProjectSettingsData {
    /** A raw representation of PostgreSQL settings */
    pg_settings?: PgSettingsData;
}
/**
 * A raw representation of PostgreSQL settings
 */
export declare type PgSettingsData = Record<string, string>;
/**
 * The major PostgreSQL version number. Currently supported version are `14` and `15`.
 */
export declare type PgVersion = number;
/**
 * @example {"status":"ok"}
 */
export interface HealthCheck {
    /** Service status */
    status: string;
}
/**
 * General Error
 */
export interface GeneralError {
    code: ErrorCode;
    /** Error message */
    message: string;
}
export declare type ErrorCode = string;
export declare type ProjectOperations = ProjectResponse & OperationsResponse;
export declare type BranchOperations = BranchResponse & OperationsResponse;
export declare type EndpointOperations = EndpointResponse & OperationsResponse;
export declare type DatabaseOperations = DatabaseResponse & OperationsResponse;
export declare type RoleOperations = RoleResponse & OperationsResponse;
export interface ListUserAvailableApplicationsParams {
    /**
     * List applications available to given project.
     * If this parameter is present, OAuth applications are not listed.
     *
     */
    project_id?: string;
}
export interface ListProjectsParams {
    /** Specify the cursor value from the previous response to get the next batch of projects. */
    cursor?: string;
    /**
     * Specify a value from 1 to 100 to limit number of projects in the response.
     * @min 1
     * @max 100
     */
    limit?: number;
}
export interface ListProjectOperationsParams {
    /** Specify the cursor value from the previous response to get the next batch of operations */
    cursor?: string;
    /**
     * Specify a value from 1 to 1000 to limit number of operations in the response
     * @min 1
     * @max 1000
     */
    limit?: number;
    /** The Neon project ID */
    projectId: string;
}
export interface GetProjectQueryHistoryParams {
    /** @format int64 */
    database_id?: number;
    projectId: string;
}
export interface GetCurrentUserConsumptionParams {
    /**
     * Specify a value from 1 to 1000 to limit number of periods in the response.
     * @min 1
     * @max 1000
     */
    limit?: number;
}
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";
export declare type QueryParamsType = Record<string | number, any>;
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
export declare type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;
export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (securityData: SecurityDataType | null) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}
export declare enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded"
}
export declare class HttpClient<SecurityDataType = unknown> {
    instance: AxiosInstance;
    private securityData;
    private securityWorker?;
    private secure?;
    private format?;
    constructor({ securityWorker, secure, format, ...axiosConfig }?: ApiConfig<SecurityDataType>);
    setSecurityData: (data: SecurityDataType | null) => void;
    private mergeRequestParams;
    private createFormData;
    request: <T = any, _E = any>({ secure, path, type, query, format, body, ...params }: FullRequestParams) => Promise<AxiosResponse<T, any>>;
}
/**
 * @title Neon API
 * @version v2
 * @license Proprietary
 * @baseUrl https://console.cloudrock.ca/api/v2
 * @contact <support@cloudrock.ca>
 *
 * The Neon API allows you to access and manage Neon programmatically. You can use the Neon API to manage API keys, projects, branches, endpoints, databases, roles, and operations. For information about these features, refer to the [Neon documentation](https://cloudrock.ca/docs/manage/overview/).
 *
 * You can run Neon API requests from this API reference using the **Try it out** feature that is provided for each method. Click **Authorize** to enter an API key.
 *
 * You can create and manage API keys in the Neon Console. See [Manage API keys](https://cloudrock.ca/docs/manage/api-keys/) for instructions.
 */
export declare class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    /**
     * No description
     *
     * @tags Billing, Frontend
     * @name ListBillingInvoices
     * @request GET:/billing/invoices
     * @secure
     */
    listBillingInvoices: (params?: RequestParams) => Promise<AxiosResponse<InvoiceListResponse, any>>;
    /**
     * @description Get a list of oauth applications that user has given access to.
     *
     * @tags Frontend, Applications
     * @name ListUserAvailableApplications
     * @summary List applications that user has access to.
     * @request GET:/applications
     * @secure
     */
    listUserAvailableApplications: (query: ListUserAvailableApplicationsParams, params?: RequestParams) => Promise<AxiosResponse<ApplicationsListResponse, any>>;
    /**
     * @description Unlink all Neon branches of given project from multiple Vercel Projects. This does not delete the whole installation of Vercel integrations. If multiple integrations contain Branches of same Neon Project, all the Branches are unlinked.
     *
     * @tags Frontend, Applications
     * @name UnlinkProjectFromVercelIntegrations
     * @summary Unlink Vercel integration for given Neon Project.
     * @request DELETE:/projects/{project_id}/applications/vercel
     * @secure
     */
    unlinkProjectFromVercelIntegrations: (projectId: string, params?: RequestParams) => Promise<AxiosResponse<object, any>>;
    /**
     * @description Revoke user's granted consent session for given application. In case user has not granted consent to this client, a successful response is returned for idempotency reasons.
     *
     * @tags Frontend, Applications
     * @name RevokeOAuthConsent
     * @summary NOT IMPLEMENTED Revoke user's granted consent session.
     * @request DELETE:/applications/oauth/{client_id}
     * @secure
     */
    revokeOAuthConsent: (clientId: string, params?: RequestParams) => Promise<AxiosResponse<object, any>>;
    /**
     * @description Retrieves the API keys for your Neon account. The response does not include API key tokens. A token is only provided when creating an API key. API keys can also be managed in the Neon Console. For more information, see [Manage API keys](https://cloudrock.ca/docs/manage/api-keys/).
     *
     * @tags API Key
     * @name ListApiKeys
     * @summary Get a list of API keys
     * @request GET:/api_keys
     * @secure
     */
    listApiKeys: (params?: RequestParams) => Promise<AxiosResponse<ApiKeysListResponseItem[], any>>;
    /**
     * @description Creates an API key. The `key_name` is a user-specified name for the key. This method returns an `id` and `key`. The `key` is a randomly generated, 64-bit token required to access the Neon API. API keys can also be managed in the Neon Console. See [Manage API keys](https://cloudrock.ca/docs/manage/api-keys/).
     *
     * @tags API Key
     * @name CreateApiKey
     * @summary Create an API key
     * @request POST:/api_keys
     * @secure
     */
    createApiKey: (data: ApiKeyCreateRequest, params?: RequestParams) => Promise<AxiosResponse<ApiKeyCreateResponse, any>>;
    /**
     * @description Revokes the specified API key. An API key that is no longer needed can be revoked. This action cannot be reversed. You can obtain `key_id` values by listing the API keys for your Neon account. API keys can also be managed in the Neon Console. See [Manage API keys](https://cloudrock.ca/docs/manage/api-keys/).
     *
     * @tags API Key
     * @name RevokeApiKey
     * @summary Revoke an API key
     * @request DELETE:/api_keys/{key_id}
     * @secure
     */
    revokeApiKey: (keyId: number, params?: RequestParams) => Promise<AxiosResponse<ApiKeyRevokeResponse, any>>;
    /**
     * @description Retrieves details for the specified operation. An operation is an action performed on a Neon project resource. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain a `operation_id` by listing operations for the project.
     *
     * @tags Operation
     * @name GetProjectOperation
     * @summary Get operation details
     * @request GET:/projects/{project_id}/operations/{operation_id}
     * @secure
     */
    getProjectOperation: (projectId: string, operationId: string, params?: RequestParams) => Promise<AxiosResponse<OperationResponse, any>>;
    /**
     * @description Retrieves a list of projects for the Neon account. A project is the top-level object in the Neon object hierarchy. For more information, see [Manage projects](https://cloudrock.ca/docs/manage/projects/).
     *
     * @tags Project
     * @name ListProjects
     * @summary Get a list of projects
     * @request GET:/projects
     * @secure
     */
    listProjects: (query: ListProjectsParams, params?: RequestParams) => Promise<AxiosResponse<ProjectsResponse & PaginationResponse, any>>;
    /**
     * @description Creates a Neon project. A project is the top-level object in the Neon object hierarchy. Tier limits define how many projects you can create. Neon's Free Tier permits one project per Neon account. For more information, see [Manage projects](https://cloudrock.ca/docs/manage/projects/). You can specify a region and PostgreSQL version in the request body. Neon currently supports PostgreSQL 14 and 15. For supported regions and `region_id` values, see [Regions](https://cloudrock.ca/docs/introduction/regions/).
     *
     * @tags Project
     * @name CreateProject
     * @summary Create a project
     * @request POST:/projects
     * @secure
     */
    createProject: (data: ProjectCreateRequest, params?: RequestParams) => Promise<AxiosResponse<ProjectResponse & ConnectionURIsResponse & RolesResponse & DatabasesResponse & OperationsResponse & BranchResponse & EndpointsResponse, any>>;
    /**
     * @description Retrieves information about the specified project. A project is the top-level object in the Neon object hierarchy. You can obtain a `project_id` by listing the projects for your Neon account.
     *
     * @tags Project
     * @name GetProject
     * @summary Get project details
     * @request GET:/projects/{project_id}
     * @secure
     */
    getProject: (projectId: string, params?: RequestParams) => Promise<AxiosResponse<ProjectResponse, any>>;
    /**
     * @description Updates the specified project. You can obtain a `project_id` by listing the projects for your Neon account. Neon permits updating the project name only.
     *
     * @tags Project
     * @name UpdateProject
     * @summary Update a project
     * @request PATCH:/projects/{project_id}
     * @secure
     */
    updateProject: (projectId: string, data: ProjectUpdateRequest, params?: RequestParams) => Promise<AxiosResponse<ProjectOperations, any>>;
    /**
     * @description Deletes the specified project. You can obtain a `project_id` by listing the projects for your Neon account. Deleting a project is a permanent action. Deleting a project also deletes endpoints, branches, databases, and users that belong to the project.
     *
     * @tags Project
     * @name DeleteProject
     * @summary Delete a project
     * @request DELETE:/projects/{project_id}
     * @secure
     */
    deleteProject: (projectId: string, params?: RequestParams) => Promise<AxiosResponse<ProjectResponse, any>>;
    /**
     * @description Retrieves a list of operations for the specified Neon project. You can obtain a `project_id` by listing the projects for your Neon account. The number of operations returned can be large. To paginate the response, issue an initial request with a `limit` value. Then, add the `cursor` value that was returned in the response to the next request.
     *
     * @tags Operation
     * @name ListProjectOperations
     * @summary Get a list of operations
     * @request GET:/projects/{project_id}/operations
     * @secure
     */
    listProjectOperations: ({ projectId, ...query }: ListProjectOperationsParams, params?: RequestParams) => Promise<AxiosResponse<OperationsResponse & PaginationResponse, any>>;
    /**
     * @description Runs a query on the specified project endpoint or branch. Either the branch_id or endpoint_id should be passed in the request body.
     *
     * @tags Query, Frontend
     * @name RunProjectQuery
     * @summary Run a query
     * @request POST:/projects/{project_id}/query
     * @secure
     */
    runProjectQuery: (projectId: string, data: QueryRequest, params?: RequestParams) => Promise<AxiosResponse<QueryResponse, any>>;
    /**
     * @description Returns an array of saved queries for the specified project
     *
     * @tags Query, Frontend
     * @name ListProjectSavedQueries
     * @summary Get saved queries
     * @request GET:/projects/{project_id}/saved_queries
     * @secure
     */
    listProjectSavedQueries: (projectId: string, params?: RequestParams) => Promise<AxiosResponse<SavedQuery[], any>>;
    /**
     * @description Creates a new saved query record
     *
     * @tags Query, Frontend
     * @name CreateSavedQuery
     * @summary Create a saved query record
     * @request POST:/projects/{project_id}/saved_queries
     * @secure
     */
    createSavedQuery: (projectId: string, data: SavedQueryCreateRequest, params?: RequestParams) => Promise<AxiosResponse<SavedQuery, any>>;
    /**
     * @description Return project's permissions
     *
     * @tags Project, Permissions, Frontend
     * @name ListProjectPermissions
     * @summary Return project's permissions
     * @request GET:/projects/{project_id}/permissions
     * @secure
     */
    listProjectPermissions: (projectId: string, params?: RequestParams) => Promise<AxiosResponse<ProjectPermissions, any>>;
    /**
     * @description Grant project permission to the user
     *
     * @tags Project, Permissions, Frontend
     * @name GrantPermissionToProject
     * @summary Grant project permission to the user
     * @request POST:/projects/{project_id}/permissions
     * @secure
     */
    grantPermissionToProject: (projectId: string, data: GrantPermissionToProjectRequest, params?: RequestParams) => Promise<AxiosResponse<ProjectPermission, any>>;
    /**
     * @description Revoke permission from the user
     *
     * @tags Project, Permissions, Frontend
     * @name RevokePermissionFromProject
     * @summary Revoke permission from the user
     * @request DELETE:/projects/{project_id}/permissions/{permission_id}
     * @secure
     */
    revokePermissionFromProject: (projectId: string, permissionId: string, params?: RequestParams) => Promise<AxiosResponse<ProjectPermission, any>>;
    /**
     * @description Updates the specified saved query record
     *
     * @tags Query, Frontend
     * @name UpdateProjectSavedQuery
     * @summary Updated a saved query record
     * @request PATCH:/saved_queries/{saved_query_id}
     * @secure
     */
    updateProjectSavedQuery: (savedQueryId: number, data: SavedQueryUpdateRequest, params?: RequestParams) => Promise<AxiosResponse<SavedQuery, any>>;
    /**
     * @description Deletes the specified saved query record
     *
     * @tags Query, Frontend
     * @name DeleteSavedQuery
     * @summary Delete a saved query record
     * @request DELETE:/saved_queries/{saved_query_id}
     * @secure
     */
    deleteSavedQuery: (savedQueryId: number, params?: RequestParams) => Promise<AxiosResponse<SavedQuery, any>>;
    /**
     * @description Retrieves the query history for the specified project
     *
     * @tags Query, Frontend
     * @name GetProjectQueryHistory
     * @summary Get the project query history
     * @request GET:/projects/{project_id}/query/history
     * @secure
     */
    getProjectQueryHistory: ({ projectId, ...query }: GetProjectQueryHistoryParams, params?: RequestParams) => Promise<AxiosResponse<QueryHistoryResponse, any>>;
    /**
     * @description Creates a branch in the specified project. You can obtain a `project_id` by listing the projects for your Neon account. This method does not require a request body, but you can specify one to create an endpoint for the branch or to select a non-default parent branch. The default behavior is to create a branch from the project's root branch (`main`) with no endpoint, and the branch name is auto-generated. For related information, see [Manage branches](https://cloudrock.ca/docs/manage/branches/).
     *
     * @tags Branch
     * @name CreateProjectBranch
     * @summary Create a branch
     * @request POST:/projects/{project_id}/branches
     * @secure
     */
    createProjectBranch: (projectId: string, data?: BranchCreateRequest, params?: RequestParams) => Promise<AxiosResponse<BranchResponse & EndpointsResponse & OperationsResponse & ConnectionURIsOptionalResponse, any>>;
    /**
     * @description Retrieves a list of branches for the specified project. You can obtain a `project_id` by listing the projects for your Neon account. Each Neon project has a root branch named `main`. A `branch_id` value has a `br-` prefix. A project may contain child branches that were branched from `main` or from another branch. A parent branch is identified by the `parent_id` value, which is the `id` of the parent branch. For related information, see [Manage branches](https://cloudrock.ca/docs/manage/branches/).
     *
     * @tags Branch
     * @name ListProjectBranches
     * @summary Get a list of branches
     * @request GET:/projects/{project_id}/branches
     * @secure
     */
    listProjectBranches: (projectId: string, params?: RequestParams) => Promise<AxiosResponse<BranchesResponse, any>>;
    /**
     * @description Retrieves information about the specified branch. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain a `branch_id` by listing the project's branches. A `branch_id` value has a `br-` prefix. Each Neon project has a root branch named `main`. A project may contain child branches that were branched from `main` or from another branch. A parent branch is identified by a `parent_id` value, which is the `id` of the parent branch. For related information, see [Manage branches](https://cloudrock.ca/docs/manage/branches/).
     *
     * @tags Branch
     * @name GetProjectBranch
     * @summary Get branch details
     * @request GET:/projects/{project_id}/branches/{branch_id}
     * @secure
     */
    getProjectBranch: (projectId: string, branchId: string, params?: RequestParams) => Promise<AxiosResponse<BranchResponse, any>>;
    /**
     * @description Deletes the specified branch from a project, and places all endpoints into an idle state, breaking existing client connections. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain a `branch_id` by listing the project's branches. For related information, see [Manage branches](https://cloudrock.ca/docs/manage/branches/). When a successful response status is received, the endpoints are still active, and the branch is not yet deleted from storage. The deletion occurs after all operations finish. You cannot delete a branch if it is the only remaining branch in the project. A project must have at least one branch.
     *
     * @tags Branch
     * @name DeleteProjectBranch
     * @summary Delete a branch
     * @request DELETE:/projects/{project_id}/branches/{branch_id}
     * @secure
     */
    deleteProjectBranch: (projectId: string, branchId: string, params?: RequestParams) => Promise<AxiosResponse<BranchOperations, any>>;
    /**
     * @description Updates the specified branch. Only changing the branch name is supported. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. For more information, see [Manage branches](https://cloudrock.ca/docs/manage/branches/).
     *
     * @tags Branch
     * @name UpdateProjectBranch
     * @summary Update a branch
     * @request PATCH:/projects/{project_id}/branches/{branch_id}
     * @secure
     */
    updateProjectBranch: (projectId: string, branchId: string, data: BranchUpdateRequest, params?: RequestParams) => Promise<AxiosResponse<BranchOperations, any>>;
    /**
     * @description The primary mark is automatically removed from the previous primary branch. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. For more information, see [Manage branches](https://cloudrock.ca/docs/manage/branches/).
     *
     * @tags Branch
     * @name SetPrimaryProjectBranch
     * @summary Set the branch as the primary branch of a project
     * @request POST:/projects/{project_id}/branches/{branch_id}/set_as_primary
     * @secure
     */
    setPrimaryProjectBranch: (projectId: string, branchId: string, params?: RequestParams) => Promise<AxiosResponse<BranchOperations, any>>;
    /**
     * @description Retrieves a list of endpoints for the specified branch. Currently, Neon permits only one endpoint per branch. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches.
     *
     * @tags Branch
     * @name ListProjectBranchEndpoints
     * @summary Get a list of branch endpoints
     * @request GET:/projects/{project_id}/branches/{branch_id}/endpoints
     * @secure
     */
    listProjectBranchEndpoints: (projectId: string, branchId: string, params?: RequestParams) => Promise<AxiosResponse<EndpointsResponse, any>>;
    /**
     * @description Retrieves a list of databases for the specified branch. A branch can have multiple databases. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. For related information, see [Manage databases](https://cloudrock.ca/docs/manage/databases/).
     *
     * @tags Branch
     * @name ListProjectBranchDatabases
     * @summary Get a list of databases
     * @request GET:/projects/{project_id}/branches/{branch_id}/databases
     * @secure
     */
    listProjectBranchDatabases: (projectId: string, branchId: string, params?: RequestParams) => Promise<AxiosResponse<DatabasesResponse, any>>;
    /**
     * @description Creates a database in the specified branch. A branch can have multiple databases. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. For related information, see [Manage databases](https://cloudrock.ca/docs/manage/databases/).
     *
     * @tags Branch
     * @name CreateProjectBranchDatabase
     * @summary Create a database
     * @request POST:/projects/{project_id}/branches/{branch_id}/databases
     * @secure
     */
    createProjectBranchDatabase: (projectId: string, branchId: string, data: DatabaseCreateRequest, params?: RequestParams) => Promise<AxiosResponse<DatabaseOperations, any>>;
    /**
     * @description Retrieves information about the specified database. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` and `database_name` by listing branch's databases. For related information, see [Manage databases](https://cloudrock.ca/docs/manage/databases/).
     *
     * @tags Branch
     * @name GetProjectBranchDatabase
     * @summary Get database details
     * @request GET:/projects/{project_id}/branches/{branch_id}/databases/{database_name}
     * @secure
     */
    getProjectBranchDatabase: (projectId: string, branchId: string, databaseName: string, params?: RequestParams) => Promise<AxiosResponse<DatabaseResponse, any>>;
    /**
     * @description Updates the specified database in the branch. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` and `database_name` by listing the branch's databases. For related information, see [Manage databases](https://cloudrock.ca/docs/manage/databases/).
     *
     * @tags Branch
     * @name UpdateProjectBranchDatabase
     * @summary Update a database
     * @request PATCH:/projects/{project_id}/branches/{branch_id}/databases/{database_name}
     * @secure
     */
    updateProjectBranchDatabase: (projectId: string, branchId: string, databaseName: string, data: DatabaseUpdateRequest, params?: RequestParams) => Promise<AxiosResponse<DatabaseOperations, any>>;
    /**
     * @description Deletes the specified database from the branch. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` and `database_name` by listing branch's databases. For related information, see [Manage databases](https://cloudrock.ca/docs/manage/databases/).
     *
     * @tags Branch
     * @name DeleteProjectBranchDatabase
     * @summary Delete a database
     * @request DELETE:/projects/{project_id}/branches/{branch_id}/databases/{database_name}
     * @secure
     */
    deleteProjectBranchDatabase: (projectId: string, branchId: string, databaseName: string, params?: RequestParams) => Promise<AxiosResponse<DatabaseOperations, any>>;
    /**
     * @description Retrieves a list of roles from the specified branch. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. In Neon, the terms "role" and "user" are synonymous. For related information, see [Manage users](https://cloudrock.ca/docs/manage/users/).
     *
     * @tags Branch
     * @name ListProjectBranchRoles
     * @summary Get a list of roles
     * @request GET:/projects/{project_id}/branches/{branch_id}/roles
     * @secure
     */
    listProjectBranchRoles: (projectId: string, branchId: string, params?: RequestParams) => Promise<AxiosResponse<RolesResponse, any>>;
    /**
     * @description Creates a role in the specified branch. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. In Neon, the terms "role" and "user" are synonymous. For related information, see [Manage users](https://cloudrock.ca/docs/manage/users/). Connections established to the active read-write endpoint will be dropped. If the read-write endpoint is idle, the endpoint becomes active for a short period of time and is suspended afterward.
     *
     * @tags Branch
     * @name CreateProjectBranchRole
     * @summary Create a role
     * @request POST:/projects/{project_id}/branches/{branch_id}/roles
     * @secure
     */
    createProjectBranchRole: (projectId: string, branchId: string, data: RoleCreateRequest, params?: RequestParams) => Promise<AxiosResponse<RoleOperations, any>>;
    /**
     * @description Retrieves details about the specified role. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. You can obtain the `role_name` by listing the roles for a branch. In Neon, the terms "role" and "user" are synonymous. For related information, see [Managing users](https://cloudrock.ca/docs/manage/users/).
     *
     * @tags Branch
     * @name GetProjectBranchRole
     * @summary Get role details
     * @request GET:/projects/{project_id}/branches/{branch_id}/roles/{role_name}
     * @secure
     */
    getProjectBranchRole: (projectId: string, branchId: string, roleName: string, params?: RequestParams) => Promise<AxiosResponse<RoleResponse, any>>;
    /**
     * @description Deletes the specified role from the branch. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. You can obtain the `role_name` by listing the roles for a branch. In Neon, the terms "role" and "user" are synonymous. For related information, see [Managing users](https://cloudrock.ca/docs/manage/users/).
     *
     * @tags Branch
     * @name DeleteProjectBranchRole
     * @summary Delete a role
     * @request DELETE:/projects/{project_id}/branches/{branch_id}/roles/{role_name}
     * @secure
     */
    deleteProjectBranchRole: (projectId: string, branchId: string, roleName: string, params?: RequestParams) => Promise<AxiosResponse<RoleOperations, any>>;
    /**
     * @description Retrieves password of the specified role if possible. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. You can obtain the `role_name` by listing the roles for a branch. In Neon, the terms "role" and "user" are synonymous. For related information, see [Managing users](https://cloudrock.ca/docs/manage/users/).
     *
     * @tags Branch
     * @name GetProjectBranchRolePassword
     * @summary Get role password
     * @request GET:/projects/{project_id}/branches/{branch_id}/roles/{role_name}/reveal_password
     * @secure
     */
    getProjectBranchRolePassword: (projectId: string, branchId: string, roleName: string, params?: RequestParams) => Promise<AxiosResponse<RolePasswordResponse, any>>;
    /**
     * @description Resets the password for the specified role. Returns a new password and operations. The new password is ready to use when the last operation finishes. The old password remains valid until last operation finishes. Connections to the read-write endpoint are dropped. If idle, the read-write endpoint becomes active for a short period of time. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain the `branch_id` by listing the project's branches. You can obtain the `role_name` by listing the roles for a branch. In Neon, the terms "role" and "user" are synonymous. For related information, see [Managing users](https://cloudrock.ca/docs/manage/users/).
     *
     * @tags Branch
     * @name ResetProjectBranchRolePassword
     * @summary Reset the role password
     * @request POST:/projects/{project_id}/branches/{branch_id}/roles/{role_name}/reset_password
     * @secure
     */
    resetProjectBranchRolePassword: (projectId: string, branchId: string, roleName: string, params?: RequestParams) => Promise<AxiosResponse<RoleOperations, any>>;
    /**
     * @description Creates an endpoint for the specified branch. An endpoint is a Neon compute instance. There is a maximum of one endpoint per branch. If the specified branch already has an endpoint, the operation fails. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain `branch_id` by listing the project's branches. A `branch_id` has a `br-` prefix. Currently, only the `read_write` endpoint type is supported. For supported regions and `region_id` values, see [Regions](https://cloudrock.ca/docs/introduction/regions/). For more information about endpoints, see [Manage endpoints](https://cloudrock.ca/docs/manage/endpoints/).
     *
     * @tags Endpoint
     * @name CreateProjectEndpoint
     * @summary Create an endpoint
     * @request POST:/projects/{project_id}/endpoints
     * @secure
     */
    createProjectEndpoint: (projectId: string, data: EndpointCreateRequest, params?: RequestParams) => Promise<AxiosResponse<EndpointOperations, any>>;
    /**
     * @description Retrieves a list of endpoints for the specified project. An endpoint is a Neon compute instance. You can obtain a `project_id` by listing the projects for your Neon account. For more information about endpoints, see [Manage endpoints](https://cloudrock.ca/docs/manage/endpoints/).
     *
     * @tags Endpoint
     * @name ListProjectEndpoints
     * @summary Get a list of endpoints
     * @request GET:/projects/{project_id}/endpoints
     * @secure
     */
    listProjectEndpoints: (projectId: string, params?: RequestParams) => Promise<AxiosResponse<EndpointsResponse, any>>;
    /**
     * @description Retrieves information about the specified endpoint. An endpoint is a Neon compute instance. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain an `endpoint_id` by listing your project's endpoints. An `endpoint_id` has an `ep-` prefix. For more information about endpoints, see [Manage endpoints](https://cloudrock.ca/docs/manage/endpoints/).
     *
     * @tags Endpoint
     * @name GetProjectEndpoint
     * @summary Get an endpoint
     * @request GET:/projects/{project_id}/endpoints/{endpoint_id}
     * @secure
     */
    getProjectEndpoint: (projectId: string, endpointId: string, params?: RequestParams) => Promise<AxiosResponse<EndpointResponse, any>>;
    /**
     * @description Delete the specified endpoint. An endpoint is a Neon compute instance. Deleting an endpoint drops existing network connections to the endpoint. The deletion is completed when last operation in the chain finishes successfully. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain an `endpoint_id` by listing your project's endpoints. An `endpoint_id` has an `ep-` prefix. For more information about endpoints, see [Manage endpoints](https://cloudrock.ca/docs/manage/endpoints/).
     *
     * @tags Endpoint
     * @name DeleteProjectEndpoint
     * @summary Delete an endpoint
     * @request DELETE:/projects/{project_id}/endpoints/{endpoint_id}
     * @secure
     */
    deleteProjectEndpoint: (projectId: string, endpointId: string, params?: RequestParams) => Promise<AxiosResponse<EndpointOperations, any>>;
    /**
     * @description Updates the specified endpoint. Currently, only changing the associated branch is supported. The branch that you specify cannot have an existing endpoint. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain an `endpoint_id` and `branch_id` by listing your project's endpoints. An `endpoint_id` has an `ep-` prefix. A `branch_id` has a `br-` prefix. For more information about endpoints, see [Manage endpoints](https://cloudrock.ca/docs/manage/endpoints/). If the returned list of operations is not empty, the endpoint is not ready to use. The client must wait for the last operation to finish before using the endpoint. If the endpoint was idle before the update, the endpoint becomes active for a short period of time, and the control plane suspends it again after the update.
     *
     * @tags Endpoint
     * @name UpdateProjectEndpoint
     * @summary Update an endpoint
     * @request PATCH:/projects/{project_id}/endpoints/{endpoint_id}
     * @secure
     */
    updateProjectEndpoint: (projectId: string, endpointId: string, data: EndpointUpdateRequest, params?: RequestParams) => Promise<AxiosResponse<EndpointOperations, any>>;
    /**
     * @description Starts an endpoint. The endpoint is ready to use after the last operation in chain finishes successfully. You can obtain a `project_id` by listing the projects for your Neon account. You can obtain an `endpoint_id` by listing your project's endpoints. An `endpoint_id` has an `ep-` prefix. For more information about endpoints, see [Manage endpoints](https://cloudrock.ca/docs/manage/endpoints/).
     *
     * @tags Endpoint
     * @name StartProjectEndpoint
     * @summary Start an endpoint
     * @request POST:/projects/{project_id}/endpoints/{endpoint_id}/start
     * @secure
     */
    startProjectEndpoint: (projectId: string, endpointId: string, params?: RequestParams) => Promise<AxiosResponse<EndpointOperations, any>>;
    /**
     * @description Suspend the specified endpoint You can obtain a `project_id` by listing the projects for your Neon account. You can obtain an `endpoint_id` by listing your project's endpoints. An `endpoint_id` has an `ep-` prefix. For more information about endpoints, see [Manage endpoints](https://cloudrock.ca/docs/manage/endpoints/).
     *
     * @tags Endpoint
     * @name SuspendProjectEndpoint
     * @summary Suspend an endpoint
     * @request POST:/projects/{project_id}/endpoints/{endpoint_id}/suspend
     * @secure
     */
    suspendProjectEndpoint: (projectId: string, endpointId: string, params?: RequestParams) => Promise<AxiosResponse<EndpointOperations, any>>;
    /**
     * @description Authenticates a passwordless connection session for the specified endpoint
     *
     * @tags Endpoint, Frontend
     * @name AuthProjectEndpointPasswordlessSession
     * @summary Authenticate a passwordless connection
     * @request POST:/projects/{project_id}/endpoints/{endpoint_id}/passwordless_auth
     * @secure
     */
    authProjectEndpointPasswordlessSession: (projectId: string, endpointId: string, data: EndpointPasswordlessSessionAuthRequest, params?: RequestParams) => Promise<AxiosResponse<void, any>>;
    /**
     * @description Retrieves information about the current user
     *
     * @tags Users, Frontend
     * @name GetCurrentUserInfo
     * @summary Get current user details
     * @request GET:/users/me
     * @secure
     */
    getCurrentUserInfo: (params?: RequestParams) => Promise<AxiosResponse<CurrentUserInfoResponse, any>>;
    /**
     * @description Retrieves latest consumption history periods for given user.
     *
     * @tags Users, Frontend
     * @name GetCurrentUserConsumption
     * @summary Get consumption history data for current user
     * @request GET:/users/me/consumption
     * @secure
     */
    getCurrentUserConsumption: (query: GetCurrentUserConsumptionParams, params?: RequestParams) => Promise<AxiosResponse<ConsumptionHistoryPeriodResponse, any>>;
    /**
     * @description Retrieves information about the service health
     *
     * @tags Service
     * @name HealthCheck
     * @summary Get service health
     * @request GET:/healthz
     * @secure
     */
    healthCheck: (params?: RequestParams) => Promise<AxiosResponse<HealthCheck, any>>;
}
