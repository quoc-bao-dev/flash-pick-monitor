import React from 'react';
import { cn } from '@/common/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BarChartDataPoint {
  value: number;
  label?: string;
}

export type BarChartColor = 'primary' | 'success' | 'error' | 'warning' | 'info';

const colorBaseMap: Record<BarChartColor, { r: number; g: number; b: number; hover: string }> = {
  primary: { r: 249, g: 115, b: 22,  hover: 'hover:bg-orange-500' },
  success: { r: 16,  g: 185, b: 129, hover: 'hover:bg-emerald-500' },
  error:   { r: 239, g: 68,  b: 68,  hover: 'hover:bg-red-500' },
  warning: { r: 251, g: 146, b: 60,  hover: 'hover:bg-orange-400' },
  info:    { r: 59,  g: 130, b: 246, hover: 'hover:bg-blue-500' },
};

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarChartDataPoint[] | number[];
  /** Chart container height in px */
  height?: number;
  color?: BarChartColor;
  /** Gap between bars in px */
  gap?: number;
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Min bar opacity (0–1) for gradient effect */
  minOpacity?: number;
}

// ─── Bar ──────────────────────────────────────────────────────────────────────
interface BarProps {
  value: number;
  maxValue: number;
  ratio: number;       // 0–1 position in dataset (for gradient)
  height: number;      // container height
  color: BarChartColor;
  label?: string;
  showTooltip: boolean;
  minOpacity: number;
}

function Bar({ value, maxValue, ratio, height, color, label, showTooltip, minOpacity }: BarProps) {
  const { r, g, b, hover } = colorBaseMap[color];
  const opacity = minOpacity + ratio * (1 - minOpacity);
  const barHeightPx = maxValue > 0 ? (value / maxValue) * height : 0;

  return (
    <div className="relative flex-1 flex flex-col justify-end group/bar">
      {/* Tooltip */}
      {showTooltip && (
        <div
          className={cn(
            'absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20',
            'px-2 py-1 rounded-md text-[10px] font-mono font-bold text-white',
            'bg-zinc-900 border border-white/10 shadow-xl',
            'opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 pointer-events-none',
            'whitespace-nowrap',
          )}
        >
          {label ?? value}
        </div>
      )}
      {/* Bar */}
      <div
        className={cn(
          'w-full rounded-t-sm transition-all duration-300 cursor-default',
          hover,
        )}
        style={{
          height: barHeightPx,
          backgroundColor: `rgba(${r},${g},${b},${opacity})`,
        }}
      />
    </div>
  );
}

// ─── BarChart ─────────────────────────────────────────────────────────────────
export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      height = 128,
      color = 'primary',
      gap = 4,
      showTooltip = true,
      minOpacity = 0.08,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // Normalize: support both number[] and BarChartDataPoint[]
    const points: BarChartDataPoint[] = data.map((d) =>
      typeof d === 'number' ? { value: d } : d,
    );

    const maxValue = Math.max(...points.map((p) => p.value), 1);

    return (
      <div
        ref={ref}
        className={cn('w-full flex items-end', className)}
        style={{ height, gap, ...style }}
        aria-label="Bar chart"
        role="img"
        {...props}
      >
        {points.map((point, i) => (
          <Bar
            key={i}
            value={point.value}
            maxValue={maxValue}
            ratio={(i + 1) / points.length}  // increases L→R for gradient feel
            height={height}
            color={color}
            label={point.label ?? `${point.value}`}
            showTooltip={showTooltip}
            minOpacity={minOpacity}
          />
        ))}
      </div>
    );
  },
);

BarChart.displayName = 'BarChart';
