import { useMutation } from '@tanstack/react-query';
import {
  reviewResumeFile,
} from '../resumeReview';

// Mutation hooks
export const useReviewResumeFile = () => {
  return useMutation({
    mutationFn: reviewResumeFile,
  });
};
