export interface CableItem {
	id: string;
	source: string;
	category: string;
	region?: 'eeuu' | 'europa' | 'asia' | 'rusia' | 'argentina';
	originalTitle: string;
	originalSummary: string;
	sourceUrl: string;
	publishedAt: string;
	imageUrl: string;
	ironicReview?: string;
	warningTag?: string;
	originalIntact?: boolean;
}
