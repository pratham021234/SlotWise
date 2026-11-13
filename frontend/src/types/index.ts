export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    code: string;
    message: string;
    validationErrors?: Array<{
      field: string;
      rejectedValue: unknown;
      message: string;
    }>;
  };
  timestamp: string;
}

export interface HealthResponse {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  application: string;
  version: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  components: {
    database: {
      status: 'UP' | 'DOWN';
      database?: string;
      version?: string;
      error?: string;
    };
    [key: string]: unknown;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  subscriptionPlan: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'PLATFORM_ADMIN' | 'BUSINESS_OWNER' | 'BUSINESS_MANAGER' | 'STAFF' | 'CUSTOMER';
  tenantId?: string;
}

