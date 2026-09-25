import { useLayoutEffect, useRef } from 'react';
import type { PageAnalysisRun } from '../../../server/domain/run-contract.ts';
import type { ComparisonAvailability } from '../../comparison/comparison-request.ts';

type CompleteRun = Extract<PageAnalysisRun, { status: 'completed' }>;

export function useResultsFocus(
  complete: CompleteRun | null,
  preview: boolean,
  comparisonAvailability: ComparisonAvailability,
  isPreviewing: () => boolean,
) {
  const savedFocus = useRef<string | null>(null);
  const currentReviewForm = useRef<{ findingId: string; element: HTMLFormElement } | null>(null);
  const resultsContent = useRef<HTMLDivElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const moveResultsFocus = useRef(false);
  const comparisonFocus = useRef<Element | null>(null);

  useLayoutEffect(() => {
    const removedFocus = comparisonFocus.current;
    comparisonFocus.current = null;
    if (moveResultsFocus.current || (removedFocus && !removedFocus.isConnected)) {
      resultsHeading.current?.focus();
    }
    moveResultsFocus.current = false;
  }, [complete, preview, comparisonAvailability]);

  function captureComparisonRemovalFocus(): void {
    // Restore only focus whose actual DOM owner disappears in this update.
    const focused = document.activeElement;
    comparisonFocus.current = resultsContent.current?.contains(focused) ? focused : null;
  }

  function captureReplacementFocus(): void {
    moveResultsFocus.current = !!resultsContent.current?.contains(document.activeElement);
  }

  function requestResultsFocus(): void {
    moveResultsFocus.current = true;
  }

  function attachReviewForm(findingId: string, element: HTMLFormElement): () => void {
    currentReviewForm.current = { findingId, element };
    return () => {
      if (currentReviewForm.current?.element === element) currentReviewForm.current = null;
    };
  }

  function captureSavedReviewFocus(findingId: string): void {
    const currentForm = currentReviewForm.current;
    savedFocus.current = currentForm?.findingId === findingId
      && currentForm.element.contains(document.activeElement) ? findingId : null;
  }

  function clearSavedFocus(): void {
    savedFocus.current = null;
  }

  function resetReviewFocus(): void {
    currentReviewForm.current = null;
    savedFocus.current = null;
  }

  function takeSavedFocus(findingId: string): boolean {
    if (isPreviewing()) return false;
    const take = !moveResultsFocus.current && savedFocus.current === findingId;
    savedFocus.current = null;
    return take;
  }

  return { resultsContent, resultsHeading, captureComparisonRemovalFocus, captureReplacementFocus,
    requestResultsFocus, attachReviewForm, captureSavedReviewFocus, clearSavedFocus, resetReviewFocus, takeSavedFocus };
}
