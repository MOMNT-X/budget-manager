import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ReferenceLine } from "recharts";

interface CandlestickData {
  month: string;
  budget: number;   // Budget allocation (opening)
  actual: number;   // Actual expenses (closing)
  high: number;     // Highest single expense in month
  low: number;      // Lowest single expense in month
}

interface CandlestickChartProps {
  data: CandlestickData[];
}

export function CandlestickChart({ data }: CandlestickChartProps) {
  const CustomCandlestick = (props: any) => {
    const { payload, x, y, width, height } = props;
    
    if (!payload) return null;
    
    const { budget, actual, high, low } = payload;
    
    // Calculate the scale based on the Y-axis domain
    const allValues = data.flatMap(d => [d.budget, d.actual, d.high, d.low]);
    const minValue = Math.min(...allValues) * 0.9;
    const maxValue = Math.max(...allValues) * 1.1;
    const valueRange = maxValue - minValue;
    
    // Scale function to convert values to pixel positions
    const scaleY = (value: number) => {
      const ratio = (maxValue - value) / valueRange;
      return y + ratio * height;
    };
    
    // Calculate positions
    const centerX = x + width / 2;
    const highY = scaleY(high);
    const lowY = scaleY(low);
    const budgetY = scaleY(budget);
    const actualY = scaleY(actual);
    
    // Determine colors
    const isOverBudget = actual > budget;
    const bodyColor = isOverBudget ? '#ef4444' : '#22c55e';
    const wickColor = '#6b7280';
    
    // Body dimensions
    const bodyWidth = width * 0.6;
    const bodyX = centerX - bodyWidth / 2;
    const bodyTop = Math.min(budgetY, actualY);
    const bodyBottom = Math.max(budgetY, actualY);
    const bodyHeight = Math.max(Math.abs(bodyBottom - bodyTop), 3);
    
    return (
      <g>
        {/* High-Low Wick */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={lowY}
          stroke={wickColor}
          strokeWidth={2}
        />
        
        {/* High cap */}
        <line
          x1={centerX - 6}
          y1={highY}
          x2={centerX + 6}
          y2={highY}
          stroke={wickColor}
          strokeWidth={2}
        />
        
        {/* Low cap */}
        <line
          x1={centerX - 6}
          y1={lowY}
          x2={centerX + 6}
          y2={lowY}
          stroke={wickColor}
          strokeWidth={2}
        />
        
        {/* Body (Budget to Actual) */}
        <rect
          x={bodyX}
          y={bodyTop}
          width={bodyWidth}
          height={bodyHeight}
          fill={bodyColor}
          stroke={bodyColor}
          strokeWidth={1}
          opacity={0.9}
        />
        
        {/* Center line to show budget vs actual clearly */}
        <line
          x1={bodyX}
          y1={budgetY}
          x2={bodyX + bodyWidth}
          y2={budgetY}
          stroke="#ffffff"
          strokeWidth={1}
          opacity={0.8}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isOverBudget = data.actual > data.budget;
      const variance = data.actual - data.budget;
      const variancePercent = ((variance / data.budget) * 100);
      
      return (
        <div className="bg-card border rounded-lg p-4 shadow-lg min-w-52">
          <p className="font-medium mb-3 text-center border-b pb-2">{label}</p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground">Budget</div>
                <div className="font-medium">₦{data.budget.toLocaleString('en-NG')}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Actual</div>
                <div className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  ₦{data.actual.toLocaleString('en-NG')}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground">Highest</div>
                <div className="font-medium">₦{data.high.toLocaleString('en-NG')}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Lowest</div>
                <div className="font-medium">₦{data.low.toLocaleString('en-NG')}</div>
              </div>
            </div>
            
            <div className="border-t pt-2 mt-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground">Variance</div>
                  <div className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                    {variance >= 0 ? '+' : ''}₦{Math.abs(variance).toLocaleString('en-NG')}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Variance %</div>
                  <div className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                    {variancePercent >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate the overall min/max for proper scaling
  const allValues = data.flatMap(d => [d.budget, d.actual, d.high, d.low]);
  const minValue = Math.min(...allValues) * 0.9;
  const maxValue = Math.max(...allValues) * 1.1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => `₦${(value/1000).toFixed(0)}k`}
          domain={[minValue, maxValue]}
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        {/* Invisible bars for proper chart structure and hover areas */}
        <Bar 
          dataKey="high" 
          fill="transparent"
          stroke="transparent"
          shape={<CustomCandlestick />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}