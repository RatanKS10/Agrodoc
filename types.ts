
export interface RecommendedProduct {
  name: string;
  brandName: string;
  brandLogoUrl?: string;
  productImageUrl?: string;
  type: 'Organic' | 'Chemical' | 'Biological';
  reason: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface DiagnosisResult {
  diseaseName: string;
  isHealthy: boolean;
  scientificName?: string;
  confidence: string;
  summary: string;
  symptoms: string[];
  treatmentSteps: string[];
  preventiveMeasures: string[];
  recommendedProducts: RecommendedProduct[];
  sources?: GroundingSource[];
}

export interface AppState {
  image: string | null;
  loading: boolean;
  result: DiagnosisResult | null;
  error: string | null;
}