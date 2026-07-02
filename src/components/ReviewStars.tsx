import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface ReviewStarsProps {
  rating: number;
  size?: number;
  showText?: boolean;
  reviewsCount?: number;
}

export default function ReviewStars({ rating, size = 16, showText = false, reviewsCount }: ReviewStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-400">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="currentColor" />
        ))}
        {hasHalfStar && <StarHalf size={size} fill="currentColor" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-200" />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-gray-500 ml-1">
          {rating.toFixed(1)} {reviewsCount !== undefined && `(${reviewsCount} avaliações)`}
        </span>
      )}
    </div>
  );
}
