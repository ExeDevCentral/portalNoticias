export interface CableItem {
	id: string;
	source: string;
	category: string;
	originalTitle: string;
	originalSummary: string;
	sourceUrl: string;
	publishedAt: string;
	imageUrl: string;
	ironicReview?: string;
	warningTag?: string;
	originalIntact?: boolean;
}
