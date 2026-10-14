"use client";

import type { ButtonHTMLAttributes } from "react";

type PaginationDotsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  pageHrefs?: string[];
  previousHref?: string;
  nextHref?: string;
  showSinglePage?: boolean;
  className?: string;
  arrowButtonClassName?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  disabledArrowClassName?: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

export function PaginationDots({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
  pageHrefs,
  previousHref,
  nextHref,
  showSinglePage = true,
  className = "-mt-1 flex w-fit items-center justify-center gap-2 pt-0",
  arrowButtonClassName = "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-[0_6px_18px_rgba(15,23,42,0.08)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-800/90 dark:shadow-[0_6px_18px_rgba(15,23,42,0.38)]",
  dotClassName = "h-2.5 w-2.5 rounded-full bg-slate-300/80 transition-all duration-200 hover:bg-slate-400 dark:bg-slate-600/80 dark:hover:bg-slate-500",
  activeDotClassName = "h-2.5 w-4 rounded-full bg-slate-900 shadow-sm dark:bg-white",
  disabledArrowClassName = "pointer-events-none cursor-not-allowed opacity-40",
}: PaginationDotsProps) {
  const normalizedTotalPages = Math.max(1, totalPages);
  const prevDisabled = currentPage <= 0;
  const nextDisabled = currentPage >= normalizedTotalPages - 1;
  const maxVisibleDots = 10;

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
      return;
    }

    if (!prevDisabled && onPageChange) {
      onPageChange(Math.max(0, currentPage - 1));
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
      return;
    }

    if (!nextDisabled && onPageChange) {
      onPageChange(Math.min(normalizedTotalPages - 1, currentPage + 1));
    }
  };

  const shouldRenderDots = showSinglePage || normalizedTotalPages > 1;

  const getVisiblePageIndices = () => {
    if (normalizedTotalPages <= maxVisibleDots) {
      return Array.from({ length: normalizedTotalPages }, (_, index) => index);
    }

    const start = Math.max(0, Math.min(currentPage - 4, normalizedTotalPages - maxVisibleDots));
    const end = start + maxVisibleDots - 1;

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const renderArrow = ({
    label,
    href,
    disabled,
    onClick,
    direction,
  }: {
    label: string;
    href?: string;
    disabled: boolean;
    onClick: () => void;
    direction: "previous" | "next";
  }) => {
    const icon = direction === "previous" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6";
    const classes = `${arrowButtonClassName} ${disabled ? disabledArrowClassName : "hover:bg-white dark:hover:bg-slate-700"}`;
    const content = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-slate-700 dark:text-slate-200">
        <path d={icon} />
      </svg>
    );

    if (href && !disabled) {
      return (
        <a key={label} href={href} aria-label={label} aria-disabled={disabled} className={classes}>
          {content}
        </a>
      );
    }

    return (
      <button type="button" aria-label={label} aria-disabled={disabled} disabled={disabled} onClick={onClick} className={classes}>
        {content}
      </button>
    );
  };

  return (
    <div className="mx-auto w-fit max-w-full">
      <div className="flex items-center justify-center gap-2">
        <div className={className}>
          {renderArrow({
            label: "Previous page",
            href: previousHref,
            disabled: prevDisabled,
            onClick: handlePrevious,
            direction: "previous",
          })}

          {shouldRenderDots ? (
            <div className="flex min-w-0 items-center justify-center gap-1.5 overflow-hidden">
              {getVisiblePageIndices().map((page) => {
                const isActive = page === currentPage;
                const href = pageHrefs?.[page];

                if (href) {
                  return (
                    <a
                      key={page}
                      href={href}
                      aria-label={`Go to page ${page + 1}`}
                      aria-current={isActive ? "page" : undefined}
                      className={isActive ? activeDotClassName : dotClassName}
                    />
                  );
                }

                return (
                  <button
                    key={page}
                    type="button"
                    aria-label={`Go to page ${page + 1}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onPageChange?.(page)}
                    className={isActive ? activeDotClassName : dotClassName}
                  />
                );
              })}
            </div>
          ) : null}

          {renderArrow({
            label: "Next page",
            href: nextHref,
            disabled: nextDisabled,
            onClick: handleNext,
            direction: "next",
          })}
        </div>
      </div>
    </div>
  );
}
