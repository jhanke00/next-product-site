/**
 * Enhanced Learning Resources Type Definitions
 * Building upon the basic implementation with comprehensive typing
 */

// Base types for learning resources
export type ResourceType = 'video' | 'pdf' | 'article' | 'quiz' | 'interactive' | 'webinar' | 'course';
export type ResourceCategory = 'tutorial' | 'guide' | 'training' | 'documentation' | 'reference' | 'certification';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ResourceStatus = 'draft' | 'published' | 'archived' | 'under_review';

// Enhanced Learning Resource interface
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  difficulty: DifficultyLevel;
  status: ResourceStatus;

  // Content and media
  content?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // in minutes
  fileSize?: number; // in bytes

  // Metadata
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  version: string;

  // Learning objectives and prerequisites
  learningObjectives: string[];
  prerequisites: string[];

  // Analytics and engagement
  viewCount: number;
  completionCount: number;
  averageRating: number;
  reviewCount: number;

  // SEO and accessibility
  seoTitle?: string;
  seoDescription?: string;
  altText?: string;
  transcriptUrl?: string;
}

// User progress tracking
export interface UserProgress {
  userId: string;
  resourceId: string;
  productId?: string;

  // Progress tracking
  status: 'not_started' | 'in_progress' | 'completed' | 'bookmarked';
  progressPercentage: number;
  timeSpent: number; // in minutes
  lastAccessedAt: string;
  completedAt?: string;

  // User interaction
  rating?: number;
  review?: string;
  notes?: string;
  bookmarked: boolean;

  // Learning path context
  isPartOfLearningPath?: boolean;
  learningPathId?: string;
  orderInPath?: number;
}

// Enhanced Product-Resource Assignment
export interface ProductResourceAssignment {
  id: string;
  productId: string;
  resourceId: string;

  // Assignment metadata
  isRequired: boolean;
  orderIndex: number;
  customDescription?: string;
  estimatedCompletionTime?: number;

  // Conditional access
  prerequisites?: string[]; // Other resource IDs that must be completed first
  availableFrom?: string;
  availableUntil?: string;

  // Assignment tracking
  assignedBy: string;
  assignedAt: string;
  updatedAt: string;
}

// Learning Path for structured learning
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  difficulty: DifficultyLevel;

  // Path structure
  resourceIds: string[];
  estimatedDuration: number; // total minutes

  // Requirements
  prerequisites: string[];

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;

  // Analytics
  enrollmentCount: number;
  completionRate: number;
}

// User Learning Profile
export interface UserLearningProfile {
  userId: string;

  // Preferences
  preferredLanguage: string;
  preferredDifficulty: DifficultyLevel[];
  interests: ResourceCategory[];
  learningGoals: string[];

  // Progress overview
  totalResourcesCompleted: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;

  // Achievements
  certificates: Certificate[];
  badges: Badge[];

  // Settings
  emailNotifications: boolean;
  progressReminders: boolean;

  // Created and updated timestamps
  createdAt: string;
  updatedAt: string;
}

// Certificate system
export interface Certificate {
  id: string;
  userId: string;
  resourceId?: string;
  learningPathId?: string;

  title: string;
  description: string;
  issuedAt: string;
  expiresAt?: string;

  // Verification
  certificateHash: string;
  isVerified: boolean;
}

// Gamification badges
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: 'completion' | 'streak' | 'engagement' | 'expertise';

  // Requirements
  requirements: {
    type: 'resources_completed' | 'streak_days' | 'category_mastery' | 'time_spent';
    value: number;
    category?: ResourceCategory;
  };

  earnedAt: string;
}

// Search and filtering
export interface ResourceSearchFilters {
  query?: string;
  types?: ResourceType[];
  categories?: ResourceCategory[];
  difficulties?: DifficultyLevel[];
  tags?: string[];

  // Progress filters
  completionStatus?: ('not_started' | 'in_progress' | 'completed')[];

  // Sorting
  sortBy?: 'title' | 'createdAt' | 'rating' | 'duration' | 'popularity';
  sortOrder?: 'asc' | 'desc';

  // Pagination
  page?: number;
  limit?: number;
}

// API Response types
export interface ResourceSearchResponse {
  resources: LearningResource[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Analytics and reporting
export interface LearningAnalytics {
  // Resource analytics
  topPerformingResources: Array<{
    resource: LearningResource;
    completionRate: number;
    averageRating: number;
    totalViews: number;
  }>;

  // User engagement
  totalUsers: number;
  activeUsers: number;
  avgSessionTime: number;

  // Content performance
  resourcesByCategory: Record<ResourceCategory, number>;
  completionRateByDifficulty: Record<DifficultyLevel, number>;

  // Trends
  weeklyProgress: Array<{
    week: string;
    completions: number;
    newUsers: number;
    totalTimeSpent: number;
  }>;
}

// Error handling
export interface LearningResourceError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// API Request/Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: LearningResourceError;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
