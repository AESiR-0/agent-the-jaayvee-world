// Main schema file - imports and exports all models from organized files
export * from './models'

// Import complete relations
export * from './models/relations'

// Re-export everything for backward compatibility
export {
// Enums
  userRoleEnum,
  ticketStatusEnum,
  paymentStatusEnum,
  invoiceStatusEnum,
  
  // User & RBAC
  users,
  roles,
  permissions,
  rolePermissions,
  
  // Ventures
  ventures,
  
  // Events & Tickets
  events,
  ticketTypes,
  priceTiers,
  tickets,
  
  // Payments & Wallets
  wallets,
  transactions,
  invoices,
  payments,
  
  // Subscriptions
  subscriptionPlans,
  subscriptions,
  
  // Audit
  auditLogs,
  
  // Timer
  timerOffers,
  timerSessions,
} from './models'